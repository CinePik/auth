FROM node:18-alpine AS build

WORKDIR /build

# Copy package.json and package-lock.json
COPY [ "package.json", "package-lock.json", "./" ]

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

FROM node:18-alpine AS runtime

USER node

WORKDIR /usr/src/app

COPY --from=build /build/ ./

EXPOSE ${NODE_PORT}

CMD [ "npm", "run", "start:prod" ]