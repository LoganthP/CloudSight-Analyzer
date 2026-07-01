FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Vite frontend port and Express backend port
EXPOSE 5173 3000

# Start both frontend and backend concurrently
# Note: Vite requires --host to bind to 0.0.0.0 inside the container so it's accessible from the host machine
CMD ["npx", "concurrently", "\"npm run server\"", "\"npm run client -- --host\""]
