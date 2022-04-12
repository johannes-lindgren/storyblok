# Next.js with TypeScript example


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

## Run with Preview

Storyblok requires https for live preview. Start a local http proxy with 

```shell
local-ssl-proxy --source 3010 --target 3000 --cert localhost.pem --key localhost-key.pem
```

### Install local SSL proxy

Install on Windows with choco:

```shell
choco install mkcert
```

Set up with

```shell
mkcert -install
mkcert localhost
npm install -g local-ssl-proxy
```

## Install local ssl proxy

This step is needed to 