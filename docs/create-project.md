# Create a plugin or theme

You can easily scaffold a project with the `createProject` command. Run via `npx` since your project would be empty at this point. This runs the interactive setup.

```bash
npx @stevekanger/wp-dev-tools createProject

```

When finished `cd` into your project and run the following commands to setup the project.

```bash
npm install
composer install
composer dump-autoload

```

## Docker

Docker ports and webpack proxies are set in `.env`. You can change those to your liking. Default is set to run on port 8000.

It's recommended but not required to set up a hostname in `/etc/hosts` on your local machine mapped to the docker port. This allows wordpress loopbacks to work (wp_cron etc.). Set this hostname to `DOCKER_EXTRA_HOST` and `BROWSER_SYNC_PROXY` in `.env`.

You can now start your docker container.

```bash
docker compose up -d

```

If you setup a hostname navigate there in your browser. If not, and didn't change anything in `.env` go to `http://localhost:8000`. You can then run through the wordpress installation.

## Development

After wordpress is set up you can now run the development command for hot reloads.

**Important: Complete the wordpress install before running dev.**

```bash
npm run dev

```

## Project Structure

You have the choice to install the php suite and/or tests during setup. For examples see [Project Examples](https://github.com/stevekanger/wp-dev-tools/tree/main/examples). For docs see [PHP Suite](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-php-suite.md) or [Tests](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-tests.md).

All raw js, css, and blocks reside in `src`. These are files that need to be built during the build process.

Several development tools will be set up. Docker for a controlled development environment, Webpack with typescript and scss by default, Composer for autoloading, and @stevekanger/wp-dev-tools will be added for additional tools.

## Requirements

Its recommended to use PHP >= 8.3 and Nodejs >= 22.22.2 for all projects.
