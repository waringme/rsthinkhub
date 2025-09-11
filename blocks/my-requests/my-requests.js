/**
 * My Requests Block - Simple Universal Editor Config Output
 */

import { readBlockConfig } from '../../scripts/aem.js';

// Global functions for folder interaction
window.toggleFolder = function(folderName) {
  const details = document.getElementById(`details-${folderName}`);
  const icon = document.getElementById(`icon-${folderName}`);
  const header = details.previousElementSibling;
  
  if (details.style.display === 'none') {
    details.style.display = 'block';
    icon.textContent = '▼';
    header.classList.add('expanded');
    
    // Automatically load folder contents when expanded
    loadFolderContents(folderName);
  } else {
    details.style.display = 'none';
    icon.textContent = '▶';
    header.classList.remove('expanded');
  }
};

window.loadFolderContents = async function(folderName) {
  console.log(`Loading contents for folder: ${folderName}`);
  
  try {
    // Construct the AEM Assets API URL for the specific folder
    const aemUrl = 'https://author-p147324-e1509924.adobeaemcloud.com';
    const folderPath = `/rsthinkhub/customers/waring/requests/${folderName}`;
    const assetsApiPath = `/api/assets${folderPath}.json`;
    const fullUrl = `${aemUrl}${assetsApiPath}`;
    
    console.log(`Fetching contents for folder: ${folderName}`);
    console.log('AEM API URL:', fullUrl);
    
    // Make the API call to AEM with basic authentication
    const username = 'cloud1999';
    const password = 'cloud1999!';
    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`AEM Assets API Response for ${folderName}:`, data);
    
    // Extract and display folder contents
    const contents = [];
    
    if (data.children) {
      Object.entries(data.children).forEach(([itemName, itemInfo]) => {
        contents.push({
          name: itemName,
          title: itemInfo['jcr:title'] || itemInfo.title || itemName,
          type: itemInfo['jcr:primaryType'] || itemInfo.type || 'Unknown',
          path: `${folderPath}/${itemName}`
        });
      });
    } else if (data.entities) {
      data.entities.forEach((entity) => {
        const name = entity.properties?.name || entity.name || entity.title;
        if (name) {
          contents.push({
            name: name,
            title: entity.title || name,
            type: entity.type || 'Unknown',
            path: entity.path || `${folderPath}/${name}`
          });
        }
      });
    }
    
    // Display the contents
    displayFolderContents(folderName, contents);
    
  } catch (error) {
    console.error(`Error loading contents for folder ${folderName}:`, error);
    displayFolderContents(folderName, [], error.message);
  }
};

function displayFolderContents(folderName, contents, error = null) {
  const detailsElement = document.getElementById(`details-${folderName}`);
  if (detailsElement) {
    if (error) {
      detailsElement.innerHTML = `
        <p><strong>Error:</strong> ${error}</p>
        <button onclick="loadFolderContents('${folderName}')">Retry</button>
      `;
    } else if (contents.length > 0) {
      const contentsHTML = contents.map((item, index) => 
        `<li class="folder-content-item">
          <strong>${index + 1}. ${item.name}</strong>
          <br><span class="content-type">Type: ${item.type}</span>
          <br><span class="content-path">Path: ${item.path}</span>
        </li>`
      ).join('');
      
      detailsElement.innerHTML = `
        <p><strong>Contents (${contents.length} items):</strong></p>
        <ul class="folder-contents">${contentsHTML}</ul>
      `;
    } else {
      detailsElement.innerHTML = `
        <p><strong>Contents:</strong> No items found</p>
      `;
    }
  }
}

function updateFolderListHTML(folderNames) {
  const folderListElement = document.getElementById('folder-list');
  if (folderListElement) {
    if (folderNames.length > 0) {
      const listHTML = folderNames.map((folderName, index) => 
        `<li class="folder-item" data-folder="${folderName}">
          <div class="folder-header" onclick="toggleFolder('${folderName}')">
            <span class="folder-name">${index + 1}. ${folderName}</span>
            <span class="expand-icon" id="icon-${folderName}">▶</span>
          </div>
          <div class="folder-details" id="details-${folderName}" style="display: none;">
            <p><strong>Folder Name:</strong> ${folderName}</p>
            <p><strong>Path:</strong> /content/dam/rsthinkhub/customers/waring/requests/${folderName}</p>
            <p><strong>Type:</strong> sling:Folder</p>
            <p class="loading-message">Loading contents...</p>
          </div>
        </li>`
      ).join('');
      
      folderListElement.innerHTML = `
        <div class="banner-image">
          <img src="https://s7g10.scene7.com/is/image/AGS487/sample-banner?$welcome=Welcome&$name=Tim&$cta=Special%20Offer%20to%20help%20you%20with%20your%20project%3F&$src-image=AGS487/eaton-motor-2&wid=2000&hei=2000&qlt=100&fit=constrain" alt="Welcome Banner" />
        </div>
        <div class="video-container">
          <iframe 
            src="https://s7g10.scene7.com/s7viewers/html5/VideoViewer.html?asset=AGS487/How%20a%20Contactor%20Works%20Well%20Explained%20_%20Parts%20and%20Operation-AVS&config=DynamicMediaNA/Video&serverUrl=https://s7g10.scene7.com/is/image/&contenturl=https://s7g10.scene7.com/is/content/&posterimage=AGS487/How%20a%20Contactor%20Works%20Well%20Explained%20_%20Parts%20and%20Operation-AVS&videoserverurl=https://s7g10.scene7.com/is/content"
            title="How a Contactor Works - Well Explained Parts and Operation"
            frameborder="0"
            allowfullscreen>
          </iframe>
        </div>
        <h3>My Requests</h3>
        <ul class="folder-list">${listHTML}</ul>
      `;
    } else {
      folderListElement.innerHTML = `
        <h3>No folders found</h3>
      `;
    }
  }
}

