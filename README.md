# Valyent

## About

[Valyent](https://valyent.cloud) is a developers-first cloud platform.

At its core relies [Ravel](https://github.com/valyentdev/ravel.git), an open-source orchestrator.
It turns Docker images into lightning-fast microVMs and orchestrates them into fleets — collections of machines that power your services at scale.

To learn more about Valyent, check out the [documentation](https://docs.valyent.cloud).

## License

Valyent is an open source project licensed under the [Apache License Version 2.0](https://github.com/valyentdev/ravel/blob/main/LICENSE).

## Contributing

You can signal bugs or request a feature by opening an issue and/or a pull request on this repository. If you have any question, you can join our Discord where we are available almost everyday.

## Development Setup

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

## Star History

Thank you for your support! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=valyentdev/valyent&type=Date)](https://star-history.com/#valyentdev/valyent&Date)
