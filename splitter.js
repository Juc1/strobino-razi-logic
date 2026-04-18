const fs = require('fs');
const path = require('path');

/**
 * Splitter Script for Mulakhkhas Interactive Mindmap
 * 
 * This script takes a single-file HTML "blob" and splits it into:
 * 1. riccardo-github.css (Extracted styles)
 * 2. riccardo-github.js  (Extracted logic)
 * 3. data.json           (Extracted mindmapData object)
 * 4. fragment.html       (Clean HTML body for Drupal embedding)
 */

const inputFile = 'index.html'; 
const outputDir = 'dist';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

try {
    const html = fs.readFileSync(inputFile, 'utf8');

    // 1. Extract CSS
    console.log('Extracting CSS...');
    const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (cssMatch) {
        fs.writeFileSync(path.join(outputDir, 'riccardo-github.css'), cssMatch[1].trim());
        console.log(' - Created riccardo-github.css');
    }

    // 2. Extract JS and Split Data from Logic
    console.log('Extracting scripts...');
    const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
    
    if (scriptMatch) {
        const fullScript = scriptMatch[1];
        
        // Extract mindmapData specifically for the JSON file (for Drupal to use)
        const dataMatch = fullScript.match(/const mindmapData = ({[\s\S]*?});/);
        if (dataMatch) {
            fs.writeFileSync(path.join(outputDir, 'data.json'), dataMatch[1].trim());
            console.log(' - Created data.json');
        }

        // We KEEP the full script (including the data) in the riccardo-github.js file
        // so the visualization logic has immediate access to its data.
        fs.writeFileSync(path.join(outputDir, 'riccardo-github.js'), fullScript.trim());
        console.log(' - Created riccardo-github.js');
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

    // 5. Create a deployment verification log
    const timestamp = new Date().toISOString();
    fs.writeFileSync(path.join(outputDir, 'successful-deployment.txt'), 'Successful deployment from GitHub at ' + timestamp);
    console.log(' - Created successful-deployment.txt');

    console.log('\nSuccess! Your clean Drupal assets are in the /dist folder.');


} catch (err) {
    console.error('Error processing file:', err.message);
    process.exit(1);
}
