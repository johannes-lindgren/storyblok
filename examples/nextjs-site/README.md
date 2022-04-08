# Next.js with TypeScript example

## Run Locally

Clone the project

```shell
git clone https://github.com/johannes-lindgren/storyblok.git
```

Enter the directory

```shell
cd nextjs-site
```

Install dependencies

```shell
yarn install
```

Create the `.env.local` and set the variables 

```shell
cp .env.example .env.local
```

Start the server

```shell
yarn dev
```

### Run with Live Preview

To preview within storyblok, run a https proxy:

Install with

Run in a second terminal 

```shell
yarn proxy
```

### Install mkcert on Windows

Install on Windows with [chocolatey](https://chocolatey.org/):

```shell
choco install mkcert
```
