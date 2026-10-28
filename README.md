# WP Dev Tools

- [Home](https://github.com/stevekanger/wp-dev-tools)
- [Cli Commands](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/cli-commands.md)
- [Creating a plugin or theme](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/create-project.md)
- [Project php suite](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-php-suite.md)
- [Project tests](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-tests.md)
- [Project Examples](https://github.com/stevekanger/wp-dev-tools/tree/main/examples)

Development tools for wordpress. Easily create project boilerplates, create block files, archive projects and more.

## Installation and Usage

Use without installation via npx

```bash
npx @stevekanger/wp-dev-tools [command] [...options]

```

Or install in your project.

```bash
npm install -D @stevekanger/wp-dev-tools

```

and use in package.json

```json
{
  "scripts": {
    "create:block": "wp-dev-tools createBlock"
    "archive": "wp-dev-tools archive"
    "copy": "wp-dev-tools copy"
    "docker:extract": "wp-dev-tools dockerExtract"
  }
}
```

## Create a preconfigured plugin or theme

You can easily create a new theme or plugin with docker, webpack, and many developer tools preinstalled and configured. See [Creating a theme or plugin](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/create-project.md)

## License

This software is licensed under the GNU General Public License v2.0 or later. See `LICENSE` for more information.
