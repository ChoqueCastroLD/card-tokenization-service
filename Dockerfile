# use the official Bun image
FROM oven/bun:1 as base

WORKDIR /usr/src/app

# install dependencies
COPY package.json bun.lockb ./
RUN bun install

# copy all project files into the image
COPY . .

# run the tests
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/server.ts" ]