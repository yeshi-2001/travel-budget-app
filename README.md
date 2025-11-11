# TripTrack - Complete Travel Budget Planning & Real-Time Tracking

##  Comprehensive Travel Budget Management Application

A three-phase travel management system: **PLAN** your budget before traveling, **TRACK** spending during the trip with GPS, and **COMPARE** planned vs actual after completion.

### Core Features
-  **Pre-Trip Planning**: Detailed day-by-day budget planning
-  **Real-Time Tracking**: GPS-based expense tracking with notifications
-  **Post-Trip Analysis**: Comprehensive planned vs actual comparison
-  **Route Integration**: Interactive maps with location-based alerts
-  **Group Management**: Advanced expense splitting and settlements
-  **Smart Budgeting**: Category-wise and destination-wise planning

### Tech Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Storage**: AWS S3
- **Maps**: Google Maps API
- **OCR**: Tesseract.js

### Quick Start
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Project Structure
```
TripTrack/
├── frontend/          # React application
├── backend/           # Node.js API server
├── database/          # SQL migrations & seeds
├── docs/             # API documentation
└── docker/           # Docker configuration
```
