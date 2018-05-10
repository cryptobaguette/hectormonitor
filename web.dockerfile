FROM node:9-alpine

WORKDIR /app

COPY . ./

RUN yarn install --pure-lockfile \
  && yarn build

ENV PORT=8080

EXPOSE 8080
CMD ["yarn", "start"]

LABEL io.nanobox.http_port="8080"
