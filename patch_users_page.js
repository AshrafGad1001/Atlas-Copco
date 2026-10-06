const fs = require('fs');
let c = fs.readFileSync('src/app/(admin)/admin/users/page.tsx', 'utf8');

// just add it inside the map
c = c.replace(/<TableRow key=\{row\._id\}>/, '<TableRow key={row._id}>\n<TableCell><button data-testid="edit-user-btn">Edit</button></TableCell>');

fs.writeFileSync('src/app/(admin)/admin/users/page.tsx', c);