async function fetchSubfolders(folderPath) {
  try {
    console.log('Fetching subfolders from AEM for path:', folderPath);
    
    // Construct the AEM Assets API URL
    const aemUrl = 'https://author-p147324-e1509924.adobeaemcloud.com';



    const assetsApiPath = `/api/assets/rsthinkhub/customers/waring/requests.json`;
    const fullUrl = `${aemUrl}${assetsApiPath}`;
    
    console.log('AEM API URL:', fullUrl);
    
    // Make the API call to AEM with basic authentication
    const username = 'cloud1999';
    const password = 'cloud1999!';
    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    console.log('Response Content-Type:', contentType);
    

    
    const data = await response.json();
    console.log('AEM Assets API Response:', data);
    
    // Parse and extract folder names
    const folderNames = [];
    
    // Extract folder names from different response formats
    if (data.children) {
      Object.entries(data.children).forEach(([folderName, folderInfo]) => {
        folderNames.push(folderName);
      });
    } else if (data.entities) {
      data.entities.forEach((entity) => {
        // Extract name from entities -> properties -> name
        const name = entity.properties?.name || entity.name || entity.title;
        if (name) {
          folderNames.push(name);
        }
      });
    }
    
    // Print folder names in a list
    console.log('My Requests Block - Folder Names List:');
    if (folderNames.length > 0) {
      folderNames.forEach((folderName, index) => {
        console.log(`${index + 1}. ${folderName}`);
      });
    } else {
      console.log('No folders found');
    }
    
    // Update HTML with folder list
    updateFolderListHTML(folderNames);
    
    // Also print detailed information
    console.log('My Requests Block - Detailed Folder Information:');
    if (data.children) {
      Object.entries(data.children).forEach(([folderName, folderInfo], index) => {
        console.log(`${index + 1}. ${folderName}`);
        console.log(`   Title: ${folderInfo['jcr:title'] || folderInfo.title || folderName}`);
        console.log(`   Path: ${folderPath}/${folderName}`);
        console.log(`   Type: ${folderInfo['jcr:primaryType'] || folderInfo.type || 'Unknown'}`);
        console.log('');
      });
    } else if (data.entities) {
      data.entities.forEach((entity, index) => {
        const name = entity.properties?.name || entity.name || entity.title || `Item ${index + 1}`;
        console.log(`${index + 1}. ${name}`);
        console.log(`   Properties Name: ${entity.properties?.name || 'Not found'}`);
        console.log(`   Entity Name: ${entity.name || 'Not found'}`);
        console.log(`   Title: ${entity.title || name}`);
        console.log(`   Path: ${entity.path || folderPath}/${name}`);
        console.log(`   Type: ${entity.type || 'Unknown'}`);
        console.log(`   Properties: ${JSON.stringify(entity.properties || {})}`);
        console.log('');
      });
    } else {
      console.log('No subfolders found in:', folderPath);
    }
    
    } catch (error) {
    console.error('Error fetching subfolders from AEM:', error);
    console.log('My Requests Block - Failed to fetch subfolders from:', folderPath);
    
    // Update HTML to show error
    const folderListElement = document.getElementById('folder-list');
    if (folderListElement) {
      folderListElement.innerHTML = `
        <h3>Error loading folders</h3>
        <p>Failed to fetch folders from: ${folderPath}</p>
        <p>Error: ${error.message}</p>
      `;
    }
  }
}

export default function decorate(block) {
  try {
    // Read the Universal Editor configuration
    const config = readBlockConfig(block);
    
    // Set default folder path if not configured
    if (!config.folder) {
      config.folder = '/content/dam/rsthinkhub/customers/waring/requests/';
    }
    
    // Log the configuration
    console.log('My Requests Block - Universal Editor Config:', config);
    
    // Print the folder value specifically
    console.log('My Requests Block - Folder Value:', config.folder);
    
    // Fetch subfolders from AEM
    fetchSubfolders(config.folder);
    
    // Simple output of the configuration
    block.innerHTML = `
      <div class="my-requests">
  

        <div id="folder-list">
          <h3>Loading folders...</h3>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.log(`failed to load module for my-requests`, error);
    block.innerHTML = `<div class="my-requests"><p>Error loading configuration</p></div>`;
  }
}
