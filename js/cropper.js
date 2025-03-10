/**
 * Cropping functionality for the Image Cropper & Converter
 */

// DOM Elements
const image = document.getElementById('image');
const cropButton = document.getElementById('crop-button');
const resetButton = document.getElementById('reset-button');
const aspectRatioButtons = document.querySelectorAll('.aspect-ratio-button');
const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const maintainRatioCheckbox = document.getElementById('maintain-ratio');
const scaleCanvasCheckbox = document.getElementById('scale-canvas');
const applyDimensionsButton = document.getElementById('apply-dimensions');
const cropBeyondCheckbox = document.getElementById('crop-beyond');
const bgColorInput = document.getElementById('bg-color');

// Global variables
let cropper = null;
let originalImageWidth = 0;
let originalImageHeight = 0;
let currentRatio = NaN;

/**
 * Initialize the cropper
 */
function initCropper() {
    console.log('Initializing cropper...');
    
    // Make sure all DOM elements are available
    if (!image) {
        console.error('Image element not found');
        return;
    }
    
    // Ensure all buttons are properly selected
    const cropButtonCheck = document.getElementById('crop-button');
    const resetButtonCheck = document.getElementById('reset-button');
    const aspectRatioButtonsCheck = document.querySelectorAll('.aspect-ratio-button');
    const applyDimensionsButtonCheck = document.getElementById('apply-dimensions');
    
    console.log('Crop button:', cropButtonCheck);
    console.log('Reset button:', resetButtonCheck);
    console.log('Aspect ratio buttons:', aspectRatioButtonsCheck.length);
    console.log('Apply dimensions button:', applyDimensionsButtonCheck);
    
    // Destroy existing cropper if it exists
    if (cropper) {
        cropper.destroy();
    }
    
    // Always enable "Über Bildgrenzen hinaus croppen" functionality (viewMode 0)
    const viewMode = 0;
    
    // Get the background color
    const backgroundColor = bgColorInput ? bgColorInput.value : '#ffffff';
    
    // Initialize Cropper.js
    cropper = new Cropper(image, {
        viewMode: viewMode, // 0 allows crop box to extend beyond canvas, 1 restricts it
        dragMode: 'move', // Define the dragging mode of the cropper
        aspectRatio: NaN, // Free aspect ratio by default
        autoCropArea: 0.8, // Define the automatic cropping area size
        minContainerWidth: 100,
        minContainerHeight: 100,
        minCanvasWidth: 100,
        minCanvasHeight: 100,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
        zoomable: true, // Enable zoom functionality
        zoomOnWheel: true, // Enable zoom on mouse wheel
        wheelZoomRatio: 0.1, // Zoom ratio when using the wheel
        initialZoomRatio: 0.8, // Set initial zoom to 80% of the workspace
        restore: false, // Don't restore the cropped area after resizing the window
        guides: true, // Show the dashed lines for guiding
        center: true, // Show the center indicator for guiding
        highlight: true, // Show the white modal to highlight the crop box
        cropBoxMovable: true, // Enable to move the crop box
        cropBoxResizable: true, // Enable to resize the crop box
        toggleDragModeOnDblclick: true, // Toggle drag mode between "crop" and "move" when double click on the cropper
        background: true, // Show the grid background
        backgroundColor: backgroundColor, // Set the background color
        ready: function() {
            console.log('Cropper is ready');
            
            // Add zoom controls to the cropper container
            addZoomControls();
            
            // Store original image dimensions
            const imageData = cropper.getImageData();
            originalImageWidth = imageData.naturalWidth;
            originalImageHeight = imageData.naturalHeight;
            
            // Set initial values for width and height inputs
            const cropBoxData = cropper.getCropBoxData();
            widthInput.value = Math.round(cropBoxData.width);
            heightInput.value = Math.round(cropBoxData.height);
        }
    });
    
    // Event handling is now done in the ready option above
    
    // Add event listeners
    cropButton.addEventListener('click', cropImage);
    resetButton.addEventListener('click', resetCropper);
    
    // Add event listeners for aspect ratio buttons
    aspectRatioButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            aspectRatioButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to the clicked button
            this.classList.add('active');
            
            // Set the aspect ratio
            const ratio = this.getAttribute('data-ratio');
            
            if (ratio === 'free') {
                currentRatio = NaN;
                cropper.setAspectRatio(NaN);
            } else {
                const [width, height] = ratio.split(':').map(Number);
                currentRatio = width / height;
                cropper.setAspectRatio(currentRatio);
            }
            
            // Update width and height inputs after changing aspect ratio
            setTimeout(() => {
                const cropBoxData = cropper.getCropBoxData();
                widthInput.value = Math.round(cropBoxData.width);
                heightInput.value = Math.round(cropBoxData.height);
            }, 100);
        });
    });
    
    // Add event listeners for pixel dimensions
    widthInput.addEventListener('input', function() {
        if (maintainRatioCheckbox.checked && !isNaN(currentRatio) && currentRatio > 0) {
            // Calculate height based on width and aspect ratio
            const width = parseInt(this.value) || 0;
            const height = Math.round(width / currentRatio);
            heightInput.value = height;
        }
    });
    
    heightInput.addEventListener('input', function() {
        if (maintainRatioCheckbox.checked && !isNaN(currentRatio) && currentRatio > 0) {
            // Calculate width based on height and aspect ratio
            const height = parseInt(this.value) || 0;
            const width = Math.round(height * currentRatio);
            widthInput.value = width;
        }
    });
    
    // Apply dimensions button
    applyDimensionsButton.addEventListener('click', applyPixelDimensions);
    
    // Background color input
    bgColorInput.addEventListener('change', function() {
        // Update the background color
        const cropperContainer = document.querySelector('.cropper-container');
        if (cropperContainer) {
            cropperContainer.style.backgroundColor = this.value;
        }
    });
    
    // No button should be active by default
}

