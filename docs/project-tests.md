# Project tests

- [Home](https://github.com/stevekanger/wp-dev-tools)
- [Cli Commands](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/cli-commands.md)
- [Creating a plugin or theme](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/create-project.md)
- [Project php suite](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-php-suite.md)
- [Project tests](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-tests.md)

Testing suites can be installed for both php and js. All tests are loaded from the `tests` folder for their respective language. If you setup the php-suite then additional unit tests will be added for the suite classes.

Php testing is done with Wordpress PHPUnit testing suite and are installed from `https://develop.svn.wordpress.org/tags`. It will be installed via custom composer repository and use whatever wordpress version you picked when running the init script.

JS testing is done with vitest and is installed via npm.

## Testing

For js tests run.

```bash
npm run test
```

For php tests run.

```bash
composer test
```
