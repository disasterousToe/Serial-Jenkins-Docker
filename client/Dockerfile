# Stage 1: Build React application
FROM node:alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the entire application code to the container
COPY . .

# Build the React app for production
RUN npm run build --force && pwd && ls -la

# Stage 2: Serve React application using Nginx
FROM nginx:alpine

# Copy built React app from the previous stage
COPY --from=build /build /usr/share/nginx/html

# Copy nginx config file to the server
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
