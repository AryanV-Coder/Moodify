# 🎵 Moodify

## 🚀 Live Demo

### 🌐 **[https://moodify-aat.vercel.app/](https://moodify-aat.vercel.app/)**

---

> An intelligent mood-based music recommendation system that analyzes facial expressions using AI and recommends personalized songs matching your emotional state.

---

## 🌟 Overview

Moodify combines the power of AI-driven facial emotion recognition with curated music playlists to deliver a personalized listening experience. Simply upload a photo or use your camera, and let Moodify detect your mood and recommend the perfect song!

### How It Works

1. **Capture Your Mood** - Upload an image or take a selfie using your camera
2. **AI Analysis** - Google Gemini AI analyzes facial expressions to detect emotions
3. **Smart Recommendation** - Get a personalized song from curated playlists matching your mood
4. **Instant Playback** - Song links open automatically for seamless listening

---

## ✨ Features

- 🤖 **AI-Powered Mood Detection** - Uses Google Gemini 2.0 Flash for accurate facial emotion recognition
- 😊 **4 Mood Categories** - HAPPY, SAD, ENERGETIC, LOVE
- 🎵 **Curated Playlists** - 40+ handpicked Hindi songs across all moods
- 📸 **Dual Input Methods** - Upload images or capture live photos
- ⚡ **Real-time Processing** - Fast mood analysis and instant recommendations
- 🎨 **Modern UI** - Clean, Spotify-inspired dark theme interface
- 🔗 **Auto-Play Feature** - Song links open automatically after analysis
- 🌐 **Fully Deployed** - Production-ready with auto-scaling backends

---

## 🛠️ Tech Stack

### Frontend
- **Technologies**: HTML5, CSS3, Vanilla JavaScript
- **UI/UX**: Responsive design with Spotify-inspired dark theme
- **Deployment**: Vercel, Render
- **Features**: File upload, camera capture, real-time preview

### Backend

#### Spring Boot Service (API Gateway)
- **Framework**: Spring Boot 3.x with Java 17
- **Role**: Main API gateway, request orchestration, playlist management
- **Endpoints**:
  - `POST /api/analyse` - Main mood analysis endpoint
  - `GET /api/health` - Health check
- **Deployment**: Render (Docker container)
- **Database**: In-memory playlist repository

#### FastAPI Service (AI Engine)
- **Framework**: FastAPI (Python)
- **Role**: AI-powered facial emotion detection
- **AI Model**: Google Gemini 2.5 Flash
- **Endpoints**:
  - `POST /mood-analysis` - Image analysis endpoint
  - `GET /start-server` - Server wake-up endpoint
- **Deployment**: Render

### Build & Deployment
- **Build Tool**: Maven
- **Containerization**: Docker (multi-stage build)
- **CI/CD**: GitHub → Render
- **Image Registry**: Docker Hub / Render private registry

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Vercel)       │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│  Spring Boot Backend    │
│  (Render - Docker)      │
│  - Request Validation   │
│  - Playlist Management  │
│  - Error Handling       │
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│  FastAPI Backend        │
│     (Render)
│  - Google Gemini AI     │
│  - Mood Detection       │
│  - Image Processing     │
└─────────────────────────┘
```

---

## 📁 Project Structure

```
Moodify/
├── frontend/                    # Frontend application
│   ├── index.html              # Main HTML structure
│   ├── style.css               # Spotify-inspired styling
│   └── script.js               # API calls & UI logic
│
├── moodify/                    # Spring Boot backend
│   ├── src/main/java/com/moodify/moodify/
│   │   ├── controller/
│   │   │   └── MoodifyController.java      # REST endpoints
│   │   ├── service/
│   │   │   ├── AIServiceClient.java        # FastAPI integration
│   │   │   ├── MoodType.java               # Mood strategy interface
│   │   │   ├── HappyMood.java              # Happy mood messages
│   │   │   ├── SadMood.java                # Sad mood messages
│   │   │   ├── EnergeticMood.java          # Energetic mood messages
│   │   │   └── LoveMood.java               # Love mood messages
│   │   ├── entity/
│   │   │   ├── Song.java                   # Song model
│   │   │   └── Playlist.java               # Playlist model
│   │   ├── data/
│   │   │   └── PlaylistRepository.java     # In-memory data store
│   │   ├── enums/
│   │   │   └── Mood.java                   # Mood enum (HAPPY, SAD, etc.)
│   │   └── MoodifyApplication.java         # Spring Boot entry point
│   ├── Dockerfile                           # Docker build configuration
│   └── pom.xml                              # Maven dependencies
│
└── fastapi-backend/            # FastAPI AI service
    ├── main.py                 # FastAPI endpoints & Gemini AI integration
    └── requirements.txt        # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Java**: 17 or higher
