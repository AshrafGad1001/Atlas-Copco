
const fs = require("fs");
for (const file of ["src/app/(admin)/layout.tsx", "src/app/(engineer)/layout.tsx"]) {
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(
    "if (!user) {\n        router.replace(\"/login\");\n      } else if",
    "if (!user) {\n        // Handled by AuthProvider/middleware\n      } else if"
  );
  s = s.replace(
    "if (!user) {\n        router.replace('/login');\n      } else if",
    "if (!user) {\n        // Handled by AuthProvider/middleware\n      } else if"
  );
  fs.writeFileSync(file, s);
}

