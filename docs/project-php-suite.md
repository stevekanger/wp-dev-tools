# Wp Dev Tools Php Suite

- [Home](https://github.com/stevekanger/wp-dev-tools)
- [Cli Commands](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/cli-commands.md)
- [Creating a plugin or theme](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/create-project.md)
- [Project php suite](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-php-suite.md)
- [Project tests](https://github.com/stevekanger/wp-dev-tools/blob/main/docs/project-tests.md)

You have the choice to install the full php suite. This sets up a MVC style structure with a DI container. For full example projects see [examples](https://github.com/stevekanger/wp-dev-tools/tree/main/examples).

## Project Structure

All php resides in the `inc` folder. All classes will be autoloaded from the `inc/app` folder via composer. In the main php file several app constants are defined and the `App` will be started. At the project's core you have Controllers, Services, and Configs. All dependencies can be assinged to the `App` and retrieved when needed. Controllers, Configs, and Services define a static `make(App $app)` method to create an instance of the class where you will have access to the `App` instance.

## App

The main app class will be loaded from the main php file at the projects root. The app acts as the dependency container and offers several helper functions for getting app constants and file paths.

## Bootstrap

All dependencies and controllers can be registered in the `Bootstrap` class. You can bind your dependencies in `bind_dependecies()`.

```php
$this->app->bind(ExampleService::class, ExampleService::make());
```

Then for controllers you will register in `register_controllers()`.

```php
ExampleController::make($this->app)->register();
```

## Controllers

Controllers are you connection to wordpress. This is where you will register your wordrpess hooks. The `AbstractController` class defines `make()` and `register()`.

### Controller::make()

Static method that is called to make an instance of the controller. Takes in the `App` instance and returns an instance of the controller. You can override this method if your controller needs any specific dependencies.

### $controller->register()

This method is reserved for registering wordrpess hooks. You can add all your actions here. This is required for you to define in all controllers.

### Creating a controller

Extend the `AbstractController` to create your controller. The only required method to define is `register()` to register your hooks. If you need a dependency define a static `make()` method to get your dependency and assign to the controller.

```php
<?php

namespace ExampleNamespace\Controllers;

use ExampleNamespace\App;
use ExampleNamespace\Services\ExampleService;

final class ExampleController extends AbstractController {
    public function __construct(
        private readonly string $message,
    ) {
    }

    public static function make(App $app): static {
        return new static(
            message: $app->get(ExampleService::class)->get_message()
        );
    }

    public function register(): void {
        add_action('wp_body_open', function() {
            echo $this->message;
        });
    }
}
```

Then register your controller in `Bootstrap.php` in `register_controllers()` like:

```php
<?php

public function register_controllers(): static {
    ExampleController::make($this->app)->register();

    return $this;
}

```

## Services

Services are your business logic. You can do all your heavy lifing here. The `AbstractService` class defines `make()`.

### Service::make()

Static method that is called to make an instance of the service. Takes in the `App` instance and returns an instance of the service. You can override this method if your service needs any specific dependencies.

### Creating a service

There are no required methods in a service but if you need to get a dependency you can define the `make()` method and assign to your service.

```php
<?php

namespace ExampleNamespace\Services;

use ExampleNamespace\App;
use ExampleNamespace\Config\ExampleConfig;

final class ExampleService extends AbstractService {
    public function __construct(
        private readonly string $message,
    ) {
    }

    public static function make(App $app): static {
        return new static(
            message: $app->get(ExampleConfig::class)->message
        );
    }

    public function get_message(): string {
        return $this->message;
    }
}
```

Then register your service in `Boostrap.php` in `bind_dependecies()` like:

```php
<?php

public function bind_dependencies(): static {
    $this->app->bind(ExampleService::class, ExampleService::make(...));

    return $this;
}
```

## Configs

All configs are classes with readonly public data. This allows for solid lsp completion over someting like arrays or json files. The `AbstractConfig` defines `make()`.

### Config::make()

Static method that is called to make an instance of the config. Takes in the `App` instance and returns an instance of the config. You can override this method to assign data to your config.

### Create a config

You can define a config just by declaring a constructor. Sometimes you may need a dynamic value. You can define again define a static `make()` method and assign it.

```php
<?php

namespace ExampleNamespace\Config;

use ExampleNamespace\App;

final class ExampleConfig extends AbstractConfig {
    public function __construct(
        public readonly string $message,
    ) {
    }

    public static function make(App $app): static {
        return new static(
            message: 'Hello World!'
        );
    }
}
```

Then register your config in `Boostrap.php` in `bind_dependecies()` like:

```php
<?php

public function bind_dependencies(): static {
    $this->app->bind(ExampleConfig::class, ExampleConfig::make(...));

    return $this;
}
```

### Facades

Sometimes you may need to get a specific service outside of the container's reach. You can define a facade similar to what Laravel does.

### Create a facade.

Creating a facade for a service.

```php
<?php

namespace ExampleNamespace\Services;

use ExampleNamespace\Core\Facade;

final class ExampleServiceFacade extends Facade {
    public static function accessor(): string {
        return ExampleService::class;
    }
}
```

now you can use wherever in your app.

```php
<?php

use ExampleNamespace\Services\ExampleServiceFacade;

final class ExampleUtils {
    public static function get_message(): string {
        return ExampleServiceFacade::get_message();
    }
}
```

## Views

You may want to define some views and show them. You can easily show a view by using the `Support\View` class. The static methods of this class can make and show views from the `views` folder defined in the app constants in the main php file. By default from `inc/views`.

### View::make()

This returns an instance of `Support\View`.

### View::show()

Echo's the view content and returns an instance of `Support\View`.

### Showing a view

```php
<?php

use ExampleNamespace\Support\View;

View::show('/example-view.php');

// or with args

View::show('/example-view.php', [
    'message' => 'Hello World!'
]);

```

Example view `inc/views/example-view.php`:

```php
<div><?php echo $mesage ?? 'Whats up?' ?></div>

```
