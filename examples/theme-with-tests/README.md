# Theme With Tests

Theme with tests.

## Project Structure

All raw js, css, and blocks reside in `src`. These are files that need to be built during the build process.

## Usage

### Docker

Docker ports and webpack proxies are set in `.env`. You can change those to your liking. Default is set to run on port 8000.

It's recommended but not required to set up a hostname in `/etc/hosts` on your local machine mapped to the docker port. This allows wordpress loopbacks to work (wp_cron etc.). Set this hostname to `DOCKER_EXTRA_HOST` and `BROWSER_SYNC_PROXY` in `.env`.

You can now start your docker container.

```bash
docker compose up -d

```

If you setup a hostname navigate there in your browser. If not, and didn't change anything in `.env` go to `http://localhost:8000`. You can then run through the wordpress installation.

### Dev Scripts

To build.

```bash
npm run build

```

To develop.

```bash
npm run dev

```

To archive for distribution run.

```bash
npm run archive:dist

```

To archive the entire development package.

```bash
npm run archive:dev

```

## Testing

Js testing is done with `vitest` and php testing is done with `phpunit` and the wordpress phpunit test suite.

for js run

```bash
npm run test
```

for php run

```bash
composer test
```

The wordpress testing suits are installed from `https://develop.svn.wordpress.org/tags`. It will be installed via custom composer repository and use whatever wordpress version you picked when running the init script.

## Updating php and wordpress versions

The choice is up to you how you want to keep your plugin current. In `.env` you can specify your php and wordpress versions.

For every wordpress release in the future you will need to update the `composer.json` wordpress testing suite manually to match the version in `.env`. Then run `composer update`.

## License

This software is licensed under the GNU General Public License v2.0 or later. See `license.txt` for more information.
