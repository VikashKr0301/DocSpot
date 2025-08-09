# DocSpot - Simple Setup Guide

Quick guide to run the DocSpot medical appointment system locally.

##  Step: 1 - What You Need
1. **Node.js** - Download from https://nodejs.org/


## Step: 2 - Quick Setup

### 1. Extract Project
Extract the DocSpot folder to your computer.

### 2. Install Dependencies
Open **3 terminals** and run these commands:

**Terminal 1:**
```bash
cd backend
npm install
```

**Terminal 2:**
```bash
cd frontend  
npm install
```

**Terminal 3:**
```bash
cd admin
npm install
```

## Step: 3 - Run the Application

In the same 3 terminals, run:

**Terminal 1:**
```bash
cd backend
npm start
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Terminal 3:**
```bash
cd admin
npm run dev
```

## Access URLs
- **User Site**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:4000


## Get Your API Keys

✅ **All API keys are already configured in my project!**

My project includes:
- **MongoDB Atlas**: Connected to your database
- **Cloudinary**: For image storage  
- **Razorpay**: For payment processing
- **Gmail**: For email verification

**No additional setup needed - everything is ready to run!**

## Common Issues

**Port in use?**
```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID [process_id] /F
```


That's it! Your DocSpot application should now be running.