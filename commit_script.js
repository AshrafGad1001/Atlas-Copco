const { execSync } = require('child_process');

try {
  execSync('git add "src/app/(admin)/admin/companies/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(admin)/admin/engineers/[id]/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(admin)/admin/engineers/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(admin)/admin/follow-ups/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(admin)/admin/visits/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(engineer)/engineer/companies/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(engineer)/engineer/follow-ups/page.tsx"', { stdio: 'inherit' });
  execSync('git add "src/app/(engineer)/engineer/visits/page.tsx"', { stdio: 'inherit' });
  execSync('git commit -m "Remove ts-nocheck / Fix MUI types"', { stdio: 'inherit' });
  
  execSync('git add "src/app/(engineer)/engineer/companies/[id]/history/page.tsx"', { stdio: 'inherit' });
  execSync('git commit -m "Fix frontend history API response structure"', { stdio: 'inherit' });
  
  execSync('git add "public/sw.js" "src/middleware.ts" "src/app/layout.tsx"', { stdio: 'inherit' });
  execSync('git commit -m "Fix PWA and Service Worker"', { stdio: 'inherit' });
  
  execSync('git add "src/components/visits/VisitDetails.tsx"', { stdio: 'inherit' });
  execSync('git commit -m "Add photo upload with canvas resize 1600px"', { stdio: 'inherit' });
  
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Misc remaining features fixes"', { stdio: 'inherit' });
  
  execSync('git push', { stdio: 'inherit' });
} catch (e) {
  console.error(e);
}
