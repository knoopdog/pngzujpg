/**
 * Conversion and compression functionality for the Image Cropper & Converter
 */

// DOM Elements
const convertToJpgCheckbox = document.getElementById('convert-to-jpg');
const qualitySlider = document.getElementById('quality-slider');
const qualityValue = document.getElementById('quality-value');
const resultSection = document.getElementById('result-section');
const resultImage = document.getElementById('result-image');
const downloadLink = document.getElementById('download-link');
const newImageButton = document.getElementById('new-image-button');
const newSizeElement = document.getElementById('new-size');
const sizeReductionElement = document.getElementById('size-reduction');
const processedImagesSection = document.getElementById('processed-images-section');
const processedImagesList = document.getElementById('processed-images-list');

// Global variables
let processedBlob = null;
let sessionProcessedImages = []; // Array to store all processed images in the current session

/**
 * Initialize the converter
 */
function initConverter() {
    // Add event listener for quality slider
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
    });
    
    // Add event listener for new image button
    newImageButton.addEventListener('click', resetApplication);
}

/**
 * Add a processed image to the session list
 * @param {string} filename - The filename of the processed image
 * @param {Blob} blob - The processed image blob
 * @param {string} url - The URL of the processed image
 * @param {number} originalSize - The original size of the image in bytes
 * @param {number} newSize - The new size of the image in bytes
 */
function addProcessedImage(filename, blob, url, originalSize, newSize) {
    // Create a new processed image object
    const processedImage = {
        filename: filename,
        blob: blob,
        url: url,
        originalSize: originalSize,
        newSize: newSize,
        timestamp: new Date().toISOString()
    };
    
    // Add to the session processed images array
    sessionProcessedImages.push(processedImage);
    
    // Update the processed images list
    updateProcessedImagesList();
    
    // Show the processed images section if it's not already visible
    processedImagesSection.style.display = 'block';
}

/**
 * Update the processed images list in the UI
 */
function updateProcessedImagesList() {
    // Clear the current list
    processedImagesList.innerHTML = '';
    
    // If there are no processed images, show a message
    if (sessionProcessedImages.length === 0) {
        processedImagesList.innerHTML = '<div class="no-images-message">Noch keine Bilder bearbeitet</div>';
        return;
    }
    
    // Add each processed image to the list
    sessionProcessedImages.forEach((image, index) => {
        // Calculate reduction percentage
        const reduction = ((image.originalSize - image.newSize) / image.originalSize) * 100;
        
        // Create a new list item
        const listItem = document.createElement('div');
        listItem.className = 'processed-image-item';
        listItem.innerHTML = `
            <img src="${image.url}" alt="${image.filename}">
            <div class="processed-image-info">
                <p>${image.filename}</p>
                <p>Reduktion: ${reduction.toFixed(2)}%</p>
                <p>${formatFileSize(image.originalSize)} → ${formatFileSize(image.newSize)}</p>
            </div>
        `;
        
        // Add a click event to download the image
        listItem.addEventListener('click', () => {
            const downloadLink = document.createElement('a');
            downloadLink.href = image.url;
            downloadLink.download = image.filename;
            downloadLink.click();
        });
        
        // Add the list item to the list
        processedImagesList.appendChild(listItem);
    });
}

/**
 * Process the cropped image (convert and compress)
 * @param {Blob} blob - The cropped image blob
 * @param {HTMLCanvasElement} canvas - The cropped canvas
 */
