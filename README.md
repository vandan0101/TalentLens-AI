# TalentLens AI

TalentLens AI is an AI-powered mock interview platform built for people who want more than a static question list. The app lets a user sign in with Google, upload a resume, generate role-specific interview questions, answer them in a timed voice-based flow, and receive a structured performance report at the end.

This project is not a plain React starter anymore. The frontend is built with React and Vite, and it works together with an Express backend, MongoDB, OpenRouter, Firebase Authentication, and Razorpay.

## What the product does

The current flow is designed to feel close to a guided mock interview:

1. The user signs in with Google.
2. The user can upload a PDF resume.
3. The backend extracts text from the resume and sends it to AI for structured analysis.
4. The user chooses a role, experience level, and interview mode.
5. AI generates 5 interview questions with increasing difficulty.
6. Each answer is captured in a timed interview flow using browser speech tools.
7. Every answer is evaluated for confidence, communication, and correctness.
8. A final report is generated with question-wise feedback, charts, and a downloadable PDF.
9. The user can revisit old interview reports from history.

## Why this project exists

A lot of interview practice tools feel generic. They ask random questions, give shallow feedback, and do not use the candidate's background in any useful way. TalentLens AI tries to solve that by making the interview more personal:

- The resume upload helps the system ask better questions.
- The role and experience inputs keep the interview relevant.
- The credit system keeps AI usage controlled and predictable.
- The report is meant to be actionable, not just decorative.

## Main features

- Google sign-in with Firebase Authentication
- Resume upload and PDF text extraction
- AI-based resume analysis
- Role-based interview question generation
- Two interview modes: `Technical` and `HR`
- Timer-based answer submission
- Voice playback for AI interviewer prompts
- Speech recognition for candidate answers
- AI scoring for confidence, communication, and correctness
- Final report with charts
- PDF report download
- Interview history tracking
- Credit purchase flow using Razorpay

## Tech stack

### Frontend

- `React 19`
  Used to build the single-page user interface.
- `Vite`
  Used because it gives fast local development and simple frontend bundling.
- `React Router DOM`
  Used for page navigation like home, auth, interview, history, pricing, and report pages.
- `Redux Toolkit`
  Used to keep logged-in user data available across the app, especially credits and profile state.
- `Tailwind CSS`
  Used for fast UI styling and responsive layouts.
- `motion`
  Used for page transitions and interface animation.
- `Recharts`
  Used to show interview performance trends visually.
- `jsPDF` and `jspdf-autotable`
  Used to export the interview report as a PDF.
- `Firebase`
  Used on the client side for Google authentication.

### Backend

- `Node.js`
  Runtime for the server.
- `Express`
  Used to build the API layer.
- `MongoDB + Mongoose`
  Used to store users, interviews, and payments in a structured way.
- `OpenRouter`
  Used as the AI gateway for resume analysis, question generation, and answer evaluation.
- `pdfjs-dist`
  Used to extract text from uploaded resume PDFs.
- `jsonwebtoken`
  Used for session token creation and request authentication.
- `multer`
  Used for handling resume uploads.
- `Razorpay`
  Used to create and verify payment orders for credit purchases.

## AI model used

Right now the backend uses this model inside `server/services/openRouter.service.js`:

- `openai/gpt-4o-mini`

### Why this model is used

- It is fast enough for real-time product flows like question generation and answer evaluation.
- It is strong at following structured prompts and JSON output instructions.
- It is more cost-friendly than heavier flagship models, which matters because the app uses AI multiple times in one interview flow.
- It is a practical fit for tasks like:
  - extracting structured resume details
  - generating interview questions
  - evaluating short candidate answers consistently

### Where the model is used

- Resume analysis
  The backend asks the model to extract `role`, `experience`, `projects`, and `skills` from resume text.
- Question generation
  The backend asks the model to create exactly 5 interview questions with difficulty progression.
- Answer evaluation
  The backend asks the model to score confidence, communication, correctness, and return short feedback.

If you later want stronger reasoning or different pricing/performance tradeoffs, this is the main place to swap the AI model.

## Interview modes

- `Technical`
  Used when the user wants deeper technical questions based on role, experience, projects, and skills.
- `HR`
  Used when the user wants behavior, communication, and professional-scenario style questions.

## Data models

These are the actual database models currently used in the backend.

### `User`

Defined in `server/models/user.model.js`

Fields:

- `name`
- `email`
- `credits`
- `createdAt`
- `updatedAt`

Why we use it:

- Stores the authenticated user's identity.
- Tracks available interview credits.
- Connects the user to interviews and payments.

### `Interview`

Defined in `server/models/interview.model.js`

Main fields:

- `userId`
- `role`
- `experience`
- `mode`
- `resumeText`
- `questions`
- `finalScore`
- `status`
- `createdAt`
- `updatedAt`

Question subdocument fields:

- `question`
- `difficulty`
- `timeLimit`
- `answer`
- `feedback`
- `score`
- `confidence`
- `communication`
- `correctness`

Why we use it:

- Stores the full interview session.
- Keeps the original generated questions.
- Saves every answer and per-question evaluation.
- Makes it possible to show history and detailed reports later.

