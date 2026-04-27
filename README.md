# Task Manager Application

This project is a Task Manager application consisting of a Node.js backend API and a React frontend.

## Prerequisites

- Node.js installed on your machine.
- MongoDB installed or a MongoDB connection string (for the backend).

## Getting Started

### 1. Backend Setup

The backend is built with Node.js, Express, and Mongoose, and features AI integrations.

1. Navigate to the `BackEnd` directory:
   ```bash
   cd BackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   - Make sure you have a `.env` file in the `BackEnd` directory with the required variables (e.g., database connection URL, API keys).

4. Start the backend server:
   ```bash
   node src/app.js
   ```
   *The server will typically run on http://localhost:5000 (depending on your port configuration).*

### 2. Frontend Setup

The frontend is a React application built with Vite, Tailwind CSS, and Redux Toolkit.

1. Open a new terminal and navigate to the `FrontEnd` directory:
   ```bash
   cd FrontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   # or
   npm run dev
   ```
   *The frontend will typically be accessible at http://localhost:5173.*

## Technologies Used

- **Backend**: Node.js, Express, Mongoose, @google/generative-ai
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, React Router DOM, Axios
