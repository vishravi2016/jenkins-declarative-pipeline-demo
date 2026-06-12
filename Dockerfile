FROM node:20-alpine 
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

# Production stage
# FROM node:20-alpine
# WORKDIR /app
# COPY --from=build /app/package*.json ./
# RUN npm install --omit=dev
# COPY --from=build /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]
