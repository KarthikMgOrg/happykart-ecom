FROM node:18-slim

WORKDIR /app/products

# Install curl
RUN apt-get update && apt-get install -y curl

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:3001/ || exit 1

CMD ["node", "index.js"]