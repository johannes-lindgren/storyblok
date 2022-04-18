# Next.js with TypeScript example

This is a starter project for creating custom apps for Storyblok with Next.js!

## Setup

Install ngrok globally with

```
sudo npm install --unsafe-perm -g ngrok
```

Sign up at https://ngrok.com 

Authenticate the ngrok client https://dashboard.ngrok.com/get-started/your-authtoken

## Run in dev mode

Run

```shell
yarn dev
```

## TODO

You can generate a JWT secret with:

```shell
openssl rand -base64 32
```

Save in environmental variable `STORYBLOK_JWT_SECRET`

Other env...