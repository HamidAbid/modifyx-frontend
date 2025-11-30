# The Floral Artistry - E-commerce Website

A full-stack e-commerce website for a modifyx shop, featuring user authentication, product browsing, shopping cart, custom bouquet creation, event organization, and more.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd FYP-Project
```

2. Install dependencies for both frontend and backend:
```
npm install
cd backend
npm install
cd ..
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=mongodb+srv://floral-db:36y8M4MBYFVUwNm1@cluster0.vx1oi3x.mongodb.net/
JWT_SECRET=mySuperSecretKey123!
PORT=5000
```

## Running the Application

### Option 1: Using the start script (Recommended)

This will start both the frontend and backend servers:

```
npm run start
```

### Option 2: Running servers separately

In one terminal, start the backend server:
```
npm run backend
```

In another terminal, start the frontend server:
```
npm run dev
```

## Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Test endpoint: http://localhost:5000/api/test

## Authentication Issues

If you're experiencing authentication issues:

1. Make sure you have internet connection to access MongoDB Atlas
2. Check that the JWT_SECRET is properly set in the backend/.env file
3. Clear your browser's local storage (to remove any invalid tokens)
4. Try registering a new user or using these test credentials:
   - Email: test@example.com
   - Password: password123

## Features

- User authentication (register, login, profile management)
- Product browsing and filtering
- Shopping cart functionality
- Custom bouquet creation
- Event organization services
- modifyx quiz for personalized recommendations
- Order tracking
- Admin dashboard for product and order management

## Technologies Used

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- MongoDB Atlas with Mongoose
- JWT for authentication
- bcrypt for password hashing 