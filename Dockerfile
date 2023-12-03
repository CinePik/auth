FROM node:18-alpine AS build

WORKDIR /build

COPY [ "package.json", "package-lock.json", "./" ]

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS runtime

USER node

WORKDIR /usr/src/app

COPY --from=build /build/ ./

ENV NODE_PORT=9999
EXPOSE ${NODE_PORT}

CMD [ "npm", "run", "start:prod" ]