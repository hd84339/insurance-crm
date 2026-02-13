# Installation Guide

This guide will walk you through the complete installation process of the Insurance & Mutual Fund CRM system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v16.0.0 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (v8.0.0 or higher)
   - Comes with Node.js
   - Verify installation: `npm --version`

3. **MongoDB** (v4.4 or higher)
   - **Option A:** Local installation from https://www.mongodb.com/try/download/community
   - **Option B:** MongoDB Atlas (Cloud) - Recommended for beginners
   - Verify installation: `mongosh --version`

4. **Git** (Optional, for version control)
   - Download from: https://git-scm.com/

### System Requirements

**Minimum Requirements:**
- **OS:** Windows 10, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM:** 4GB
- **Storage:** 2GB free space
- **CPU:** Dual-core processor

**Recommended Requirements:**
- **RAM:** 8GB or more
- **Storage:** 5GB free space
- **CPU:** Quad-core processor

## 📦 Step 1: Download the System

You should have three compressed files:
- `insurance-crm-backend.tar.gz`
- `insurance-crm-frontend.tar.gz`
- `insurance-crm-database.tar.gz`

### Extract Files

**On Linux/macOS:**
```bash
tar -xzf insurance-crm-backend.tar.gz
tar -xzf insurance-crm-frontend.tar.gz
tar -xzf insurance-crm-database.tar.gz
```

**On Windows:**
- Use 7-Zip or WinRAR to extract the files
- Or use Windows Subsystem for Linux (WSL) with the above commands

After extraction, your folder structure should look like:
```
insurance-crm/
├── insurance-crm-backend/
├── insurance-crm-frontend/
└── insurance-crm-database/
```

## 🗄️ Step 2: Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email or Google account

2. **Create Cluster**
   - Click "Build a Database"
   - Select "FREE" tier (M0)
   - Choose your preferred cloud provider and region
   - Click "Create Cluster"
   - Wait 3-5 minutes for cluster creation

3. **Create Database User**
   - Click "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `crmadmin`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"
   
   ⚠️ **Note:** For production, whitelist specific IPs only

5. **Get Connection String**
   - Go back to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://crmadmin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

6. **Save Connection String**
   - Keep this string safe - you'll need it for backend configuration

### Option B: Local MongoDB Installation

**On Ubuntu/Debian:**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on startup
sudo systemctl enable mongod

# Verify installation
sudo systemctl status mongod
```

**On macOS:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB
brew services start mongodb-community@6.0

# Verify installation
brew services list | grep mongodb
```

**On Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service
5. Install MongoDB Compass (GUI tool) when prompted

**Initialize Database:**
```bash
cd insurance-crm-database/scripts

# Create database and collections
mongosh < setup-database.js

# Load sample data (optional)
mongosh < insert-sample-data.js
```

## 🔧 Step 3: Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd insurance-crm-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will take 2-5 minutes depending on your internet speed.

3. **Configure Environment Variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit the .env file
   nano .env  # or use any text editor
   ```

4. **Edit .env File**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database - Use one of these:
   # For MongoDB Atlas:
   MONGODB_URI=mongodb+srv://crmadmin:YOUR_PASSWORD@cluster.mongodb.net/insurancecrm?retryWrites=true&w=majority
   
   # For Local MongoDB:
   # MONGODB_URI=mongodb://localhost:27017/insurancecrm

   # JWT Secret (change this to a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Email Configuration (optional for now)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@insurancecrm.com

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ═══════════════════════════════════════════════
   🚀 Insurance CRM Server Running
   ═══════════════════════════════════════════════
   Environment: development
   Port: 5000
   URL: http://localhost:5000
   ```

6. **Test Backend**
   Open browser and visit: http://localhost:5000
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Insurance & Mutual Fund CRM API",
     "version": "1.0.0"
   }
   ```

## 🎨 Step 4: Frontend Setup

**Open a new terminal window** (keep backend running)

1. **Navigate to Frontend Directory**
   ```bash
   cd insurance-crm-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # or use any text editor
   ```

4. **Edit .env File**
   ```env
   # API Base URL
   VITE_API_URL=http://localhost:5000/api

   # Application Settings
   VITE_APP_NAME=Insurance & Mutual Fund CRM
   VITE_APP_VERSION=1.0.0
   ```

5. **Start Frontend Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.0.0  ready in 500 ms

   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

6. **Access the Application**
   Open your browser and go to: http://localhost:3000

## ✅ Step 5: Verify Installation

### Backend Verification

Test these endpoints:

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected: `{"success":true,"message":"Server is running"}`

2. **Dashboard Stats**
   ```bash
   curl http://localhost:5000/api/reports/dashboard
   ```
   Expected: JSON with statistics

3. **Get Clients**
   ```bash
   curl http://localhost:5000/api/clients
   ```
   Expected: JSON with client list

### Frontend Verification

1. Open http://localhost:3000
2. You should see the dashboard with:
   - Total Clients count
   - Total Policies count
   - Total Premium
   - Upcoming Reminders
   - Claims overview
   - Monthly activity

3. Click on "Clients" in navigation
   - You should see client list if sample data was loaded

### Database Verification

```bash
# Connect to MongoDB
mongosh

# Switch to database
use insurancecrm

# List collections
show collections

# Should show: agents, claims, clients, policies, reminders, targets

# Count documents
db.clients.countDocuments()
# Should show: 3 (if sample data loaded)

db.policies.countDocuments()
# Should show: 2 (if sample data loaded)
```

## 🐛 Troubleshooting Installation

### Backend Won't Start

**Error: "Cannot find module"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Error: "Port 5000 already in use"**
```bash
# Change port in .env file
PORT=5001

# Or kill process using port 5000
# On Linux/Mac:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**Error: "Cannot connect to MongoDB"**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in .env
- For Atlas: Check network access allows your IP
- Test connection: `mongosh "your-connection-string"`

### Frontend Won't Start

**Error: "EADDRINUSE: address already in use"**
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

**Error: "Cannot connect to API"**
- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for CORS errors

### Sample Data Not Loading

```bash
# Verify MongoDB is running
mongosh

# Drop existing database
use insurancecrm
db.dropDatabase()

# Re-run setup scripts
cd insurance-crm-database/scripts
mongosh < setup-database.js
mongosh < insert-sample-data.js
```

## 🎯 Next Steps

After successful installation:

1. **Explore the Dashboard**
   - View statistics and charts
   - Familiarize yourself with the interface

2. **Read User Guide**
   - Learn about each feature
   - Understand workflows

3. **Try Basic Operations**
   - View clients
   - Check policies
   - Review reminders

4. **Configure Email** (Optional)
   - Setup SMTP for email notifications
   - Test reminder emails

5. **Customize Settings**
   - Add your company logo
   - Configure default values
   - Set up user roles

## 📚 Additional Resources

- [Quick Start Tutorial](./02-quick-start.md)
- [System Requirements](./03-system-requirements.md)
- [Troubleshooting Guide](./12-troubleshooting.md)
- [API Documentation](../api/01-overview.md)

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the [FAQ](./11-faq.md)
2. Review [Troubleshooting Guide](./12-troubleshooting.md)
3. Check MongoDB/Node.js/React documentation
4. Verify all prerequisites are installed correctly

---

**Congratulations!** 🎉 Your Insurance CRM system is now installed and ready to use!

Next: [Quick Start Tutorial](./02-quick-start.md)
