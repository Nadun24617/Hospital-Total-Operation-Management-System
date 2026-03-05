# AI Doctor Suggestion - Setup Guide

## Overview

The AI Doctor Suggestion feature helps patients find the right specialist by analyzing their symptoms using Google Gemini AI. When booking an appointment, patients describe their symptoms, and the system recommends the most relevant medical specialization(s).

### How It Works

```
Patient describes symptoms
        ↓
Backend sends symptoms to Google Gemini API
        ↓
Gemini returns recommended specialization(s)
        ↓
Doctor list is filtered by recommendation
        ↓
Patient selects a doctor and continues booking
```

The AI suggestion is **never a blocker** — patients can always skip it and browse all doctors manually.

---

## Setup

### 1. Get a Free Google Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

> **Free tier limits:** 15 requests/minute, 1,500 requests/day using `gemini-2.0-flash`. No credit card required.

### 2. Add the API Key to Backend Environment

Open `backend/.env` and add:

```env
GEMINI_API_KEY="your-api-key-here"
```

Example:
```env
GEMINI_API_KEY="AIzaSyD8e7zSFGhs0acxeZL4jGVWcSrR7GgHing"
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs `@google/generative-ai` (Google's official Gemini SDK).

### 4. Seed the Doctors

The system needs doctors in the database for the feature to work. Run the seed command:

```bash
cd backend
npx prisma db seed
```

This creates **10 doctors** (one per specialization):

| Doctor | Specialization |
|--------|---------------|
| Dr. Nimal Perera | Cardiology |
| Dr. Kumari Fernando | Dermatology |
| Dr. Ruwan Jayasinghe | Orthopedics |
| Dr. Sanduni Wickramasinghe | Pediatrics |
| Dr. Dilani Rajapaksa | Gynecology & Obstetrics |
| Dr. Prasad De Silva | General Surgery |
| Dr. Chaminda Bandara | Neurology |
| Dr. Anusha Gunawardena | Psychiatry |
| Dr. Kamal Dissanayake | Endocrinology |
| Dr. Sunethra Amarasekara | General Medicine |

### 5. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## Usage

1. Log in as a patient
2. Navigate to **Appointments**
3. You'll see the **"Describe Your Symptoms"** step
4. Type your symptoms (minimum 10 characters)
5. Click **"Get AI Suggestion"**
6. The system shows recommended doctors filtered by specialization
7. Select a doctor and continue with the booking flow

### Skip Option

Click **"Skip — Browse All Doctors"** to bypass the AI suggestion and see all available doctors.

---

## API Endpoint

### `POST /ai-suggestion/check-symptoms`

**Auth:** Bearer token (JWT) required

**Request:**
```json
{
  "symptoms": "I have been experiencing chest pain and shortness of breath"
}
```

**Response:**
```json
{
  "specializations": [
    { "id": 1, "name": "Cardiology", "confidence": "high" },
    { "id": 10, "name": "General Medicine", "confidence": "low" }
  ],
  "reasoning": "Chest pain and shortness of breath are primary indicators for cardiovascular evaluation.",
  "disclaimer": "This is an AI-powered suggestion, not a medical diagnosis. Please consult the doctor for proper evaluation."
}
```

**Validation:**
- `symptoms` must be a string, 10-1000 characters

---

## Architecture

### Backend Files

```
backend/src/ai-suggestion/
├── dto/
│   └── symptom-check.dto.ts      # Input validation
├── ai-suggestion.service.ts       # Gemini API integration
├── ai-suggestion.controller.ts    # REST endpoint
└── ai-suggestion.module.ts        # NestJS module
```

### Frontend Changes

- `frontend/src/pages/AppointmentBooking.tsx` — New "Symptoms" step added before doctor selection

### 10 Supported Specializations

| ID | Specialization |
|----|---------------|
| 1 | Cardiology |
| 2 | Dermatology |
| 3 | Orthopedics |
| 4 | Pediatrics |
| 5 | Gynecology & Obstetrics |
| 6 | General Surgery |
| 7 | Neurology |
| 8 | Psychiatry |
| 9 | Endocrinology |
| 10 | General Medicine |

Defined in `frontend/src/constants/specializations.ts`.

---

## Error Handling

| Scenario | What Happens |
|----------|-------------|
| Gemini API rate limited (429) | Fallback: suggests General Medicine |
| Invalid/missing API key | Fallback: suggests General Medicine |
| Network error | Fallback: suggests General Medicine |
| Malformed AI response | Fallback: suggests General Medicine |
| User skips symptom step | All doctors shown (no filter) |
| No doctors match suggestion | "No doctors found" + "Browse all" button |

The feature is designed to **never block** the appointment booking flow.

---

## Troubleshooting

### "Could not get AI suggestions"
- Check that `GEMINI_API_KEY` is set in `backend/.env`
- Verify the key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- Check if you've exceeded the free tier quota (resets daily)

### No doctors showing up
- Run `npx prisma db seed` in the backend directory
- Check that doctors exist: `npx prisma studio` → open Doctor table

### API returns 401 Unauthorized
- The endpoint requires a valid JWT token
- Make sure the user is logged in before accessing appointments

---

## Cost

**$0** — The feature uses Google Gemini's free tier (`gemini-2.0-flash`), which requires no billing setup or credit card. The free tier provides 1,500 requests per day, which is more than sufficient for development and demo purposes.
