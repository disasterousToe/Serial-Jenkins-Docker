# Use official Node.js image as the base image
FROM node:20 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the entire project
COPY . .

CMD ["npm", "start"]

