import fs from 'fs';
import path from 'path';

const manifest = {
    name: '@sidekick-coder/lab-core',
    version: '0.0.1',
    items: [],
}

const items = fs.readdirSync('./src');

const optional = [
    '.spec.ts',
    '.test.ts',
    '.spec-d.ts',
]

for (const folder of items) {
    const files = fs.readdirSync(`./src/${folder}`);

    const item = {
        name: folder,
        files: files.map(file => ({
            name: path.basename(file, path.extname(file)),
            path: `./src/${folder}/${file}`,
            optional: optional.some(ext => file.endsWith(ext)),
        }))
    }

    manifest.items.push(item);
}

const manifestPath = path.join(import.meta.dirname, 'manifest.json');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');



