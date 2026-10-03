
const fs = require("fs");
let c = fs.readFileSync("src/app/(admin)/admin/companies/page.tsx", "utf8");

c = c.replace(/<Button onClick=\{\(\) => handleImport\(true\)\} variant="contained" disabled=\{!importFile \|\| importing\}>/g, "<Button data-testid=\\"import-preview-btn\\" onClick={() => handleImport(true)} variant=\\"contained\\" disabled={!importFile || importing}>");

c = c.replace(/<Button onClick=\{\(\) => handleImport\(false\)\} variant="contained" color="primary" disabled=\{!importFile \|\| importing\}>/g, "<Button data-testid=\\"import-confirm-btn\\" onClick={() => handleImport(false)} variant=\\"contained\\" color=\\"primary\\" disabled={!importFile || importing}>");

fs.writeFileSync("src/app/(admin)/admin/companies/page.tsx", c);