### `Payment`

Defined in `server/models/payment.model.js`

Fields:

- `userId`
- `planId`
- `amount`
- `credits`
- `razorpayOrderId`
- `razorpayPaymentId`
- `status`
- `createdAt`
- `updatedAt`

Why we use it:

- Tracks which plan the user selected.
- Stores the Razorpay order/payment mapping.
- Prevents payment verification from becoming a blind credit increment.
- Gives a transaction record for credit purchases.

## Credit system

Credits are a core part of the product logic.

- New users start with `100` credits.
- Generating one interview currently costs `50` credits.
- The free plan gives `100` credits.
- The starter plan gives `150` credits for `₹100`.
- The pro plan gives `650` credits for `₹500`.

Why we use credits:

- AI requests have a real cost.
- Credits make usage easier to explain than metered token billing.
- They create a simple upgrade path for users who want more practice sessions.

## Authentication flow

The authentication flow is split across Firebase and the backend:

- Firebase handles Google sign-in on the client.
- The client sends the signed-in user's `name` and `email` to the backend.
- The backend finds or creates the user in MongoDB.
- The backend creates a JWT token and stores it in an HTTP-only cookie.
- Protected routes read that cookie through the `isAuth` middleware.

Why this approach is used:

- Google login removes password management from the project.
- The backend still controls authorization and user-linked data.
- HTTP-only cookies are safer than exposing auth tokens directly to frontend code.

## Resume analysis flow

When a user uploads a resume:

1. `multer` stores the uploaded PDF temporarily.
2. `pdfjs-dist` extracts text from every page.
3. The text is cleaned and sent to AI.
4. AI returns structured JSON with role, experience, projects, and skills.
5. The temporary file is removed.

Why we use this flow:

- It reduces manual input for the user.
- It improves question quality by grounding prompts in actual resume content.
- It makes the setup experience feel smarter and faster.

## Reporting system

The final report currently includes:

- overall score
- confidence score
- communication score
- correctness score
- question-wise feedback
- score trend chart
- downloadable PDF summary

Why this matters:

- A single score alone is not enough for improvement.
- Category-based scoring helps the user understand what to practice next.
- PDF export makes the report shareable and easy to revisit.

## Project structure

```text
TalentLens AI/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── README.md
└── server/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    └── services/
```

## Frontend pages

- `/`
  Landing page with product overview and entry points.
- `/auth`
  Google sign-in page.
- `/interview`
  Main interview flow with setup, live interview, and report steps.
- `/history`
  Shows the user's previous interviews.
- `/pricing`
  Shows plans and starts Razorpay payment flow.
- `/report/:id`
  Loads a saved interview report by ID.

## Backend API overview

### Auth routes

- `POST /api/auth/google`
  Finds or creates the user and sets auth cookie.
- `GET /api/auth/logout`
  Clears the auth cookie.

### User routes

- `GET /api/user/current-user`
  Returns the logged-in user from the cookie session.

### Interview routes

- `POST /api/interview/resume`
  Upload and analyze resume PDF.
- `POST /api/interview/generate-questions`
  Create interview questions and deduct credits.
- `POST /api/interview/submit-answer`
  Evaluate one answer.
- `POST /api/interview/finish`
  Finalize interview and calculate final report.
- `GET /api/interview/get-interview`
  Fetch interview history for current user.
- `GET /api/interview/report/:id`
  Fetch one interview report.

### Payment routes

- `POST /api/payment/order`
  Create Razorpay order and payment record.
- `POST /api/payment/verify`
  Verify payment signature and add credits.

## Environment variables

### Client `.env`

```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Server `.env`

```env
PORT=8000
CLIENT_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## How to run locally

### 1. Install dependencies

In the `client` folder:

```bash
npm install
```

In the `server` folder:

```bash
npm install
```

### 2. Start the backend

```bash
cd server
npm run dev
```

### 3. Start the frontend

```bash
cd client
npm run dev
```

## Current implementation notes

These are worth knowing if you continue building the project:

- The AI model is hardcoded right now in the OpenRouter service.
- Resume upload currently expects PDF files.
- Interview generation deducts credits before the interview begins.
- The browser speech flow depends on native speech APIs, so behavior can vary by browser.
- The report is generated from stored interview data, which is good for history and later analytics.

## Why the architecture makes sense

This stack is a good fit for the product at its current stage:

- `React + Vite` keeps frontend development fast.
- `Express` keeps the API layer simple and easy to debug.
- `MongoDB` fits well because interviews contain nested question data.
- `OpenRouter` makes model switching easier later.
- `Firebase Google Auth` removes a lot of friction for user onboarding.
- `Razorpay` is a practical choice for INR-based payments.

## Future improvements

Some realistic next steps for this project would be:

- save raw transcript versions separately from final answers
- add retry handling for malformed AI JSON responses
- add role templates for common job paths
- support multiple AI models by task
- add admin analytics
- add better browser compatibility handling for speech recognition
- improve payment history visibility for users
- add unit and integration tests

## Final note

This project already has a clear product direction: personalized AI interview practice with measurable feedback. The strongest parts of the current build are the resume-based setup, the structured interview report, and the simple credits-based business model.
