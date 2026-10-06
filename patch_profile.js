const fs = require('fs');
let c = fs.readFileSync('src/app/(engineer)/engineer/profile/page.tsx', 'utf8');
c = c.replace(/\/profile\/me/g, '/auth/me');
fs.writeFileSync('src/app/(engineer)/engineer/profile/page.tsx', c);
