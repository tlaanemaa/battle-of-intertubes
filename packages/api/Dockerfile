FROM node:16

WORKDIR /app
# This should be run from the root directory
COPY . .
RUN npm ci && npm run build-api

EXPOSE 8080
CMD ["npm", "run", "start-api"]
