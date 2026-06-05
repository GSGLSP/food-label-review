const fs = require('fs');
const path = require('path');

const fixes = {
  "F:\\food-label-review\\server\\src\\app.module.ts": { to: "'../prisma/prisma.module'", search: "'../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\label\\label.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\label\\label.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\report\\report.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\report\\report.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\review\\review.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\review\\review.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\user\\user.module.ts": { to: "'../../prisma/prisma.module'", search: "'../../prisma/prisma'" },
  "F:\\food-label-review\\server\\src\\modules\\user\\services\\user.service.ts": { to: "'../../prisma/prisma.service'", search: "'../../prisma/prisma'" },
};

for (const [fp, fix] of Object.entries(fixes)) {
  let c = fs.readFileSync(fp, 'utf8');
  const before = c;
  c = c.split(fix.search).join(fix.to);
  if (c !== before) {
    fs.writeFileSync(fp, c);
    console.log('fixed:', path.basename(fp));
  } else {
    console.log('unchanged:', path.basename(fp));
  }
}
console.log('done');