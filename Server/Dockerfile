# syntax=docker/dockerfile:1

# ใช้ Node.js เวอร์ชัน 20.16.0 บน Alpine Linux (มีขนาดเล็ก)
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine

# กำหนดให้ใช้ environment แบบ production โดย default
ENV NODE_ENV production

# ตั้งค่าโฟลเดอร์ทำงานภายใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies โดยไม่รวม devDependencies (เพราะเราอยู่ในโหมด production)
RUN npm install --omit=dev

# คัดลอก source code ที่เหลือทั้งหมดไปยัง container
COPY . .

# สร้างไฟล์ JavaScript จาก TypeScript
RUN npm run build

# เปิดพอร์ต 3001 สำหรับการเข้าถึงแอปพลิเคชัน
EXPOSE 3001

# สั่งรันแอปพลิเคชันในโหมด production โดยใช้ไฟล์ JavaScript ที่ build แล้ว
CMD ["npm", "run", "start:prod"]
