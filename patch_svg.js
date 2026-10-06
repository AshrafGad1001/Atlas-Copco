const fs = require('fs');
let c = fs.readFileSync('src/components/visits/VisitDetails.tsx', 'utf8');

c = c.replace(/<svg className="w-4 h-4 ml-1\.5"/g, '<svg width="16" height="16" style={{marginLeft: 6}}');
c = c.replace(/<svg className="w-5 h-5 ml-2 text-gray-500"/g, '<svg width="20" height="20" style={{marginLeft: 8, color: "#6b7280"}}');

fs.writeFileSync('src/components/visits/VisitDetails.tsx', c);
