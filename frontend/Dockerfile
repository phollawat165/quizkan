FROM node:lts-alpine AS base
WORKDIR /base
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .

FROM base AS build
ARG API_ENDPOINT=http://localhost:8000
ENV NEXT_PUBLIC_API_ENDPOINT=${API_ENDPOINT}
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN yarn run build

FROM node:lts-alpine AS production
ENV NODE_ENV=production
ARG API_ENDPOINT=http://localhost:8000
ENV NEXT_PUBLIC_API_ENDPOINT=${API_ENDPOINT}
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/yarn.lock ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/.env ./
COPY --from=build /build/next.config.js ./
RUN yarn add next && yarn cache clean

EXPOSE 3000
CMD yarn start