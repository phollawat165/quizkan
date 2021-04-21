FROM node:lts-alpine AS build
WORKDIR /build
COPY . .
RUN yarn install && yarn build

FROM node:lts-alpine AS production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8000
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/yarn.lock ./
COPY --from=build /build/dist ./dist
RUN yarn install --production && yarn cache clean

EXPOSE ${PORT}
CMD yarn start:prod