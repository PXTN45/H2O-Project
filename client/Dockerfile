# Step 1: Build React App
FROM node:alpine3.18 AS build
WORKDIR /app/client
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

ENV VITE_H2O_URL=http://47.129.247.9:3001
ENV VITE_SECRET_KEY=H2O-Project-Client

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
