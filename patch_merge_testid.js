const fs = require('fs');
let c = fs.readFileSync('src/app/(admin)/admin/companies/page.tsx', 'utf8');
c = c.replace(/<Button variant="contained" color="warning" onClick=\{\(\) => setMergeModalOpen\(true\)\}>/, '<Button variant="contained" color="warning" onClick={() => setMergeModalOpen(true)} data-testid="merge-company-btn">');
c = c.replace(/<Button onClick=\{handleMerge\} variant="contained" color="warning" disabled=\{\!targetMergeId\}>/, '<Button onClick={handleMerge} variant="contained" color="warning" disabled={!targetMergeId} data-testid="confirm-merge-btn">');
fs.writeFileSync('src/app/(admin)/admin/companies/page.tsx', c);
