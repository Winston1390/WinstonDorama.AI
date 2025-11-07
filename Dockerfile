FROM node:18-slim
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

ENV NODE_ENV=production

# Render usa PORT (normalmente 10000), pero tu app corre en process.env.PORT
EXPOSE 3000

# Iniciar el servidor
CMD ["node", "index.js"]
