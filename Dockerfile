# Use Node.js 22 alpine for native TypeScript type stripping support
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Expose port 80
EXPOSE 80

# Start the server using npm start
CMD ["npm", "start"]
