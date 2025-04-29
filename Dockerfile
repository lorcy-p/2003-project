# 1. Build Stage
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Production Stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config (see below)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
