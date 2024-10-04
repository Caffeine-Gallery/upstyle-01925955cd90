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
                
                const viewDownloadButton = document.createElement('button');
                viewDownloadButton.textContent = 'View/Download';
                viewDownloadButton.className = 'view-download-button';
                viewDownloadButton.onclick = () => viewOrDownloadFile(fileName);
                
                fileItem.appendChild(deleteButton);
                fileItem.appendChild(viewDownloadButton);
                fileList.appendChild(fileItem);
            });
        } catch (error) {
            console.error('Error updating file list:', error);
            alert('Error updating file list. Please refresh the page.');
        }
    }

    async function viewOrDownloadFile(fileName) {
        try {
            const fileEntry = await backend.getFile(fileName);
            if (fileEntry) {
                const { content, contentType } = fileEntry;
                const blob = new Blob([new Uint8Array(content)], { type: contentType });
                
                if (contentType.startsWith('image/') || contentType === 'text/plain') {
                    // View the file
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else {
                    // Download the file
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            } else {
                alert('File not found');
            }
        } catch (error) {
            console.error('Error viewing/downloading file:', error);
            alert('Error viewing/downloading file. Please try again.');
        }
    }

    updateFileList();
});
