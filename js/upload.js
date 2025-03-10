/**
 * Upload functionality for the Image Cropper & Converter
 */

// DOM Elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const uploadContainer = document.getElementById('upload-container');
const editorSection = document.getElementById('editor-section');

// Global variables
let originalFile = null;
let originalFileSize = 0;
let imageFiles = []; // Array to store multiple image files for batch processing
let currentImageIndex = 0; // Index of the current image being processed
let processedImages = []; // Array to store processed images

/**
 * Initialize upload functionality
 */
function initUpload() {
    // Add event listeners for drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Add event listener for file input
    // Use a flag to prevent multiple clicks
    let isFileInputActive = false;
    
    uploadArea.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Prevent multiple clicks
        if (isFileInputActive) return;
        
        isFileInputActive = true;
        fileInput.click();
        
        // Reset flag after a short delay
        setTimeout(() => {
            isFileInputActive = false;
        }, 1000);
    });
    
    fileInput.addEventListener('change', handleFileSelect);
}

/**
 * Handle dragover event
 * @param {DragEvent} e - The dragover event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
}

/**
 * Handle dragleave event
 * @param {DragEvent} e - The dragleave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
}

/**
 * Handle drop event
 * @param {DragEvent} e - The drop event
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
    
    const dt = e.dataTransfer;
    const files = dt.files;
    
    handleFiles(files);
}

/**
 * Handle file selection from input
 * @param {Event} e - The change event
 */
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

/**
 * Process the selected files
 * @param {FileList} files - The list of files
 */
function handleFiles(files) {
    if (files.length === 0) return;
    
    // Reset arrays
    imageFiles = [];
    processedImages = [];
    currentImageIndex = 0;
    
    // Filter out non-image files
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.match('image.*')) {
            imageFiles.push(files[i]);
        }
    }
    
    if (imageFiles.length === 0) {
        alert('Bitte wählen Sie mindestens ein Bild aus.');
        return;
    }
    
    // If there's only one image, process it normally
    if (imageFiles.length === 1) {
        const file = imageFiles[0];
        
        // Store the original file and its size
        originalFile = file;
        originalFileSize = file.size;
        
        // Display the file size
        document.getElementById('original-size').textContent = formatFileSize(originalFileSize);
        
        // Load the image
        loadImage(file);
    } else {
        // Show batch processing UI
        showBatchProcessingUI();
    }
}

/**
 * Show the batch processing UI
 */
function showBatchProcessingUI() {
    // Hide upload container
    uploadContainer.style.display = 'none';
    
    // Show batch section
    const batchSection = document.getElementById('batch-section');
    batchSection.style.display = 'block';
    
    // Update total images count
    document.getElementById('total-images').textContent = imageFiles.length;
    
    // Set up batch processing buttons
    const processAllButton = document.getElementById('process-all-button');
    const downloadAllButton = document.getElementById('download-all-button');
    const cancelBatchButton = document.getElementById('cancel-batch-button');
    
    processAllButton.addEventListener('click', startBatchProcessing);
    downloadAllButton.addEventListener('click', downloadAllProcessedImages);
    cancelBatchButton.addEventListener('click', cancelBatchProcessing);
    
    // Load the first image for preview
    loadFirstImageForPreview();
}

/**
 * Load the first image for preview
 */
function loadFirstImageForPreview() {
    // Load the first image into the editor
    originalFile = imageFiles[0];
    originalFileSize = originalFile.size;
    
    // Load the image
    loadImage(originalFile);
}

/**
 * Load the image into the editor
 * @param {File} file - The image file
 */
function loadImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = document.getElementById('image');
        img.src = e.target.result;
        
        // Show the editor section
        uploadContainer.style.display = 'none';
        editorSection.style.display = 'block';
        
        // Initialize the cropper
        initCropper();
    };
    
    reader.readAsDataURL(file);
}

/**
 * Format file size in KB or MB
 * @param {number} bytes - The file size in bytes
 * @returns {string} - The formatted file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize upload functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', initUpload);

/**
 * Start batch processing of all images
 */
function startBatchProcessing() {
    // Reset processed images array
    processedImages = [];
    
    // Disable process all button
    document.getElementById('process-all-button').disabled = true;
    
    // Reset progress bar
    const progressBar = document.getElementById('batch-progress-bar');
    progressBar.style.width = '0%';
    
    // Clear results container
    const resultsContainer = document.getElementById('batch-results');
    resultsContainer.innerHTML = '';
    
    // Start processing the first image
    currentImageIndex = 0;
    processBatchImage();
}

/**
 * Process the current image in the batch
 */