/**
 * Add zoom controls to the cropper container
 */
function addZoomControls() {
    // Get the cropper container
    const cropperContainer = document.querySelector('.cropper-container');
    if (!cropperContainer) return;
    
    // Create zoom controls container
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.style.position = 'absolute';
    zoomControls.style.bottom = '10px';
    zoomControls.style.right = '10px';
    zoomControls.style.zIndex = '2000';
    zoomControls.style.display = 'flex';
    zoomControls.style.gap = '5px';
    
    // Create zoom in button
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.style.width = '30px';
    zoomInButton.style.height = '30px';
    zoomInButton.style.borderRadius = '50%';
    zoomInButton.style.border = '1px solid #ccc';
    zoomInButton.style.backgroundColor = '#fff';
    zoomInButton.style.cursor = 'pointer';
    zoomInButton.style.fontSize = '18px';
    zoomInButton.style.display = 'flex';
    zoomInButton.style.alignItems = 'center';
    zoomInButton.style.justifyContent = 'center';
    zoomInButton.title = 'Vergrößern';
    
    // Create zoom out button
    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '-';
    zoomOutButton.style.width = '30px';
    zoomOutButton.style.height = '30px';
    zoomOutButton.style.borderRadius = '50%';
    zoomOutButton.style.border = '1px solid #ccc';
    zoomOutButton.style.backgroundColor = '#fff';
    zoomOutButton.style.cursor = 'pointer';
    zoomOutButton.style.fontSize = '18px';
    zoomOutButton.style.display = 'flex';
    zoomOutButton.style.alignItems = 'center';
    zoomOutButton.style.justifyContent = 'center';
    zoomOutButton.title = 'Verkleinern';
    
    // Add event listeners
    zoomInButton.addEventListener('click', function() {
        if (cropper) {
            cropper.zoom(0.1); // Zoom in by 10%
        }
    });
    
    zoomOutButton.addEventListener('click', function() {
        if (cropper) {
            cropper.zoom(-0.1); // Zoom out by 10%
        }
    });
    
    // Add buttons to controls
    zoomControls.appendChild(zoomOutButton);
    zoomControls.appendChild(zoomInButton);
    
    // Add controls to container
    cropperContainer.appendChild(zoomControls);
}

/**
 * Apply pixel dimensions to the crop box
 */
function applyPixelDimensions() {
    if (!cropper) return;
    
    const width = parseInt(widthInput.value) || 0;
    const height = parseInt(heightInput.value) || 0;
    
    if (width <= 0 || height <= 0) {
        alert('Bitte geben Sie gültige Werte für Breite und Höhe ein.');
        return;
    }
    
    // Get current crop box and canvas data
    const cropBoxData = cropper.getCropBoxData();
    const canvasData = cropper.getCanvasData();
    const containerData = cropper.getContainerData();
    
    // Check if we should scale the canvas
    if (scaleCanvasCheckbox.checked) {
        // Calculate new canvas dimensions
        const newCanvasData = {
            width: width,
            height: height,
            // Center the canvas in the container
            left: (containerData.width - width) / 2,
            top: (containerData.height - height) / 2
        };
        
        // Apply the new canvas dimensions
        cropper.setCanvasData(newCanvasData);
        
        // Set the crop box to match the canvas size
        cropBoxData.width = width;
        cropBoxData.height = height;
        cropBoxData.left = newCanvasData.left;
        cropBoxData.top = newCanvasData.top;
    } else {
        // Just set the crop box dimensions without scaling the canvas
        cropBoxData.width = width;
        cropBoxData.height = height;
    }
    
    // Update aspect ratio if maintain ratio is checked
    if (maintainRatioCheckbox.checked) {
        currentRatio = width / height;
        cropper.setAspectRatio(currentRatio);
        
        // Reset aspect ratio buttons
        aspectRatioButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    // Apply the new crop box data
    cropper.setCropBoxData(cropBoxData);
}

/**
 * Crop the image and process it
 */
function cropImage() {
    if (!cropper) return;
    
    // Get the background color
    const fillColor = bgColorInput.value;
    
    // Get the cropped canvas with options
    const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        fillColor: fillColor, // Set the background color for areas outside the image
        width: parseInt(widthInput.value) || undefined, // Set specific width if provided
        height: parseInt(heightInput.value) || undefined // Set specific height if provided
    });
    
    if (!canvas) {
        alert('Fehler beim Zuschneiden des Bildes.');
        return;
    }
    
    // Convert the canvas to a blob and process it
    canvas.toBlob(function(blob) {
        // Process the cropped image (convert and compress)
        processImage(blob, canvas);
    }, 'image/png');
}

/**
 * Reset the cropper
 */
function resetCropper() {
    if (!cropper) return;
    
    // Reset the cropper
    cropper.reset();
    
    // Reset the aspect ratio buttons - no button should be active
    aspectRatioButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset the aspect ratio
    currentRatio = NaN;
    cropper.setAspectRatio(NaN);
    
    // Reset pixel dimensions inputs
    const cropBoxData = cropper.getCropBoxData();
    widthInput.value = Math.round(cropBoxData.width);
    heightInput.value = Math.round(cropBoxData.height);
    
    // Reset checkboxes
    maintainRatioCheckbox.checked = true;
    scaleCanvasCheckbox.checked = false;
}

/**
 * Get the current cropper instance
 * @returns {Cropper} - The cropper instance
 */
function getCropper() {
    return cropper;
}

// Expose functions to global scope
window.initCropper = initCropper;
window.cropImage = cropImage;
window.resetCropper = resetCropper;
window.getCropper = getCropper;
window.applyPixelDimensions = applyPixelDimensions;
