# Step 1: Build React App
FROM node:alpine3.18 AS build
WORKDIR /app/client
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

# Set environment variable for VITE_H2O_URL
ENV VITE_H2O_URL=https://18.140.2.235/:3001

RUN npm run build

# Step 2: Serve With Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/client/dist ./

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