function processBatchImage() {
    if (currentImageIndex >= imageFiles.length) {
        // All images processed
        finishBatchProcessing();
        return;
    }
    
    // Update progress display
    document.getElementById('current-image-number').textContent = currentImageIndex + 1;
    const progressPercent = (currentImageIndex / imageFiles.length) * 100;
    document.getElementById('batch-progress-bar').style.width = progressPercent + '%';
    
    // Get the current file
    const file = imageFiles[currentImageIndex];
    
    // Load the image and process it
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Create a temporary image element
        const img = new Image();
        img.onload = function() {
            // Create a canvas to crop the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Get the current settings
            const width = parseInt(widthInput.value) || img.width;
            const height = parseInt(heightInput.value) || img.height;
            const quality = parseInt(qualitySlider.value) / 100;
            const convertToJpg = convertToJpgCheckbox.checked;
            const fillColor = bgColorInput.value;
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;
            
            // Fill with background color
            ctx.fillStyle = fillColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw the image centered
            const scale = Math.min(width / img.width, height / img.height);
            const x = (width - img.width * scale) / 2;
            const y = (height - img.height * scale) / 2;
            
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            // Get the original file format
            const originalFormat = file.type;
            const isPng = originalFormat === 'image/png';
            
            // Determine the output format
            // Only convert if the original is PNG and convert to JPG is checked
            const outputFormat = (isPng && convertToJpg) ? 'image/jpeg' : originalFormat;
            const fileExtension = outputFormat === 'image/jpeg' ? '.jpg' : 
                                 outputFormat === 'image/png' ? '.png' : 
                                 '.' + originalFormat.split('/')[1];
            
            canvas.toBlob(async function(blob) {
                try {
                    // Compress the image
                    const options = {
                        maxSizeMB: 10,
                        maxWidthOrHeight: 4096,
                        useWebWorker: true,
                        fileType: outputFormat,
                        initialQuality: quality
                    };
                    
                    const compressedBlob = await imageCompression(blob, options);
                    
                    // Format the filename: lowercase and replace spaces/underscores with hyphens
                    const originalFilename = file.name.split('.')[0]; // Get filename without extension
                    const formattedFilename = originalFilename
                        .toLowerCase()
                        .replace(/[\s_]+/g, '-');
                    
                    // Create URL for the processed image
                    const processedImageUrl = URL.createObjectURL(compressedBlob);
                    
                    // Add to processed images array
                    processedImages.push({
                        name: formattedFilename + fileExtension,
                        blob: compressedBlob,
                        originalSize: file.size,
                        newSize: compressedBlob.size,
                        url: processedImageUrl
                    });
                    
                    // Add to results display
                    addBatchResultItem(file.name, file.size, compressedBlob.size, processedImageUrl);
                    
                    // Add to session processed images list
                    addProcessedImage(formattedFilename + fileExtension, compressedBlob, processedImageUrl, file.size, compressedBlob.size);
                    
                    // Process next image
                    currentImageIndex++;
                    processBatchImage();
                } catch (error) {
                    console.error('Error processing image:', error);
                    
                    // Add error to results display
                    addBatchResultItemError(file.name);
                    
                    // Process next image
                    currentImageIndex++;
                    processBatchImage();
                }
            }, outputFormat, quality);
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

/**
 * Add a batch result item to the results container
 */
function addBatchResultItem(fileName, originalSize, newSize, imageUrl) {
    const resultsContainer = document.getElementById('batch-results');
    
    const reduction = ((originalSize - newSize) / originalSize) * 100;
    
    const resultItem = document.createElement('div');
    resultItem.className = 'batch-result-item';
    resultItem.innerHTML = `
        <img src="${imageUrl}" alt="${fileName}" class="result-thumbnail">
        <div class="result-info">
            <p>${fileName}</p>
            <p>Original: ${formatFileSize(originalSize)} → Neu: ${formatFileSize(newSize)}</p>
            <p>Reduktion: ${reduction.toFixed(2)}%</p>
        </div>
        <div class="result-status success">Erfolg</div>
    `;
    
    resultsContainer.appendChild(resultItem);
}

/**
 * Add an error batch result item to the results container
 */
function addBatchResultItemError(fileName) {
    const resultsContainer = document.getElementById('batch-results');
    
    const resultItem = document.createElement('div');
    resultItem.className = 'batch-result-item';
    resultItem.innerHTML = `
        <div class="result-info">
            <p>${fileName}</p>
            <p>Fehler bei der Verarbeitung</p>
        </div>
        <div class="result-status error">Fehler</div>
    `;
    
    resultsContainer.appendChild(resultItem);
}

/**
 * Finish batch processing
 */
function finishBatchProcessing() {
    // Update progress bar to 100%
    document.getElementById('batch-progress-bar').style.width = '100%';
    
    // Enable download all button
    document.getElementById('download-all-button').disabled = false;
    
    // Re-enable process all button
    document.getElementById('process-all-button').disabled = false;
}

/**
 * Download all processed images as a ZIP file
 */
async function downloadAllProcessedImages() {
    if (processedImages.length === 0) {
        alert('Keine Bilder zum Herunterladen.');
        return;
    }
    
    try {
        // Create a new JSZip instance
        const zip = new JSZip();
        
        // Add all processed images to the zip
        processedImages.forEach(image => {
            zip.file(image.name, image.blob);
        });
        
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // Create a download link
        const downloadUrl = URL.createObjectURL(zipBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'processed-images.zip';
        
        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error creating ZIP file:', error);
        alert('Fehler beim Erstellen der ZIP-Datei.');
    }
}

/**
 * Cancel batch processing and return to upload screen
 */
function cancelBatchProcessing() {
    // Hide batch section
    document.getElementById('batch-section').style.display = 'none';
    
    // Hide editor section
    editorSection.style.display = 'none';
    
    // Show upload container
    uploadContainer.style.display = 'flex';
    
    // Reset file input
    fileInput.value = '';
    
    // Clean up
    processedImages.forEach(image => {
        if (image.url) {
            URL.revokeObjectURL(image.url);
        }
    });
    
    // Reset arrays
    imageFiles = [];
    processedImages = [];
    currentImageIndex = 0;
}

// Expose functions to global scope
window.initUpload = initUpload;
window.handleFiles = handleFiles;
window.loadImage = loadImage;
window.formatFileSize = formatFileSize;
window.originalFile = originalFile;
window.originalFileSize = originalFileSize;
window.startBatchProcessing = startBatchProcessing;
window.downloadAllProcessedImages = downloadAllProcessedImages;
window.cancelBatchProcessing = cancelBatchProcessing;
