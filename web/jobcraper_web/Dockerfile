FROM denoland/deno:alpine

WORKDIR /usr/src/app

COPY . .

RUN deno install

EXPOSE 5173

RUN deno task dev
