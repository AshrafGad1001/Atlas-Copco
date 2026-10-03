
const fs = require("fs");
let c = fs.readFileSync("src/components/companies/CompanyFormModal.tsx", "utf8");
c = c.replace(/CircularProgress, Alert/g, "CircularProgress, Alert, Typography");
fs.writeFileSync("src/components/companies/CompanyFormModal.tsx", c);

