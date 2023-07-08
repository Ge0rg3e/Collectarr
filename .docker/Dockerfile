# Use the Ubuntu 20.04 base image
FROM ubuntu:20.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install curl, nodejs, git, postgresql, and postgresql-client
RUN apt-get update && apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get -y install nodejs git postgresql postgresql-client

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

# Create a directory to store the PostgreSQL data outside the container
RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql/data

# Initialize the PostgreSQL cluster using a non-root user
USER postgres
RUN /usr/lib/postgresql/*/bin/initdb -D /var/lib/postgresql/data

# Start the PostgreSQL server using a non-root user
RUN /usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data start && \
    createdb collectarr && \
    psql -c "ALTER USER postgres PASSWORD 'pass123';" && \
    /usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data stop

# Switch to postgres user
USER postgres

# Expose necessary ports
EXPOSE 3333
EXPOSE 2222
EXPOSE 5432
EXPOSE 8080

# Start PostgreSQL, Hasura, client, and server
CMD sh -c "/usr/lib/postgresql/*/bin/pg_ctl -D /var/lib/postgresql/data start" & \
    sh -c "cd /app/Collectarr/client && npm start" & \
    sh -c "cd /app/Collectarr/server && npm start"