const fs = require('fs');
let c = fs.readFileSync('src/app/(engineer)/engineer/visits/page.tsx', 'utf8');
c = c.replace(/onClick=\{handleExport\}/, 'onClick={handleExport} data-testid="export-csv-btn"');
fs.writeFileSync('src/app/(engineer)/engineer/visits/page.tsx', c);
