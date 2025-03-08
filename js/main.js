/**
 * Main application logic for the Image Cropper & Converter
 */

// Check if all required libraries are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Cropper.js is loaded
    if (typeof Cropper === 'undefined') {
        console.error('Cropper.js is not loaded');
        alert('Fehler: Cropper.js konnte nicht geladen werden. Bitte laden Sie die Seite neu.');
        return;
    }
    
    // Check if browser-image-compression is loaded
    if (typeof imageCompression === 'undefined') {
        console.error('browser-image-compression is not loaded');
        alert('Fehler: Die Bildkomprimierungsbibliothek konnte nicht geladen werden. Bitte laden Sie die Seite neu.');
        return;
    }
    
    // Initialize all components
    initializeApplication();
    
    console.log('Image Cropper & Converter initialized successfully');
});

/**
 * Initialize the application
 */
function initializeApplication() {
    // Initialize upload functionality
    if (typeof initUpload === 'function') {
        initUpload();
    } else {
        console.error('initUpload function not found');
    }
    
    // Initialize converter
    if (typeof initConverter === 'function') {
        initConverter();
    } else {
        console.error('initConverter function not found');
    }
    
    // Add direct event listeners to buttons to ensure they work
    attachButtonEventListeners();
    
    // Override the loadImage function to ensure buttons work after image load
    const originalLoadImage = window.loadImage;
    if (originalLoadImage) {
        window.loadImage = function(file) {
            const result = originalLoadImage(file);
            // After image is loaded and cropper is initialized, attach button event listeners again
            setTimeout(attachButtonEventListeners, 500);
            return result;
        };
    }
}

/**
 * Attach event listeners to all buttons
 */
function attachButtonEventListeners() {
    console.log('Attaching button event listeners...');
    
    const cropButton = document.getElementById('crop-button');
    const resetButton = document.getElementById('reset-button');
    const applyDimensionsButton = document.getElementById('apply-dimensions');
    const aspectRatioButtons = document.querySelectorAll('.aspect-ratio-button');
    
    if (cropButton) {
        // Remove existing event listeners
        cropButton.replaceWith(cropButton.cloneNode(true));
        const newCropButton = document.getElementById('crop-button');
        
        newCropButton.addEventListener('click', function() {
            console.log('Crop button clicked');
            if (typeof cropImage === 'function') {
                cropImage();
            } else {
                console.error('cropImage function not found');
            }
        });
    }
    
    if (resetButton) {
        // Remove existing event listeners
        resetButton.replaceWith(resetButton.cloneNode(true));
        const newResetButton = document.getElementById('reset-button');
        
        newResetButton.addEventListener('click', function() {
            console.log('Reset button clicked');
            if (typeof resetCropper === 'function') {
                resetCropper();
            } else {
                console.error('resetCropper function not found');
            }
        });
    }
    
    if (applyDimensionsButton) {
        // Remove existing event listeners
        applyDimensionsButton.replaceWith(applyDimensionsButton.cloneNode(true));
        const newApplyDimensionsButton = document.getElementById('apply-dimensions');
        
        newApplyDimensionsButton.addEventListener('click', function() {
            console.log('Apply dimensions button clicked');
            if (typeof applyPixelDimensions === 'function') {
                applyPixelDimensions();
            } else {
                console.error('applyPixelDimensions function not found');
            }
        });
    }
    
    // For aspect ratio buttons
    aspectRatioButtons.forEach(button => {
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
            console.log('Aspect ratio button clicked:', this.getAttribute('data-ratio'));
            const cropper = window.getCropper ? window.getCropper() : null;
            if (cropper) {
                // Remove active class from all buttons
                document.querySelectorAll('.aspect-ratio-button').forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                this.classList.add('active');
                
                // Set the aspect ratio
                const ratio = this.getAttribute('data-ratio');
                
                if (ratio === 'free') {
                    cropper.setAspectRatio(NaN);
                } else {
                    const [width, height] = ratio.split(':').map(Number);
                    cropper.setAspectRatio(width / height);
                }
            }
        });
    });
}

/**
 * Handle errors
 * @param {Error} error - The error object
 */
function handleError(error) {
    console.error('Application error:', error);
    alert('Ein Fehler ist aufgetreten: ' + error.message);
}

// Global error handling
window.addEventListener('error', function(event) {
    handleError(event.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
    handleError(event.reason);
});

// Export global functions for debugging
window.appDebug = {
    resetApplication: resetApplication,
    getCropper: getCropper
};
