## Prerequisites

This project requires the following in your system

- Node.js 10.x or higher

## Installing

Install project dependencies

```
  npm install
```

# Deploying the App

## Set Environment Variables

Create a file named `.env` under `config` directory

```
SESSION_SECRET=
API_URL=
API_USERNAME=
API_PASSWORD=
CAPTCHA_KEY=
GRAPHQL_URL=
```

## Build to ES5

Transpile the source code to browser readable code using babel. The root folder fo the production build is the `build` folder.

```
  npm run build:client
```
