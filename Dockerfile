# To build the Docker image, use the following command:
# docker build -t exercise-frontend:latest .

# To run the Docker container, use the following command:
# Replace ${EXERCISE_API_URL} with the actual backend URL
# docker run -d -p 80:80 -e EXERCISE_API_URL="${EXERCISE_API_URL}" exercise-frontend:latest

# 1. Build the app

# Use node as the base image for building the app
FROM node:alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code, excluding those in .dockerignore
COPY . .

# Build the app, this will create a dist folder with the production build
RUN npm run build

# 2. Create the production image
FROM nginx:alpine

# Set the working directory
WORKDIR /app

# Copy the built app from the builder stage to the nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the custom entrypoint script
COPY entrypoint.sh .

# MAKE the entrypoint script executable
RUN chmod +x entrypoint.sh

# Expose port for nginx
EXPOSE 80

# Run the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
