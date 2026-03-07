# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install openssl for Prisma compatibility with Debian Bookworm
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate the Prima client
RUN npx prisma generate

# Note: We build the Vite frontend at runtime (in CMD) so it has access to CapRover's environment variables
# RUN npm run build

# Expose the port your Express backend uses (port 5000 is defined in your server.ts)
EXPOSE 5000

# Build the Vite React frontend with the injected CapRover env vars, then start the Node/Express backend process
CMD npm run build && npm run start
