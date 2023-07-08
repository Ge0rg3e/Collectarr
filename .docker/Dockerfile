# Use the Ubuntu 20.04 base image
FROM ubuntu:20.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install curl, nodejs, git
RUN apt-get update && apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get -y install nodejs git

# Set the working directory to /app
WORKDIR /app

# Clone the project from the GitHub repository
RUN git clone https://github.com/Ge0rg3e/Collectarr.git

# Change directory to the server
WORKDIR /app/Collectarr/server

# Install server dependencies using npm
RUN npm install

# Change directory to the client
WORKDIR /app/Collectarr/client

# Install client dependencies using npm
RUN npm install

# Build the client application
RUN npm run build

# Expose necessary ports
EXPOSE 3333
EXPOSE 2222

# Start  client, and server
CMD sh -c "cd /app/Collectarr/client && npm start" & \
    sh -c "cd /app/Collectarr/server && npm start"