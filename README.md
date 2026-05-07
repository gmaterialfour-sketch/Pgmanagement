# StayNear PG Rentals 🏠

A premium, location-based PG discovery and booking SaaS platform designed for students and working professionals. This project features a high-performance Java Spring Boot architecture integrated with official Google Maps APIs and professional-grade infrastructure.

## 🚀 Advanced Architecture

StayNear is built with a focus on scalability, security, and real-time geospatial accuracy.

### 🏗️ Backend (Java Spring Boot 3)
*   **Official Google Maps Integration**: Real-time discovery using Places API, Details API, and Geocoding API.
*   **Intelligent Caching**: Automated 24-hour cache for Google metadata to optimize API costs.
*   **Asynchronous Queuing**: RabbitMQ-powered background tasks for OTP delivery and notifications.
*   **Geospatial Logic**: Native SQL Haversine formula for ultra-fast "Nearby" calculations.
*   **Security & Stability**:
    *   **Rate Limiting**: IP-based throttling using Bucket4j.
    *   **Stateless Auth**: JWT-based authentication with refresh tokens.
    *   **Observability**: Spring Boot Actuator for health and performance metrics.

### 🎨 Frontend (Next.js 15)
*   **Google Maps Autocomplete**: Seamless address search and coordinate detection.
*   **Live Geospatial UI**: Real-time distance calculation ("1.2 km away") and area name detection.
*   **Responsive Design**: Premium dark-mode-ready UI built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Core** | Java 17, Spring Boot 3.3.5, Hibernate |
| **Database** | PostgreSQL 16 |
| **Caching/Messaging** | Redis, RabbitMQ |
| **Frontend** | Next.js 15, React, Tailwind CSS |
| **APIs** | Google Maps Platform (Places, Details, JS SDK) |
| **Infrastructure** | Docker, Maven |

## 🏁 Getting Started

### 1. Prerequisites
*   Docker & Docker Compose
*   Java 17+
*   Node.js 18+

### 2. Environment Setup
Create a `.env` file in the root with your Google Maps API Key:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_key"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pg_rental"
REDIS_URL="redis://localhost:6379"
```

### 3. Run with Docker
```bash
docker-compose up -d
```

### 4. Local Development
*   **Backend**: `npm run dev:backend-java` (Runs port 5000)
*   **Frontend**: `npm run dev:web` (Runs port 3000)

## 📍 Key Features
- [x] **Near Me**: One-click location detection.
- [x] **Dynamic Radius**: Automatic search limited to a strict 2km radius.
- [x] **Smart Fallback**: Intelligent redirection to major hubs (Delhi) if no results are found nearby.
- [x] **PG Analytics**: Occupancy rates, rent comparison, and verified safety ratings.

---
Built with ❤️ by Antigravity for StayNear PG Rentals.
