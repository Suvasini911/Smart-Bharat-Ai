# Smart Bharat – AI Civic Companion

A modern, responsive civic platform designed to bridge the gap between Indian citizens and local government services. Built using **React (Vite)**, **Tailwind CSS v4**, **Node.js (Express)**, and powered by **Google Gemini API** integration.

## Key Features

1. **Smart AI Assistant**: A chat interface powered by Google Gemini tuned to guide citizens on applying for cards (Aadhaar, PAN, Passport), checking eligibility for social schemes (PM-Kisan, Ayushman Bharat), and answering civic queries in **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.
2. **Civic Services Directory**: Full breakdown of documentation checklist, eligibility parameters, step-by-step guides, and links to official portals for 7 major civic services.
3. **Report Public Issues**: A mobile-friendly form allowing citizens to report civic grievances (potholes, garbage, water leaks) with landmarks and photo upload attachments.
4. **Complaint Tracker**: An interactive tracking timeline tool that progresses reported issues from *Logged* -> *Under Review* -> *Assigned* -> *Resolved*.
5. **Personalized Citizen Dashboard**: Tracks search history, saved services, and submitted complaints with real-time status updates.
6. **Dynamic Language Switcher**: Localized interface elements translating texts immediately across all pages.

---

## Tech Stack
* **Frontend**: React, Vite, React Router, Tailwind CSS v4, Axios, Lucide React Icons
* **Backend**: Node.js, Express.js, CORS, Dotenv, Google Gen AI SDK
* **Database**: Persistent JSON File Storage (`backend/data/complaints.json`)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and npm installed.

### Directory Structure
```text
smart-bharat/
├── backend/            # Express.js backend & database file
│   ├── data/           # complaints.json
│   ├── server.js       # Main server & Gemini API integration
│   └── package.json
└── frontend/           # Vite + React frontend
    ├── src/            # Components, Contexts, Pages, Utils
    └── package.json
```

---

### Step 1: Set up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying the example file:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `.env` file and replace `your_gemini_api_key_here` with your official Google Gemini API Key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSy...
   ```
5. Start the backend server (runs on port 5000 by default):
   * For production/standard start:
     ```bash
     npm start
     ```
   * For development (auto-reload with nodemon):
     ```bash
     npm run dev
     ```

*Note: If no Gemini API key is provided, the platform will automatically run in a fallback **Mock AI Mode**, returning simulated civic instructions without breaking.*

---

### Step 2: Set up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Click on the URL output in your terminal (usually `http://localhost:5173`) to launch the civic dashboard.

---

## Evaluation / Hackathon Quick Test
1. **Explore Pages**: Navigate to the **Services** tab to view schemes. Bookmark any service (e.g., PAN Card) and check that it appears on the **Dashboard** tab.
2. **File an Issue**: Go to the **Report Issue** tab. Fill out the fields (e.g., "Water leakage in Sector 2") and select an image. Click *File Complaint*.
3. **Copy ID & Track**: Copy the generated Complaint ID (e.g. `SB-XXXXXX`) from the success modal, go to the **Complaint Tracker**, paste the ID, and click *Track Status*.
4. **Time-Based Simulator**: The backend has a built-in progress simulator. A complaint filed will start as **Logged**. If you refresh or re-track the same ID:
   * After 2 minutes: status advances to **Under Review**
   * After 5 minutes: status advances to **Work Assigned**
   * After 10 minutes: status advances to **Resolved & Closed**
5. **Ask Gemini AI**: Open the **AI Assistant** tab. Select one of the quick chips or ask a custom question (e.g., "What documents are needed for Aadhaar?"). Test in different language selectors to see localized translations.
