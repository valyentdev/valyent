# Valyent

## About

[Valyent](https://valyent.cloud) is a developers-first cloud platform.

At its core relies [Ravel](https://github.com/valyentdev/ravel.git), an open-source orchestrator.
It turns Docker images into lightning-fast microVMs and orchestrates them into fleets — collections of machines that power your services at scale.

To learn more about Valyent, check out the [documentation](https://docs.valyent.cloud).

## License

Valyent is an open source project licensed under the [Apache License Version 2.0](https://github.com/valyentdev/valyent/blob/main/LICENSE).

## Contributing

You can signal bugs or request a feature by opening an issue and/or a pull request on this repository. If you have any question, you can join our Discord where we are available almost everyday.

## Development Setup

### Requirements

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [npm](https://www.npmjs.com/) - Node.js package manager
- [Docker](https://www.docker.com/) - A containerization platform

#### Installation

```bash
# Clone the Git repository on your machine
git clone https://github.com/valyentdev/valyent

# Install the dependencies
npm i

# Set up env variables
cp .env.example .env

# Run the dev containers
docker compose up -d

# Run the migrations
node ace migration:run

# Seed the database
node ace db:seed

# Run the development server
npm run dev
```

### Set up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/apps) and create some new OAuth/regular app.

2. Fill in the form with the following values :

- Application name : `Valyent Console`
- Homepage URL : `http://127.0.0.1:3333`
- Callback URL : `http://127.0.0.1:3333/auth/github/callback`

3. Once the app is created, you will be able to see the `Client ID` and `Client Secret`. Add them to the `.env` file :

```env
GITHUB_CLIENT_ID=<your_client_id>
GITHUB_CLIENT_SECRET=<your_client_secret>
```

You now should be able to log in with GitHub.

Please remember to use `http://127.0.0.1:3333` as your development URL, instead of `http://localhost:3333`.

## Star History

Thank you for your support! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=valyentdev/valyent&type=Date)](https://star-history.com/#valyentdev/valyent&Date)
