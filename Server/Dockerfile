# ใช้ Node.js image
FROM node:20-alpine

# ตั้ง working directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --production

# คัดลอก source code
COPY . .

# สร้างไฟล์ JavaScript จาก TypeScript
RUN npm run build

# เปิดพอร์ต 3000 สำหรับการเข้าถึงแอปพลิเคชัน
EXPOSE 3000

# รันแอปพลิเคชัน
CMD ["npm", "start"]
