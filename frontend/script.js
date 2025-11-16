// API endpoint - change this to your backend URL
const API_URL = 'https://moodify-springboot-backend.onrender.com/api/analyse';

// YouTube Player variables
let player;
let isYouTubeReady = false;

// YouTube IFrame API ready callback
function onYouTubeIframeAPIReady() {
    console.log('✅ YouTube IFrame API is ready');
    isYouTubeReady = true;
}

// Extract YouTube video ID from URL
function extractVideoId(url) {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

// Play YouTube video
function playYouTubeVideo(videoId) {
    const playerContainer = document.getElementById('youtubePlayerContainer');
    
    if (!videoId) {
        console.error('No video ID provided');
        return;
    }
    
    // Destroy existing player if any
    if (player) {
        player.destroy();
    }
    
    // Add active class to show player
    playerContainer.classList.add('active');
    
    // Create new player
    player = new YT.Player('youtubePlayer', {
        height: '280',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

function onPlayerReady(event) {
    console.log('✅ YouTube player is ready');
    event.target.playVideo();
}

function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    alert('Sorry, there was an error playing the video.');
}

// Wake up servers on page load
window.addEventListener('load', () => {
    console.log('🚀 Waking up servers...');

    // Wake up FastAPI backend
    fetch('https://moodify-fastapi-backend.onrender.com/start-server')
        .then(res => res.json())
        .then(data => console.log('✅ FastAPI server is awake:', data))
        .catch(err => console.log('⚠️ FastAPI server warming up:', err.message));
    
    // Wake up Spring Boot backend
    fetch('https://moodify-springboot-backend.onrender.com/api/health')
        .then(res => res.json())
        .then(data => console.log('✅ Spring Boot server is awake:', data))
        .catch(err => console.log('⚠️ Spring Boot server warming up:', err.message));
    
});

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

// Compress image if needed (to stay under 10MB)
async function compressImage(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    // If file is already small enough, return as is
    if (file.size <= maxSize) {
        return file;
    }
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Reduce dimensions to compress
                const scale = Math.sqrt(maxSize / file.size);
                width *= scale;
                height *= scale;
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                }, 'image/jpeg', 0.8);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Analyze button click
analyzeBtn.addEventListener('click', async () => {
    if (!currentImage) {
        alert('Please select or capture an image first!');
        return;
    }
    
    // Show loading
    outputContent.innerHTML = '<div style="color: #1db954;">Analyzing your mood...</div>';
    outputContent.style.display = 'block';
    outputBox.querySelector('.output-placeholder').style.display = 'none';
    analyzeBtn.disabled = true;
    
    try {
        // Compress image if needed
        const compressedImage = await compressImage(currentImage);
        
        // Create form data
        const formData = new FormData();
        formData.append('image', compressedImage);
        
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
        
        // Extract data from response
        const mood = data.song_mood || 'UNKNOWN';
        const aiComment = data.ai_comment || 'Mood detected! 😊';
        const songName = data.song_name || 'No song available';
        const songLink = data.song_link || '';
        
        // Convert \n to <br> for proper line breaks in HTML
        const formattedComment = aiComment.replace(/\\n/g, '<br>').replace(/\n/g, '<br>');
        
        // Get mood emoji
        const moodEmoji = getMoodEmoji(mood);
        
        // Display result with proper formatting
        outputContent.innerHTML = `
            <div style="text-align: center; padding: 10px;">
                <div style="font-size: 3rem; margin-bottom: 10px; animation: fadeIn 0.5s ease-in;">
                    ${moodEmoji}
                </div>
                <div style="font-size: 1.4rem; font-weight: bold; color: #1db954; margin-bottom: 15px; letter-spacing: 1px;">
                    ${mood}
                </div>
                <div style="font-size: 1rem; color: #fff; margin-bottom: 20px; line-height: 1.8; padding: 15px 20px; background: linear-gradient(135deg, rgba(29, 185, 84, 0.15) 0%, rgba(29, 185, 84, 0.05) 100%); border-radius: 12px; border: 2px solid rgba(29, 185, 84, 0.3); box-shadow: 0 4px 15px rgba(29, 185, 84, 0.1); text-align: left;">
                    ${formattedComment}
                </div>
                <div style="background: linear-gradient(135deg, #282828 0%, #1a1a1a 100%); padding: 15px; border-radius: 12px; margin-top: 10px; border: 1px solid #333;">
                    <div style="font-size: 0.8rem; color: #888; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">🎵 Now Playing</div>
                    <div style="font-size: 1.1rem; font-weight: 600; color: #1db954; margin-bottom: 12px;">
                        ${songName}
                    </div>
                    ${songLink ? `
                        <button id="playSongBtn" 
                           style="display: inline-block; background: linear-gradient(135deg, #1db954 0%, #1ed760 100%); color: #000; 
                                  padding: 10px 24px; border-radius: 25px; border: none;
                                  font-weight: 700; font-size: 0.9rem; transition: all 0.3s ease;
                                  cursor: pointer; box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);"
                           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(29, 185, 84, 0.5)';"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(29, 185, 84, 0.3)';">
                            ▶️ Play Song
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        outputContent.style.display = 'block';
        
        // Play YouTube video when button is clicked
        if (songLink) {
            const videoId = extractVideoId(songLink);
            if (videoId && isYouTubeReady) {
                // Add event listener to play button
                setTimeout(() => {
                    const playBtn = document.getElementById('playSongBtn');
                    if (playBtn) {
                        playBtn.addEventListener('click', () => {
                            playYouTubeVideo(videoId);
                        });
                        
                        // Auto-play after showing results
                        playYouTubeVideo(videoId);
                    }
                }, 100);
            } else if (songLink) {
                // Fallback: open in new tab if YouTube API not ready
                setTimeout(() => {
                    const playBtn = document.getElementById('playSongBtn');
                    if (playBtn) {
                        playBtn.addEventListener('click', () => {
                            window.open(songLink, '_blank');
                        });
                    }
                }, 100);
            }
        }
        
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

// Helper function to get emoji based on mood
function getMoodEmoji(mood) {
    const emojis = {
        'HAPPY': '😊',
        'SAD': '😢',
        'LOVE': '❤️',
        'ENERGETIC': '⚡'
    };
    return emojis[mood.toUpperCase()] || '😊';
}
