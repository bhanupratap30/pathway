# Academic Pathway Recommendation Engine

A production-ready, enterprise-grade web application that helps students and career advisors determine optimal postgraduate academic pathways. The system evaluates academic credentials, tenure, and professional aspirations, providing hyper-personalized advice generated dynamically through a rule-based heuristics classifier, the **Grok (xAI) API**, and a structured actionable roadmap timeline.

---

## Technical Stack

### Frontend
- **React 19** (Vite-based Single Page Application)
- **Redux Toolkit** (Global state management: `recommendation`, `submissions`, `analytics`, `auth`)
- **Material UI (MUI v7)** (Monochrome Notion/Vercel styling)
- **Framer Motion** (Sleek card animations, progress loaders, and timeline entry stagger effects)
- **React Hook Form** (Robust client-side form validation)
- **React Hot Toast** (Response notifications)
- **Axios** (API requests with global error interceptors)

### Backend
- **Java 21 / 25** (Spring Boot 3.3.4 parent)
- **Spring Security** (Stateless CORS, secure HTTP headers, and custom rate limiting)
- **Spring Data MongoDB** (Persist submissions and aggregate metrics)
- **Spring Validation** (REST payload field validation)
- **MapStruct** (Compile-time mapping)
- **Native HttpClient** (Grok xAI completion API requests)

---

## Core Features

### 1. Authentication Flow
The application implements a secure Auth model with route guards:
- **Login/Register View**: Unified sign-in/registration screen with tabs and validation.
- **Continue with Google**: A branded Google Auth button that simulatedly logs the user in under a Google profile and prompts them to connect as a Student or Admin.
- **AuthGuard**: Locks all internal views (`/`, `/recommendation`, `/dashboard`, `/submissions`) behind a login screen. Unauthenticated visitors are automatically redirected.
- **Default Test Accounts**:
  - **Student View**: `student@acdyon.com` / `password123`
  - **Admin View**: `admin@acdyon.com` / `password123`

### 2. Role-Based Portals Separation
User navigation is filtered dynamically based on the registered role:
- **Student Portal**: Accesses the landing home page and gets personalized recommendations by completing the profile form.
- **Admin Portal**: Accesses the Cohort Analytics Dashboard and the Submissions Archive.
- **PortalGuard**: Protects the admin panel from access attempts by students.

### 3. Actionable Roadmap (Next Steps)
Upon generating a recommendation, the engine calculates a custom list of 4 next steps mapping directly to the recommended pathway (PhD, DBA, MBA, Certification, etc.). This roadmap is persisted in the database and rendered on the client as an animated vertical timeline list.

---

## API Documentation

### 1. Generate Recommendation
Generates an academic pathway and creates a submission record.

- **URL**: `POST /api/v1/recommendations`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "qualification": "Master's Degree",
  "experience": 6.5,
  "profession": "Research Assistant",
  "careerGoal": "I want to publish papers and work in academic research as a professor."
}
```
- **Response Body (201 Created)**:
```json
{
  "id": "603d2b27c3f81e28bc0988de",
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "qualification": "Master's Degree",
  "experience": 6.5,
  "profession": "Research Assistant",
  "careerGoal": "I want to publish papers and work in academic research as a professor.",
  "recommendation": "PhD",
  "reason": "Dear Jane Doe, your combination of a Master's Degree, 6.5 years of experience... aligns with a PhD pathway.",
  "nextSteps": [
    "Draft a preliminary research proposal (1,000–1,500 words) defining your research gaps.",
    "Identify and contact 2 potential advisors/research supervisors working in your targeted domain.",
    "Check university GRE/TOEFL requirements and request official transcripts from previous institutions.",
    "Align application deadlines (typically Dec/Jan) and prepare academic letters of recommendation."
  ],
  "createdAt": "2026-06-10T15:30:00"
}
```

---

## Local Setup Instructions

### Prerequisites
- **Java**: JDK 21 or newer installed.
- **Node.js**: v20 or newer.
- **MongoDB**: Local MongoDB instance running on port 27017 or a MongoDB Atlas account.

### Step 1: Run the Backend
1. Navigate to the `backend/` directory.
2. Create a `.env` file (based on `.env.example`). Set your Mongo URI and (optional) Grok API key:
   ```env
   SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/academic_pathway
   GROK_API_KEY=xai-your-key-here
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Step 2: Run the Frontend
1. Navigate to the `frontend/` directory.
2. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
3. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.
