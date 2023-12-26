FROM node:18-slim

WORKDIR /app/shopping

# Install curl
RUN apt-get update && apt-get install -y curl

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:3002/ || exit 1

CMD ["node", "index.js"]