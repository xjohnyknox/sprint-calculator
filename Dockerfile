FROM node:22-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables to disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with verbose output
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]


