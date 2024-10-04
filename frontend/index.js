import { backend } from 'declarations/backend';

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
            const blob = [...uint8Array];

            progressBar.style.width = '50%';

            const result = await backend.uploadFile(file.name, blob, file.type);
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
                await backend.deleteFile(fileName);
                updateFileList();
            };
            
            fileItem.appendChild(deleteButton);
            fileList.appendChild(fileItem);
        });
    }

    updateFileList();
});
