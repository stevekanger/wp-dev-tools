# WP Dev Tools

Some simple development tools to use with wordpress development.

## Installation

Use via npx

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
    "create:project": "wp-dev-tools createProject"
    "create:block": "wp-dev-tools createBlock"
    "archive": "wp-dev-tools archive"
    "copy": "wp-dev-tools copy"
    "docker:extract": "wp-dev-tools dockerExtract"
  }
}
```

## Usage

All commands are run with command first then options. You can supply options or if necessary options are required you will be prompted via an interactive command line interface.

```bash
wp-dev-tools [command] [...options]

```

### createProject

Creates either a theme or plugin project. This command should be run with npx to scaffold a project. It will automatically set up your project's package.json to include `@stevekanger/wp-dev-tools` as a dev dependency.

| Option             | Type    | Allowed           | Description                                                                                                 |
| ------------------ | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| --dest             | string  | string            | The destination installation directory. (Directory must be empty).                                          |
| --type             | string  | 'theme', 'plugin' | The type of project to create.                                                                              |
| --title            | string  | string            | The proper title of the project.                                                                            |
| --author           | string  | string            | The proper author name.                                                                                     |
| --authorHandle     | string  | string            | This is the author name with no spaces. (Either no spaces, kebab or snake case).                            |
| --description      | string  | string            | A brief description of the project.                                                                         |
| --slug             | string  | string            | The kebab case separated project slug (Used for things like textdomain, namespaces, and docker containers). |
| --prefix           | string  | string            | The snake case separated project prefix (Used for things like php prefixing).                               |
| --version          | string  | string            | The initial project version.                                                                                |
| --phpNamespace     | string  | string            | The projects php namespace for all php code.                                                                |
| --wordpressVersion | string  | string            | The min Wordpress version.                                                                                  |
| --phpVersion       | string  | string            | The min Php version.                                                                                        |
| --installTests     | boolean | NA                | Whether or not to install tests.                                                                            |
| --help -h          | boolean | NA                | Shows the help message.                                                                                     |

### createBlock

Creates wordpress block files. It does not install a full block plugin only the block files project similar to running `npx @wordpress/create-block --no-plugin`. The templates have been modified slightly to use typescript.

| Option        | Type    | Allowed             | Description                                                         |
| ------------- | ------- | ------------------- | ------------------------------------------------------------------- |
| --dest        | string  | string              | The destination installation directory. (Directory must be empty).  |
| --type        | string  | 'static', 'dynamic' | The type of block to create.                                        |
| --title       | string  | string              | The proper title of the project.                                    |
| --description | string  | string              | A brief description of the block.                                   |
| --slug        | string  | string              | The kebab case separated block slug (Used when registering blocks). |
| --textdomain  | string  | string              | The project textdomain.                                             |
| --namespace   | string  | string              | The project namespace (can match textdomain).                       |
| --version     | string  | string              | The initial project version.                                        |
| --help -h     | boolean | NA                  | Shows the help message.                                             |

### archive

Archives the project files to single a `.zip` file.

| Option    | Type    | Allowed       | Description                                                                                       |
| --------- | ------- | ------------- | ------------------------------------------------------------------------------------------------- |
| --type    | string  | 'dist', 'dev' | The files that you want to include. `dist` only distribution files. `dev` all developement files. |
| --src     | string  | string        | The source directory.                                                                             |
| --dest    | string  | string        | The destination directory.                                                                        |
| --help -h | boolean | NA            | Shows the help message.                                                                           |

### copy

Copies the project files to a destination folder.

| Option    | Type    | Allowed       | Description                                                                                       |
| --------- | ------- | ------------- | ------------------------------------------------------------------------------------------------- |
| --type    | string  | 'dist', 'dev' | The files that you want to include. `dist` only distribution files. `dev` all developement files. |
| --src     | string  | string        | The source directory.                                                                             |
| --dest    | string  | string        | The destination directory.                                                                        |
| --help -h | boolean | NA            | Shows the help message.                                                                           |

### dockerExtract

Copies a resource from the docker container to a local location.

| Option    | Type    | Allowed       | Description                                                                                         |
| --------- | ------- | ------------- | --------------------------------------------------------------------------------------------------- |
| --type    | string  | 'dist', 'dev' | The files that you want to include. `dist` only distribution files. `dev` all developement files.   |
| --src     | string  | string        | The source files relative to wp-content in the docker container. Example "themes/my-awesome-theme". |
| --dest    | string  | string        | The destination directory.                                                                          |
| --help -h | boolean | NA            | Shows the help message.                                                                             |

## License

This software is licensed under the GNU General Public License v2.0 or later. See `LICENSE` for more information.
