# Fatecoin :coin:

A blockchain for studies purposes. (this is not a project ready to production, it's just to learn the basics blockchains concepts)

## How to run?

### Prerequisites

- [nodejs](https://nodejs.org/en/)
- a mongodb database

### Instalation

- Clone with git or download this repo;

```shell
git clone https://github.com/Bryant-Anjos/fatecoin.git
```

- In the project folder install the dependencies:

```shell
npm install
```

or

```shell
yarn install
```

- Copy the [`.env.example`](/.env.example) that is in the root of this project and rename it to `.env`;

- Change the `MONGO_URL` variable with your mongodb connection string.

### Execution

```shell
npm run dev
```

or

```shell
yarn dev
```

## Usage

You can use a browser or any http client to access the project routes. The routes are the following:

Base url: `localhost:3333/chainparams`

| Route          | Description                                    |
| -------------- | ---------------------------------------------- |
| `/difficulty`  | get the current blockchain difficulty          |
| `/isvalid`     | verify if the blockchain is valid              |
| `/latestblock` | get the latest block mined from the blockchain |
| `/mineblock`   | mine a block                                   |
| `/blockchain`  | verify all blocks stored in the blockchain     |
