## Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY [ "package.json", "package-lock.json", "tsconfig*.json", "./" ]

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

## Stage 2: Run
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig*.json ./
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE ${NODE_PORT}

USER node

CMD [ "npm", "run", "start:prod" ]