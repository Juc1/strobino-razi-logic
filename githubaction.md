200436

Added a Github Action to sync this repo to the avicenna website

Trigger: change to index.html
Actions
1) Using splitter.js, create the following files in a temporary / virtual dist folder from the source file index.html: 

## Generated Files
*   **riccardo-github.css** 
*   **riccardo-github.js**: mindmapData
*   **data.json**: Isolated `mindmapData` for Drupal consumption.
*   **fragment.html**: Clean HTML body content.
*   **successful-deployment.txt**: Build verification log.

2) deploy the generated files to the /dist folder on the remote server using a private SSH key
3) run clear cache and log report commands on the remote server
4) destroy the temporary folder

---