- **Maven**: 3.6+
- **Python**: 3.9+
- **Google Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/)

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/AryanV-Coder/Moodify.git
cd Moodify
```

#### 2. Run FastAPI Backend

```bash
cd fastapi-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run server
uvicorn main:app --reload --port 8000
```

#### 3. Run Spring Boot Backend

```bash
cd moodify

# Build and run
./mvnw clean package
./mvnw spring-boot:run

# Or using Docker
docker build -t moodify-backend .
docker run -p 8080:8080 moodify-backend
```

#### 4. Run Frontend

```bash
cd frontend

# Open directly in browser
open index.html
```

#### 5. Update API Endpoints

For local testing, update `script.js`:

```javascript
const API_URL = 'http://localhost:8080/api/analyse';
```

And update `AIServiceClient.java`:

```java
private static final String FASTAPI_URL = "http://localhost:8000/mood-analysis";
```

---

## 📡 API Documentation

### Spring Boot Endpoints

#### Analyze Mood
```http
POST /api/analyse
Content-Type: multipart/form-data

Parameters:
  image: File (JPEG, PNG, up to 10MB)

Response:
{
  "song_name": "Dosti",
  "song_mood": "HAPPY",
  "song_link": "https://youtube.com/...",
  "message": "You're radiating positive energy! Keep spreading those good vibes! 🌟"
}
```

#### Health Check
```http
GET /api/health

Response:
{
  "status": "ok"
}
```

### FastAPI Endpoints

#### Mood Analysis
```http
POST /mood-analysis
Content-Type: multipart/form-data

Parameters:
  image: File (Image)

Response:
{
  "status": "success",
  "response": "HAPPY"
}
```

#### Server Wake-up
```http
GET /start-server

Response:
{
  "status": "success"
}
```

---

## 🎵 Playlist Data

Each mood category contains 4 carefully curated Hindi songs:

- **HAPPY** 😊 - Upbeat, cheerful tracks
- **SAD** 😢 - Melancholic, emotional ballads  
- **ENERGETIC** ⚡ - High-energy, dance tracks
- **LOVE** ❤️ - Romantic, soulful melodies

Total: **16 songs** across all categories

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd moodify
docker build -t moodify-backend .
```

### Run Container

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  moodify-backend
```

### Docker Compose (Full Stack)

```yaml
version: '3.8'
services:
  spring-backend:
    build: ./moodify
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
  
  fastapi-backend:
    build: ./fastapi-backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

---

## 🌐 Deployment

### Frontend (Vercel)
- **URL**: https://moodify-aat.vercel.app/
- Auto-deploys from `main` branch
- Optimized for performance with CDN

### Spring Boot Backend (Render)
- **URL**: https://moodify-springboot-backend.onrender.com
- Docker container deployment
- Auto-scaling with health checks
- Cold start optimization via frontend ping

### FastAPI Backend (Render)
- **URL**: https://moodify-fastapi-backend.onrender.com
- Google Gemini AI integration
- Automatic scaling with cold start prevention

---

## 🔧 Configuration

### Environment Variables

**Spring Boot** (`application.properties`):
```properties
spring.application.name=Moodify
server.port=${PORT:8080}
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**FastAPI** (`.env`):
```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by**
- Aryan Varshney
- Aneri Gupta
- Tarushi Goel