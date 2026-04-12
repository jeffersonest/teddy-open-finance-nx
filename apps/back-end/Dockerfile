FROM node:20-alpine
WORKDIR /app
COPY dist/ .
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "main.js"]
