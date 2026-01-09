const fs = require('fs');
const path = require('path');

const iconSet = require('../icons/line-md.json'); // ajuste o caminho pro seu JSON
const outputDir = path.resolve(__dirname, '../src/icons/line-md');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewBox = '0 0 24 24';

for (const [name, icon] of Object.entries(iconSet.icons)) {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${icon.body}</svg>`;
  const filePath = path.join(outputDir, `${name}.svg`);
  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log(`✅ Exportados ${Object.keys(iconSet.icons).length} SVGs para ${outputDir}`);
