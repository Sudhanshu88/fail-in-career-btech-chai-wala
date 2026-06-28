# Fail In Career - B.Tech Chai Wala

A complete full-stack responsive web application for managing a modern tea stall. 

## Features
- **User Side:** Browse Menu (Tea & Snacks), Add to Cart, Online Checkout, User Dashboard, Order Tracking, Feedback system.
- **Admin Side:** Dashboard with Stats, Order Management (Status updates), User Management.
- **UI/UX:** Responsive Design, Modern Café Theme, Tailwind CSS.
- **Security:** JWT Authentication, Bcrypt Password Hashing.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, MySQL, JWT, bcrypt, multer

## Installation Guide

### Prerequisites
- Node.js installed
- MySQL Server installed and running

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI).
2. Execute the `database.sql` script located in the root folder of this project to create the database (`btech_chai_wala`) and all required tables.
3. Insert some initial categories and products into the database if desired. (An admin account can be auto-created using credentials `admin` / `admin123` upon first login attempt).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database credentials in `backend/.env` if they differ from the defaults (user: root, no password).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173` in your browser.

## Default Credentials
- **Admin Login:** username: `admin`, password: `admin123`
- **User Login:** Register a new user from the UI.
