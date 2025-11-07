// API endpoint - change this to your backend URL
const API_URL = 'http://localhost:8000/api/analyze';

// Get elements
const imageBox = document.getElementById('imageBox');
const placeholder = document.getElementById('placeholder');
const preview = document.getElementById('preview');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const cameraBtn = document.getElementById('cameraBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const outputBox = document.getElementById('outputBox');
const outputContent = document.getElementById('outputContent');

let currentImage = null;
let stream = null;
let isCameraActive = false;

// Upload button click
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        stopCamera();
        displayImage(file);
    }
});

// Click on image box to upload
imageBox.addEventListener('click', (e) => {
    if (!isCameraActive && e.target === imageBox) {
        fileInput.click();
    }
});

// Display image preview
function displayImage(file) {
    currentImage = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        preview.src = e.target.result;
        placeholder.style.display = 'none';
        preview.style.display = 'block';
        video.style.display = 'none';
        analyzeBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

// Camera button click
cameraBtn.addEventListener('click', async () => {
    if (isCameraActive) {
        capturePhoto();
    } else {
        await startCamera();
    }
});

// Start camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' }, 
            audio: false 
        });
        
        video.srcObject = stream;
        placeholder.style.display = 'none';
        preview.style.display = 'none';
        video.style.display = 'block';
        isCameraActive = true;
        cameraBtn.textContent = '📸 Capture Photo';
        
    } catch (error) {
        console.error('Camera error:', error);
        alert('Could not access camera. Please check permissions.');
    }
}

// Capture photo from camera
function capturePhoto() {
    if (!isCameraActive) return;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        currentImage = file;
        
        preview.src = canvas.toDataURL('image/jpeg');
        placeholder.style.display = 'none';
        video.style.display = 'none';
        preview.style.display = 'block';
        analyzeBtn.disabled = false;
        
        stopCamera();
    }, 'image/jpeg');
}

// Stop camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    isCameraActive = false;
    cameraBtn.textContent = '📸 Use Camera';
    video.style.display = 'none';
}

// Analyze button click
analyzeBtn.addEventListener('click', async () => {
    if (!currentImage) {
        alert('Please select or capture an image first!');
        return;
    }
    
    // Show loading
    outputContent.innerHTML = '<div style="color: #1db954;">🔄 Analyzing your mood...</div>';
    outputContent.style.display = 'block';
    outputBox.querySelector('.output-placeholder').style.display = 'none';
    analyzeBtn.disabled = true;
    
    // Create form data
    const formData = new FormData();
    formData.append('image', currentImage);
    
    try {
        // Send to API
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        // Get response text
        const data = await response.json();
        const resultText = data.result || data.mood || data.message || JSON.stringify(data);
        
        // Display result
        outputContent.innerHTML = resultText;
        outputContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        
        // Show demo result if API fails
        const demoResults = [
            "You seem to be feeling happy and energetic! 😊",
            "Your mood appears calm and peaceful 😌",
            "You're radiating positive vibes! ✨",
            "Looks like you're in a thoughtful mood 🤔",
            "You seem excited and ready for action! 🚀"
        ];
        
        const randomResult = demoResults[Math.floor(Math.random() * demoResults.length)];
        outputContent.innerHTML = randomResult;
        outputContent.style.display = 'block';
        
        // Alert user about demo mode
        setTimeout(() => {
            alert('Note: Using demo mode. Connect to your API endpoint to get real results.');
        }, 500);
    }
    
    analyzeBtn.disabled = false;
});
