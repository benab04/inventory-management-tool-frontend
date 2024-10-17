# Step 1: Use Node to build the React app
FROM node:16-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files into the container
COPY . .

# Build the React app (production build)
RUN npm run build

# Step 2: Use Nginx to serve the built files
FROM nginx:alpine

# Copy the build output to Nginx's HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Copy a custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to make the app accessible
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
