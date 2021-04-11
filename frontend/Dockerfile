FROM node:lts-alpine AS base
WORKDIR /base
COPY package*.json ./
RUN yarn
COPY . .

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN yarn run build

FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/.env ./
RUN yarn add next && yarn cache clean

EXPOSE 3000
CMD yarn start