async function processImage(blob, canvas) {
    try {
        // Get the quality value
        const quality = parseInt(qualitySlider.value) / 100;
        
        // Check if we need to convert to JPG
        const convertToJpg = convertToJpgCheckbox.checked;
        
        // Get the original file format
        const originalFormat = originalFile.type;
        const isPng = originalFormat === 'image/png';
        
        // Determine the output format
        // Only convert if the original is PNG and convert to JPG is checked
        const outputFormat = (isPng && convertToJpg) ? 'image/jpeg' : originalFormat;
        const fileExtension = outputFormat === 'image/jpeg' ? '.jpg' : 
                             outputFormat === 'image/png' ? '.png' : 
                             '.' + originalFormat.split('/')[1];
        
        // Compression options
        const options = {
            maxSizeMB: 10,
            maxWidthOrHeight: 4096,
            useWebWorker: true,
            fileType: outputFormat,
            initialQuality: quality
        };
        
        // Compress the image
        const compressedBlob = await imageCompression(blob, options);
        
        // Store the processed blob
        processedBlob = compressedBlob;
        
        // Create a URL for the processed image
        const processedImageUrl = URL.createObjectURL(compressedBlob);
        
        // Display the processed image
        resultImage.src = processedImageUrl;
        
        // Format the filename: lowercase and replace spaces/underscores with hyphens
        const originalFilename = originalFile.name.split('.')[0]; // Get filename without extension
        const formattedFilename = originalFilename
            .toLowerCase()
            .replace(/[\s_]+/g, '-');
        
        const fullFilename = formattedFilename + fileExtension;
        
        // Update the download link
        downloadLink.href = processedImageUrl;
        downloadLink.download = fullFilename;
        
        // Display file size information
        const newSize = compressedBlob.size;
        newSizeElement.textContent = formatFileSize(newSize);
        
        // Calculate size reduction
        const reduction = ((originalFileSize - newSize) / originalFileSize) * 100;
        sizeReductionElement.textContent = reduction.toFixed(2) + '%';
        
        // Add the processed image to the session list
        addProcessedImage(fullFilename, compressedBlob, processedImageUrl, originalFileSize, newSize);
        
        // Show the result section
        editorSection.style.display = 'none';
        resultSection.style.display = 'block';
    } catch (error) {
        console.error('Error processing image:', error);
        alert('Fehler bei der Bildverarbeitung. Bitte versuchen Sie es erneut.');
    }
}

/**
 * Reset the application to the initial state
 */
function resetApplication() {
    console.log('Resetting application...');
    
    // Reset the cropper
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    
    // Clear the image
    image.src = '';
    resultImage.src = '';
    
    // Reset the file input
    fileInput.value = '';
    
    // Reset the quality slider
    qualitySlider.value = 80;
    qualityValue.textContent = '80%';
    
    // Reset the convert to JPG checkbox
    convertToJpgCheckbox.checked = true;
    
    // Reset the aspect ratio buttons
    aspectRatioButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset pixel dimensions inputs
    if (widthInput) widthInput.value = '';
    if (heightInput) heightInput.value = '';
    
    // Reset maintain ratio checkbox
    if (maintainRatioCheckbox) maintainRatioCheckbox.checked = true;
    
    // Reset crop beyond checkbox (keep it checked by default)
    if (cropBeyondCheckbox) cropBeyondCheckbox.checked = true;
    
    // Reset scale canvas checkbox (not checked by default)
    if (scaleCanvasCheckbox) scaleCanvasCheckbox.checked = false;
    
    // Reset background color to white
    if (bgColorInput) bgColorInput.value = '#ffffff';
    
    // Show the upload section
    resultSection.style.display = 'none';
    editorSection.style.display = 'none';
    uploadContainer.style.display = 'flex';
    
    // Release object URLs
    if (resultImage.src) {
        URL.revokeObjectURL(resultImage.src);
    }
    
    // Reset global variables
    originalFile = null;
    originalFileSize = 0;
    processedBlob = null;
    if (typeof currentRatio !== 'undefined') currentRatio = NaN;
    if (typeof originalImageWidth !== 'undefined') originalImageWidth = 0;
    if (typeof originalImageHeight !== 'undefined') originalImageHeight = 0;
    
    // Force a small delay to ensure all UI elements are updated
    setTimeout(() => {
        console.log('Reset complete, upload container should be visible');
    }, 100);
}

// Initialize converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', initConverter);

// Expose functions to global scope
window.initConverter = initConverter;
window.processImage = processImage;
window.resetApplication = resetApplication;
window.processedBlob = processedBlob;
