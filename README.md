
<img width="2100" height="1500" alt="social-collage" src="https://github.com/user-attachments/assets/b31e7403-1636-4447-b67a-bad39014a915" />

# River Breeze | Smart Scheduling & Quoting Platform

A custom-built, full-stack web application designed to automate the operational bottleneck of service-based businesses: **quoting and scheduling**. 

Built with the **MERN stack** (MongoDB, Express, React, Node.js) and styled with Tailwind CSS, this platform replaces manual text-message negotiations with an automated funnel that generates instant, highly accurate quotes and mathematically protects the business owner's calendar from unprofitable scheduling gaps.

## 🧠 The Business Problem & Solution

For mobile service businesses (like domestic detailing, plumbing, or landscaping), scheduling is a game of Tetris. If a 1.5-hour job is booked in the middle of a 4-hour open block, it leaves awkward, unbookable 1-hour gaps on either side—costing the business owner money. 

**The Solution:** This app features a custom **Smart Anchor Engine**. When a user requests a time slot, the backend algorithm calculates the requested job duration, adds a mandatory 30-minute travel buffer, and scans the schedule. It will *only* present time slots to the user if the booking sits flush against another job/shift boundary, OR if it leaves a gap large enough to legally fit the company's smallest service package. 

## ✨ Key Features & Architecture

* **Dynamic Quoting Engine:** A complex, state-driven React calculator that adjusts price and time estimates instantly based on base variables (square footage, rooms) and high-friction multipliers (pets, deep-clean add-ons).
* **The Smart Anchor Engine (Scheduling):** A custom Node.js algorithm that prevents schedule fragmentation, maximizing daily revenue for the business owner.
* **Frictionless Returning Client Flow:** Returning users bypass the quoting calculator by verifying their identity (Address + Phone/Email) against the MongoDB database, instantly loading their property specs and historical pricing for a 2-click rebooking process.
* **Admin Dashboard:** A protected route allowing the business owner to manage shifts, confirm/cancel bookings, and track client history.
* **Interactive UI/UX:** Features modern design patterns, including Apple-style glassmorphism, responsive mobile layouts, and a custom CSS clip-path "Magic Reveal" animation to transition between before/after states.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router DOM, React Hot Toast
* **Backend:** Node.js, Express.js, JWT Authentication
* **Database:** MongoDB, Mongoose
* **Integrations:** Google Maps Places API (Address Autocomplete)

## 🚀 How to Run Locally

If you'd like to test the scheduling engine or view the codebase locally, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/hughmorris01/river-breeze-platform.git](https://github.com/hughmorris01/river-breeze-platform.git)
cd river-breeze-platform
```

### 2. Install Dependencies
This project uses a split architecture. You will need to install dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
You will need to create two `.env` files. 

**Backend (`/backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

**Frontend (`/frontend/.env`):**
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_places_api_key
```

### 4. Run the Application
Open two terminal windows to run the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The application should now be running locally. Navigate to `http://localhost:5173` in your browser.

## 💡 Note to Employers / Recruiters

This project was built to demonstrate an understanding of **translating real-world business requirements into scalable code**. The focus was on creating a bulletproof, gap-preventing scheduling algorithm and a UI/UX that actively drives conversions and retains existing clients. I am actively seeking full-stack MERN opportunities—feel free to reach out!
