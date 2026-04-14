🚀 Full Stack Deployment using Azure App Service & GitHub Actions

---

## 📌 Project Overview

This project is a **Full Stack Web Application** built using:

- ⚛️ Frontend: React.js  
- 🟢 Backend: Node.js (Express.js)  
- 🛢️ Database: Azure MySQL (Flexible Server)  
- ☁️ Deployment: Azure App Service  
- 🔄 CI/CD: GitHub Actions  

👉 The application performs **CRUD operations** (Add, View, Update, Delete Books)

---

## 📁 Project Structure


root/

├── client # React Frontend

├── backend # Node.js API


---

## 🌐 Frontend Deployment (Azure App Service)

### 🔹 Steps

1. Create Web App in Azure  
2. Select:
   - Runtime: Node.js  
   - OS: Linux  
   - Region: East US  
3. Download Publish Profile  
4. Add GitHub Secret:

AZUREAPPSERVICE_PUBLISHPROFILE_FRONTEND

5. Configure Deployment Center (GitHub)
6. Add GitHub Actions Workflow

---

## ⚙️ Backend Deployment (Azure App Service)

### 🔹 Steps

1. Create Backend Web App  
2. Use same region as frontend  
3. Download Publish Profile  
4. Add Secret:

AZURE_BACKEND_PROFILE

5. Configure Deployment Center  
6. Setup GitHub Actions  

---

## 🔄 GitHub Actions (CI/CD)

---

### 🌐 Frontend Workflow

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install & Build
        working-directory: ./client
        run: |
          npm install
          npm run build

      - name: Deploy
        uses: azure/webapps-deploy@v2


🛢️ Azure MySQL Database Setup
Service: Azure Database for MySQL (Flexible Server)
Version: MySQL 8.0
Enable Public Access
Allow Azure Services
🔌 Backend Configuration

Add environment variables in Azure:

DB_HOST=your_host
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_db
Node.js Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: { rejectUnauthorized: false },
});
🔗 Frontend → Backend Connection
const API_URL = "https://your-backend-url.azurewebsites.net";
🧪 Testing
Backend API

https://your-backend-url.azurewebsites.net/books

Frontend App

https://your-frontend-url.azurewebsites.net
