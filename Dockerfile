# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (Vite outputs to 'dist/' by default)
RUN npm run build

# Stage 2: Serve stage
FROM webdevops/nginx:alpine

WORKDIR /app

# Copy the built files from the previous stage
# We copy from '/app/dist' because Vite generates the build in that folder
COPY --from=build /app/dist ./

# Standard ports
EXPOSE 80

# The webdevops/nginx image starts automatically
