FROM denoland/deno:alpine

WORKDIR /usr/src/app

COPY . .

RUN deno install

EXPOSE 8000

RUN deno task start
