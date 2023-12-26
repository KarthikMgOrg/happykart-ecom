FROM node:18-slim

WORKDIR /app/customer

# Install curl
RUN apt-get update && apt-get install -y curl

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "index.js"]