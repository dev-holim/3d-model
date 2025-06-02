FROM node:18-alpine

# Install pnpm directly using npm
RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
