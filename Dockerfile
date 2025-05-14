# To build the Docker image, run the following command in the terminal:
# docker build --build-arg VITE_EXERCISE_API_URL=http://localhost:8080 -t exercise-frontend:latest .

# 1. Build the app

# Use node as the base image for building the app
FROM node:slim AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code, excluding those in .dockerignore
COPY . .

# Set environment variables for the build
ARG VITE_EXERCISE_API_URL
ENV VITE_EXERCISE_API_URL=$VITE_EXERCISE_API_URL

# Build the app, this will create a dist folder with the production build
RUN npm run build

# 2. Create the production image
FROM nginx:alpine

# Copy the built app from the builder stage to the nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port for nginx
EXPOSE 80

# Start nginx server, this will run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
