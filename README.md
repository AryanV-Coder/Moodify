# 🎵 Moodify

A mood-based music recommendation system that curates personalized playlists based on your current emotional state.

## Overview

Moodify analyzes user mood inputs and generates customized music playlists that match their emotional context. The system uses sentiment analysis and music categorization to deliver an enhanced listening experience.

## Features

- **Mood Detection**: Input your current mood (Happy, Sad, Energetic, Love)
- **Smart Recommendations**: Get personalized song suggestions based on mood analysis
- **Playlist Generation**: Automatically curated playlists matching your emotional state
- **Multi-Platform**: RESTful API supporting various frontend clients

## Tech Stack

- **Backend**: Java Spring Boot, FastAPI
- **Frontend**: HTML, CSS
- **API**: RESTful architecture
- **Build Tool**: Maven

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+

### Running the Backend

```bash
cd moodify
./mvnw spring-boot:run
```

### Project Structure

```
moodify/
├── src/main/java/com/moodify/
│   ├── models/          # Song, Playlist entities
│   ├── enums/           # Mood types
│   ├── utils/           # Mood processing logic
│   └── routers/         # API endpoints
```

## Team

- Aryan Varshney
- Aneri Gupta
- Tarushi Goel

## License

This project is for educational purposes.