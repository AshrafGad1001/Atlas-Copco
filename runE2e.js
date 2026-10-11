const { execSync, spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const http = require("http");

const getPids = (port) => {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`).toString();
    const lines = out.split('\n').filter(l => l.includes(`:${port}`) && l.includes('LISTENING'));
    return lines.map(l => l.trim().split(/\s+/).pop());
  } catch (e) {
    return [];
  }
};

const killTree = (child) => {
  if (!child || !child.pid) return;
  try {
    if (process.platform === "win32") {
      execSync("taskkill /pid " + child.pid + " /T /F", { stdio: "ignore" });
    } else {
      process.kill(-child.pid, "SIGKILL");
    }
  } catch (e) {}
};

const checkHealth = (url) => new Promise(resolve => {
  http.get(url, (res) => {
    resolve(res.statusCode === 200 || res.statusCode === 404);
  }).on('error', () => resolve(false));
});

const run = async () => {
  for (const port of [3000, 5000]) {
    const pids = getPids(port);
    for (const pid of pids) {
      if (pid && pid !== "0") {
        console.log(`Killing process ${pid} on port ${port}...`);
        try { execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" }); } catch(e){}
      }
    }
  }

  let backend;
  let frontend;
  let exitCode = 0;
  const cleanup = () => {
    killTree(backend);
    killTree(frontend);
  };
  process.on("SIGINT", () => { cleanup(); process.exit(130); });
  process.on("SIGTERM", () => { cleanup(); process.exit(143); });

  try {
    console.log("Seeding DB...");
    const envContent = fs.readFileSync("../atlas-copco-backend/.env", "utf8");
    let testUri = process.env.MONGO_URI_TEST || "";
    let mainUri = process.env.MONGO_URI || "";
    envContent.split("\n").forEach(line => {
      if (line.startsWith("MONGO_URI_TEST=") && !testUri) testUri = line.substring(line.indexOf("=") + 1).trim();
      if (line.startsWith("MONGO_URI=") && !mainUri) mainUri = line.substring(line.indexOf("=") + 1).trim();
    });
    
    const e2eUri = testUri.replace(/\/([^\/?]+)(\?|$)/, (m, db, q) => '/' + db + '_e2e' + q);
    const { assertSafeTestUri } = require("../atlas-copco-backend/tests/testGuard");
    assertSafeTestUri(e2eUri, mainUri);

    const seeder = `
      const mongoose = require("mongoose");
      const User = require("../src/models/User");
      const Region = require("../src/models/Region");
      mongoose.connect("${e2eUri}").then(async () => {
        await mongoose.connection.db.dropDatabase();
        const reg1 = await Region.create({ name: "Region 1" });
        const reg2 = await Region.create({ name: "Region 2" });
        await User.create({ fullName: "Admin User", username: "admin", email: "admin@t.com", password: "Admin12345", role: "admin", phones: [{number: "01000000000"}] });
        await User.create({ fullName: "Eng One", username: "ashraf123", email: "eng1@t.com", password: "password@123", role: "engineer", region: reg1._id, phones: [{number: "01011111111"}] });
        await User.create({ fullName: "Visit Eng", username: "visiteng", email: "veng@t.com", password: "password@123", role: "engineer", region: reg1._id, phones: [{number: "01011111112"}] });
        await User.create({ fullName: "Eng Two", username: "eng2", email: "eng2@t.com", password: "password@123", role: "engineer", region: reg2._id, phones: [{number: "01022222222"}] });
        const Company = require("../src/models/Company");
        await Company.create({ nameAr: "Test Company 1", nameEn: "Test Company 1", region: reg1._id, isClient: true });
        console.log("Seeded");
        process.exit(0);
      }).catch(err => { console.error(err); process.exit(1); });
    `;
    fs.writeFileSync("../atlas-copco-backend/scratch/seedE2e.js", seeder);
    execSync("node scratch/seedE2e.js", { 
      cwd: "../atlas-copco-backend", 
      stdio: "inherit"
    });

    console.log("Starting Backend...");
    backend = spawn("node", ["server.js"], { 
      cwd: "../atlas-copco-backend",
      env: { ...process.env, MONGO_URI: e2eUri, PORT: "5000", NODE_ENV: "test" },
      shell: true,
      stdio: "ignore"
    });

    console.log("Starting Frontend...");
    frontend = spawn("npm", ["start"], {
      cwd: ".",
      env: { ...process.env, PORT: "3000", BACKEND_URL: "http://localhost:5000" },
      shell: true,
      stdio: "ignore"
    });

    let backendReady = false;
    let frontendReady = false;
    for (let i = 0; i < 30; i++) {
      if (!backendReady) backendReady = await checkHealth("http://localhost:5000/api/health");
      if (!frontendReady) frontendReady = await checkHealth("http://localhost:3000/");
      if (backendReady && frontendReady) break;
      await new Promise(r => setTimeout(r, 1000));
    }
    
    if (!backendReady || !frontendReady) {
      console.error(`Servers didn't start. Backend: ${backendReady}, Frontend: ${frontendReady}`);
      exitCode = 1;
      return;
    }

    console.log("Running Playwright...");
    try {
      execSync("npx playwright test --workers=1", { stdio: "inherit" });
    } catch(e) {
      console.error("Playwright failed");
      exitCode = 1;
    }
  } catch (e) {
    console.error(e.message);
    exitCode = 1;
  } finally {
    cleanup();
  }
  process.exit(exitCode);
};

run();
