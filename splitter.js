const fs = require('fs');
const path = require('path');

/**
 * Splitter Script for Mulakhkhas Interactive Mindmap
 * 
 * This script takes a single-file HTML "blob" and splits it into:
 * 1. mulakhkhas.css (Extracted styles)
 * 2. mulakhkhas.js  (Extracted logic)
 * 3. data.json      (Extracted mindmapData object)
 * 4. fragment.html  (Clean HTML body for Drupal embedding)
 */

const inputFile = 'index.html'; 
const outputDir = 'dist';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

try {
    const html = fs.readFileSync(inputFile, 'utf8');

    // 1. Extract CSS from <style> tags
    console.log('Extracting CSS...');
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (cssMatch) {
        fs.writeFileSync(path.join(outputDir, 'mulakhkhas.css'), cssMatch[1].trim());
        console.log(' - Created mulakhkhas.css');
    }

    // 2. Extract mindmapData and convert to clean JSON
    console.log('Extracting Data...');
    const dataMatch = html.match(/const mindmapData = ({[\s\S]*?});/);
    if (dataMatch) {
        // We trim and ensure it's a valid object structure before saving
        fs.writeFileSync(path.join(outputDir, 'data.json'), dataMatch[1].trim());
        console.log(' - Created data.json');
    }

    // 3. Extract JS Logic (scripts that don't contain the massive data blob)
    console.log('Extracting JS Logic...');
    const scripts = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
    let logicJs = '';
    scripts.forEach(s => {
        const content = s.replace(/<\/?script>/g, '');
        // Skip the script that contains the data to keep logic separate
        if (!content.includes('mindmapData')) {
            logicJs += content.trim() + '\n\n';
        }
    });
    if (logicJs) {
        fs.writeFileSync(path.join(outputDir, 'mulakhkhas.js'), logicJs);
        console.log(' - Created mulakhkhas.js');
    }

    // 4. Create the HTML Fragment (Body content only, no machinery)
    console.log('Creating HTML Fragment...');
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
    if (bodyMatch) {
        let fragment = bodyMatch[1]
            .replace(/<style>[\s\S]*?<\/style>/g, '')
            .replace(/<script>[\s\S]*?<\/script>/g, '');
        fs.writeFileSync(path.join(outputDir, 'fragment.html'), fragment.trim());
        console.log(' - Created fragment.html');
    }

    console.log('\nSuccess! Your clean Drupal assets are in the /dist folder.');

} catch (err) {
    console.error('Error processing file:', err.message);
    process.exit(1);
}
