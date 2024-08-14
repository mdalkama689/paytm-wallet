# Paytm Wallet

## Overview

The Paytm Wallet is a full-featured application that allows users to:
- Register and log in
- Reset their password
- Change user details and profile image
- Send and receive money
- Search for other users

## Project Structure

The project is organized into two main directories:
- `frontend`: Contains the React application for the user interface.
- `backend`: Contains the Node.js application for server-side logic and API endpoints.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mdalkama689/paytm-wallet.git
cd paytm_wallet
cd paytm_wallet

## Set up the backend
cd backend
npm install

# Create .env file for the backend
echo "MONGO_URI=mongouri
PORT=3001
JWT_SECRET_TOKEN=jwtsecret
CLIENT_URL=http://localhost:3000
YOUR_EMAIL=gmail.com
YOUR_EMAIL_APP_PASSWORD=nbkdsf"

# Start the backend server
npm start

# Set up the frontend
cd ../frontend
npm install

# Start the frontend development server
npm run dev
