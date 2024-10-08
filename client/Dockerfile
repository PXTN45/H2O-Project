# Step 1: Build React App
FROM node:alpine3.18 AS build
WORKDIR /app
COPY package.json . 
RUN npm install
COPY . .  
ENV VITE_H2O_URL=http://47.128.233.168:3001
RUN npm run build

# Step 2: Serve With Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist . 
EXPOSE 80

# ตั้งค่า Nginx ให้ส่งหน้า index.html สำหรับทุก request ที่ไม่พบไฟล์
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
