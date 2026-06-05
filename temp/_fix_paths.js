const fs = require('fs');
const path = require('path');

const files = [
  "F:\\food-label-review\\server\\src\\app.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.service.ts",
  "F:\\food-label-review\\server\\src\\modules\\label\\label.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\label\\label.service.ts",
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.service.ts",
  "F:\\food-label-review\\server\\src\\modules\\report\\report.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\report\\report.service.ts",
  "F:\\food-label-review\\server\\src\\modules\\review\\review.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\review\\review.service.ts",
  "F:\\food-label-review\\server\\src\\modules\\user\\user.module.ts",
  "F:\\food-label-review\\server\\src\\modules\\user\\services\\user.service.ts",
];

const fixes = {
  "F:\\food-label-review\\server\\src\\app.module.ts": "'../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\auth\\auth.service.ts": "'../../prisma/prisma.service'",
  "F:\\food-label-review\\server\\src\\modules\\label\\label.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\label\\label.service.ts": "'../../prisma/prisma.service'",
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\regulation\\regulation.service.ts": "'../../prisma/prisma.service'",
  "F:\\food-label-review\\server\\src\\modules\\report\\report.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\report\\report.service.ts": "'../../prisma/prisma.service'",
  "F:\\food-label-review\\server\\src\\modules\\review\\review.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\review\\review.service.ts": "'../../prisma/prisma.service'",
  "F:\\food-label-review\\server\\src\\modules\\user\\user.module.ts": "'../../prisma/prisma.module'",
  "F:\\food-label-review\\server\\src\\modules\\user\\services\\user.service.ts": "'../../prisma/prisma.service'",
};

for (const fp of files) {
  let c = fs.readFileSync(fp, 'utf8');
  const newPath = fixes[fp];
  // Replace any existing prisma import (module or service)
  c = c.replace(/from\s+'[^']*prisma\/(prisma\.(?:module|service))'/g, `from ${newPath}'`);
  fs.writeFileSync(fp, c);
  console.log('fixed:', path.basename(fp), '->', newPath);
}
console.log('done');