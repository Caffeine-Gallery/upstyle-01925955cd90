import { Actor, HttpAgent } from "@dfinity/agent";

const agent = new HttpAgent();
const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId: process.env.BACKEND_CANISTER_ID,
});

document.addEventListener('DOMContentLoaded', async () => {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const fileList = document.getElementById('fileList');

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';

        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            progressBar.style.width = '50%';

            const result = await backend.uploadFile(file.name, Array.from(uint8Array), file.type);
            console.log(result);

            progressBar.style.width = '100%';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
            }, 1000);

            updateFileList();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
            progressContainer.style.display = 'none';
        }
    });

    async function updateFileList() {
        try {
            const files = await backend.getFileNames();
            fileList.innerHTML = '';
            files.forEach(fileName => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.textContent = fileName;
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = async () => {
                    try {
                        await backend.deleteFile(fileName);
                        updateFileList();
                    } catch (error) {
                        console.error('Error deleting file:', error);
                        alert('Error deleting file. Please try again.');
                    }
                };
                
                const viewButton = document.createElement('button');
                viewButton.textContent = 'View';
                viewButton.className = 'view-button';
                viewButton.onclick = () => viewFile(fileName);
                
                fileItem.appendChild(deleteButton);
                fileItem.appendChild(viewButton);
                fileList.appendChild(fileItem);
            });
        } catch (error) {
            console.error('Error updating file list:', error);
            alert('Error updating file list. Please refresh the page.');
        }
    }

    async function viewFile(fileName) {
        try {
            const fileContent = await backend.getFileContent(fileName);
            
            if (fileContent) {
                const canisterId = process.env.BACKEND_CANISTER_ID || '';
                const network = process.env.DFX_NETWORK || 'local';
                const host = network === 'ic' ? 'raw.ic0.app' : 'localhost:8000';
                const protocol = network === 'ic' ? 'https://' : 'http://';
                
                const url = `${protocol}${canisterId}.${host}/file/${fileName}`;
                window.open(url, '_blank');
            } else {
                alert('File not found');
            }
        } catch (error) {
            console.error('Error viewing file:', error);
            alert('Error viewing file. Please try again.');
        }
    }

    updateFileList();
});
