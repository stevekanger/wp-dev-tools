# Project tests

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
