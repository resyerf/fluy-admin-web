# Build from this folder (fluy-admin-web has no dependency on the repo root):
#   docker build -t resyerf/fluy-admin-web:v1 .

FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist/fluy-admin-web/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
