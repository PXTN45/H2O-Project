# syntax=docker/dockerfile:1

# กำหนด NODE_VERSION
ARG NODE_VERSION=20.16.0

# ใช้ Node.js image
FROM node:${NODE_VERSION}-alpine

# ใช้ production environment โดย default
ENV NODE_ENV=production

# กำหนด working directory
WORKDIR /usr/src/app

# ติดตั้ง build tools
RUN apk add --no-cache python3 make g++

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --production  

# คัดลอกไฟล์ source code
COPY . .

# สร้างไฟล์ JavaScript จาก TypeScript
RUN npm run build

# เปิดพอร์ต 3001 สำหรับการเข้าถึงแอปพลิเคชัน
EXPOSE 3001

# รันแอปพลิเคชัน
CMD ["node", "dist/server.js"]
