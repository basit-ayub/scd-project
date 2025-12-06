# SCDProject25 README

## Part 3: Building Features into a Provided Project

### 1. Clone the Repository
Clone the assigned repository to your local machine and run the application locally to ensure it is functioning.
```
git clone https://github.com/LaibaImran1500/SCDProject25.git
cd SCDProject25
npm install
node main.js
```

### 2. Create a Feature Branch
Create a new branch from `main` to work on project modifications.
```
git checkout -b feature-enhancements
```

### 3. Project Modifications
- **Search Functionality:**
  - Added a "Search Records" option in the menu.
  - User can search by Name or ID (case-insensitive).

- **Sorting Capability:**
  - Added a "Sort Records" option.
  - Sort by Name or Creation Date, Ascending or Descending.
  - Does not modify vault file, only display order.

- **Export Vault Data:**
  - Added "Export Data" option.
  - Exports records to `export.txt` with header including date, time, total records, and filename.

- **Automatic Backup System:**
  - Automatic backup created every time a record is added/deleted.
  - Stored in `/backups` folder with timestamped filename.

- **Display Data Statistics:**
  - Added "View Vault Statistics" option.
  - Shows total records, last modification, longest name, earliest/latest record dates.

- **MongoDB Setup:**
  - Replaced in-memory database with MongoDB.
  - Initial connection string hardcoded, later refactored to use `.env` file.

- **Env File Setup:**
  - MongoDB connection string moved to `.env`.
  - Loaded securely using `dotenv`.

### 4. Merge Feature Branch
```
git checkout main
git merge feature-enhancements
git push origin main
```

## Part 4: Containerize the Application

### 1. Create Containerization Branch
```
git checkout -b containerization
```

### 2. Write Dockerfile for Backend
- Dockerfile created in project root with Node.js setup, dependencies, and working directory.

### 3. Build Docker Image
```
docker build -t scdproject25-backend .
```

### 4. Test Application Locally
```
docker run -p 3000:3000 scdproject25-backend
```
- Used DockerHub MongoDB image for database.

### 5. Document Logs
- Screenshot container logs showing server running.
- Screenshot container processes.

### 6. Publish Docker Image
```
docker tag scdproject25-backend basitayub/scdproject25-backend:1.0
docker push basitayub/scdproject25-backend:1.0
```
- Docker Hub Link: `https://hub.docker.com/r/basitayub/scdproject25-backend`

## Part 5: Deploy Containers Manually

### 1. Create Private Docker Network
```
docker network create nodevault-net
```
- Verified containers not publicly available.

### 2. Attach Volumes for MongoDB
```
docker volume create mongo-data
```
- Attached to MongoDB container.

### 3. Configure Ports and Environment Variables
```
docker run -d --name nodevault-mongo --network nodevault-net -v mongo-data:/data/db mongo:6
```
```
docker run -d --name nodevault-app --network nodevault-net -p 3000:3000 -e MONGO_URI='mongodb://nodevault-mongo:27017/vault' scdproject25-backend
```

### 4. Test Persistence
- Destroyed containers and relaunched; verified MongoDB data persisted.

### 5. Document Manual Deployment
- Screenshots of commands used, container setup, and environment configurations.
- Noted time-consuming and error-prone manual setup.

## Part 6: Simplifying with Docker Compose

- Created `docker-compose.yml` to define backend and MongoDB services.
- Configured custom bridge networks, volumes, ports, and environment variables.
- One command to start all services:
```
docker compose up -d
```
- Verified services running and connected.

## Part 7: Update Project Repo to Include Docker Compose

### 1. Compose File Creation
- Added `docker-compose.yml` to project root.
- Configured to build backend from Dockerfile.

### 2. Clean Slate
```
docker system prune -a
```
- Removed old images, containers, and networks.

### 3. Compose Up
```
docker compose up --build
```
- Verified build and service startup.

### 4. Documentation
- Screenshots captured:
  - Image build process
  - Services running
  - Application working in browser
- Issue encountered: Docker cache snapshot error, resolved with prune.

### 5. Repository Update
```
git add docker-compose.yml .env README.md
git commit -m 'Add Docker Compose setup'
git push origin main
```

---

**End of README**
