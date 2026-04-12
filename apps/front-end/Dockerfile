FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/front-end/package.json apps/front-end/
COPY libs/shared/contracts/package.json libs/shared/contracts/
RUN npm ci --workspace=apps/front-end --workspace=libs/shared/contracts
COPY . .
RUN npx nx build front-end

FROM nginx:alpine
COPY --from=builder /app/apps/front-end/dist /usr/share/nginx/html
COPY apps/front-end/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
