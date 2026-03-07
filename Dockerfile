# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate the Prima client
RUN npx prisma generate

# Build the Vite React frontend
RUN npm run build

# Expose the port your Express backend uses (port 5000 is defined in your server.ts)
EXPOSE 5000

# Start the Node/Express backend process
CMD ["npm", "run", "start"]
