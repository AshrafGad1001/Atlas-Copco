
const { execSync, spawn } = require("child_process");
const fs = require("fs");

const run = async () => {
  console.log("Seeding DB...");
  const envContent = fs.readFileSync("../atlas-copco-backend/.env", "utf8");
  let testUri = process.env.MONGO_URI_TEST || "";
  let mainUri = process.env.MONGO_URI || "";
  envContent.split("\n").forEach(line => {
    if (line.startsWith("MONGO_URI_TEST=") && !testUri) testUri = line.substring(line.indexOf("=") + 1).trim();
    if (line.startsWith("MONGO_URI=") && !mainUri) mainUri = line.substring(line.indexOf("=") + 1).trim();
  });
  
  const seeder = `
    const mongoose = require("mongoose");
    const User = require("../src/models/User");
    const Region = require("../src/models/Region");
    mongoose.connect(process.env.MONGO_URI_TEST).then(async () => {
      await mongoose.connection.db.dropDatabase();
      const reg1 = await Region.create({ name: "Region 1" });
      const reg2 = await Region.create({ name: "Region 2" });
      await User.create({ fullName: "Admin User", username: "admin", email: "admin@t.com", password: "Admin12345", role: "admin", phones: [{number: "01000000000"}] });
      await User.create({ fullName: "Eng One", username: "ashraf123", email: "eng1@t.com", password: "password@123", role: "engineer", region: reg1._id, phones: [{number: "01011111111"}] });
      await User.create({ fullName: "Visit Eng", username: "visitEng", email: "veng@t.com", password: "password@123", role: "engineer", region: reg1._id, phones: [{number: "01011111112"}] });
      await User.create({ fullName: "Eng Two", username: "eng2", email: "eng2@t.com", password: "password@123", role: "engineer", region: reg2._id, phones: [{number: "01022222222"}] });
      const Company = require("../src/models/Company");
      await Company.create({ name: "Test Company 1", region: reg1._id, phone: "01000000000", isClient: true });
      console.log("Seeded");
      process.exit(0);
    });
  `;
  fs.writeFileSync("../atlas-copco-backend/scratch/seedE2e.js", seeder);
  execSync("node scratch/seedE2e.js", { 
    cwd: "../atlas-copco-backend", 
    stdio: "inherit",
    env: { ...process.env, MONGO_URI_TEST: testUri, MONGO_URI: mainUri }
  });

  console.log("Starting Backend...");
  const backend = spawn("npm", ["run", "start"], { 
    cwd: "../atlas-copco-backend",
    env: { ...process.env, MONGO_URI: testUri, PORT: "5000" },
    shell: true,
    stdio: "pipe"
  });
  backend.stdout.on("data", d => console.log("BACKEND:", d.toString()));
  backend.stderr.on("data", d => console.log("BACKEND ERR:", d.toString()));

  console.log("Starting Frontend...");
  const frontend = spawn("npm", ["start"], {
    cwd: ".",
    env: { ...process.env, PORT: "3000", BACKEND_URL: "http://localhost:5000" },
    shell: true,
    stdio: "pipe"
  });
  frontend.stdout.on("data", d => console.log("FRONT:", d.toString()));
  frontend.stderr.on("data", d => console.log("FRONT ERR:", d.toString()));

  await new Promise(r => setTimeout(r, 8000));

  console.log("Running Playwright...");
  try {
    execSync("npx playwright test --workers=1", { stdio: "inherit" });
  } catch(e) {
    console.error("Playwright failed");
  }

  backend.kill();
  frontend.kill();
  process.exit(0);
};

run();

