# Use Node v20 LTS
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose the port your app uses
EXPOSE 3000

# Start the app
CMD ["node", "main.js"]
