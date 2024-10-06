FROM node:20-alpine

WORKDIR /usr/src/app/Server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ติดตั้ง MongoDB
RUN apt-get update && apt-get install mongodb-server -y

# เริ่มบริการ MongoDB (อาจต้องปรับแต่งตามความต้องการ)
RUN systemctl start mongodb

EXPOSE 3000

CMD ["node", "dist/server.js"]