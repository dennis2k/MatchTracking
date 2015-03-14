# Wallmob Angular Style Guide with coffee script

This guide describes best pratices and provides guidance to build our angular application in a conventional way.

## Table of Contents

  1. [Single Responsibility](#single-responsibility)
  1. [Modules](#modules)
  1. [Controllers](#controllers)
  1. [Services](#services)
  1. [Factories](#factories)
  1. [Data Services](#data-services)
  1. [Directives](#directives)
  1. [Resolving Promises for a Controller](#resolving-promises-for-a-controller)
  1. [Manual Annotating for Dependency Injection](#manual-annotating-for-dependency-injection)
  1. [Minification and Annotation](#minification-and-annotation)
  1. [Exception Handling](#exception-handling)
  1. [Naming](#naming)
  1. [Application Structure LIFT Principle](#application-structure-lift-principle)
  1. [Application Structure](#application-structure)
  1. [Modularity](#modularity)
  1. [Startup Logic](#startup-logic)
  1. [Angular $ Wrapper Services](#angular--wrapper-services)
  1. [Testing](#testing)
  1. [Animations](#animations)
  1. [Comments](#comments)
  1. [JSHint](#js-hint)
  1. [JSCS](#jscs)
  1. [Constants](#constants)
  1. [File Templates and Snippets](#file-templates-and-snippets)
  1. [Yeoman Generator](#yeoman-generator)
  1. [Routing](#routing)
  1. [Task Automation](#task-automation)
  1. [Filters](#filters)
  1. [Angular Docs](#angular-docs)
  1. [Contributing](#contributing)
  1. [License](#license)

## Single Responsibility

### Rule of 1
###### [Style [Y001](#style-y001)]

  - Define 1 component per file.

  The following example defines the `app` module and its dependencies, defines a controller, and defines a factory all in the same file.

  ```javascript
  /* avoid */
 var module = angular.module('MyModule',[])

 class MyModuleController extends BaseController
    @register(module)

 class MyModuleService extends BaseService
    @register(module)

  ```

  The same components are now separated into their own files.

  ```javascript
  /* recommended */

  // mymodule.module.coffee
  angular.module('mymodule', [])
  ```

  ```javascript
  /* recommended */

  // mycontroller.controller.coffee
  class MyController extends BaseController
    @register(angular.module('mymodule'))

  ```

  ```javascript
  /* recommended */

  // myservice.service.coffee
  class MyService extends BaseService
      @register(angular.module('mymodule'))

  ```

**[Back to top](#table-of-contents)**

## Modules

### Avoid Naming Collisions
###### [Style [Y020](#style-y020)]

  - Use unique naming conventions with separators for sub-modules.

  *Why?*: Unique names help avoid module name collisions. Separators help define modules and their submodule hierarchy. For example `app` may be your root module while `app.dashboard` and `app.users` may be modules that are used as dependencies of `app`.

### Definitions
###### [Style [Y021](#style-y021)]

  - Declare modules without a variable

  *Why?*: With 1 component per file, there is rarely a need to introduce a variable for the module.

  ```javascript
  /* avoid */
  app = angular.module('app', [
      'ngAnimate',
      'ngRoute',
      'app.shared',
      'app.dashboard'
  ]);
  ```

  Instead use the simple setter syntax.

  ```javascript
  /* recommended */
  angular
      .module('app', [
          'ngAnimate',
          'ngRoute',
          'app.shared',
          'app.dashboard'
      ]);
  ```

### Getting modules
###### [Style [Y022](#style-y022)]

  - When using a module, avoid using a variable and instead use chaining with the getter syntax.

  *Why?*: This produces more readable code and avoids variable collisions or leaks.

  ```javascript
  /* avoid */
  app = angular.module('app');

  class MyController extends BaseController
    @register(app)

  ```

  ```javascript
  /* recommended */
  class MyController extends BaseController
    @register(angular.module('app'))

  ```

## Controllers

### controllerAs View Syntax
###### [Style [Y030](#style-y030)]

  - Use the [`controllerAs`](http://www.johnpapa.net/do-you-like-your-angular-controllers-with-or-without-sugar/) syntax over the `classic controller with $scope` syntax.

  *Why?*: Controllers are constructed, "newed" up, and provide a single new instance, and the `controllerAs` syntax is closer to that of a JavaScript constructor than the `classic $scope syntax`.

  *Why?*: It promotes the use of binding to a "dotted" object in the View (e.g. `customer.name` instead of `name`), which is more contextual, easier to read, and avoids any reference issues that may occur without "dotting".

  *Why?*: Helps avoid using `$parent` calls in Views with nested controllers.

  ```html
  <!-- avoid -->
  <div ng-controller="Customer">
      {{ name }}
  </div>
  ```

  ```html
  <!-- recommended -->
  <div ng-controller="Customer as customer">
      {{ customer.name }}
  </div>
  ```

### controllerAs with vm
###### [Style [Y032](#style-y032)]

  - Use a capture variable for `this` when using the `controllerAs` syntax. Choose a consistent variable name such as `vm`, which stands for ViewModel.

  *Why?*: The `this` keyword is contextual and when used within a function inside a controller may change its context. Capturing the context of `this` avoids encountering this problem.

  ```javascript
  /* avoid */
    class MyController extends BaseController
        @inject('$scope')

        initialize : () ->
            @$scope.name = 'John Doe'

  ```

  ```javascript
  /* recommended */
  class MyController extends BaseControllerAs

      vm = {}
      initialize : () ->
          vm = @
          vm.name = 'John Doe'

  ```
  You should only need to inject the $scope when you need to use watches or listen to broadcast messages
  Note: When creating watches in a controller using `controller as`, you can watch the `vm.*` member using the following syntax. (Create watches with caution as they add more load to the digest cycle.)

  ```html
  <input ng-model="vm.title"/>
  ```

  ```javascript

  $scope.$watch('vm.title', function(current, original) {
      $log.info('vm.title was %s', original);
      $log.info('vm.title is now %s', current);
  });

  ```


### Defer Controller Logic to Services
###### [Style [Y035](#style-y035)]

  - Defer logic in a controller by delegating to services (never use $http in a controller directly)

    Logic may be reused by multiple controllers when placed within a service and exposed via a function.

    Logic in a service can more easily be isolated in a unit test, while the calling logic in the controller can be easily mocked.

    It Removes dependencies and hides implementation details from the controller.

    It Keeps the controller slim, trim, and focused.

  ```javascript

  /* avoid */
  class OrderController extends BaseController
    @inject('$http', '$q', 'config', 'userInfo')
    vm = {}
    initialize : () ->
      vm = @
      vm.isCreditOk;
      vm.total = 0;


    checkCredit : () ->
      settings = {cardType : 'VISA'}
      $http.get(settings).then((response) ->
         vm.isCreditOk = vm.total <= response.maxRemainingAmount
      )
  ```

  ```javascript
  /* recommended */
  class OrderController extends BaseController
    @inject('CreditService')
    vm = {}

    initialize : () ->
      vm = @
      vm.isCreditOk;
      vm.total = 0;

    checkCredit () ->
         vm.CreditService.isOrderTotalOk(vm.total).then((response) ->
            vm.isCreditOk = repsonse.isOK;
         )
  ```

### Keep Controllers Focused
###### [Style [Y037](#style-y037)]

  - Define a controller for a view, and try not to reuse the controller for other views. Instead, move reusable logic to services and keep the controller simple and focused on its view.
    See a controller as a air plane control tower that just coordinate planes (user inputs) and direct them to the correct gate (service)
    Do not use any dom interaction within a controller - this should be separated into a directive instead.

## Services

### Singletons
###### [Style [Y051](#style-y051)]

  - Services are singletons and return an object that contains the members of the service.

    Note: [All Angular services are singletons](https://docs.angularjs.org/guide/services).


## Data Services

### Separate Data Calls
###### [Style [Y060](#style-y060)]

  - Refactor logic for making data operations and interacting with data to a factory. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

    The controller's responsibility is for the presentation and gathering of information for the view only. It should not care how it gets the data, just that it knows who to ask for it. Separating the data services moves the logic on how to get it to the data service, and lets the controller be simpler and more focused on the view.

    This makes it easier to test (mock or real) the data calls when testing a controller that uses a data service.

    Data service implementation may have very specific code to handle the data repository. This may include headers, how to talk to the data, or other services such as $http. Separating the logic into a data service encapsulates this logic in a single place hiding the implementation from the outside consumers (perhaps a controller), also making it easier to change the implementation.

  ```javascript
  /* recommended */

  class DataService extends BaseService
    @inject('$http', 'logger')

    getAvengers : () ->
        @$http.get('/api/avengers')

  ```

    Note: The data service is called from consumers, such as a controller, hiding the implementation from the consumers, as shown below.

  ```javascript
  /* recommended */

  // controller calling the dataservice factory

  class AvengersController extends BaseController
    @inject('DataService')
    vm = {}

    initialize : () ->
        vm = @
        vm.avengers = []

    getAvengers : () ->
      vm.DataService.getAvengers().then((data) ->
          vm.avengers = data
      )

  ```

    **[Back to top](#table-of-contents)**

## Components / Directives
### Limit 1 Per File
###### [Style [Y070](#style-y070)]

  - Create one directive per file for easy to maintenance.

    Naming convention for component / directive: loader.component.coffee

    > Note: "**Best Practice**: Directives should clean up after themselves. You can use `element.on('$destroy', ...)` or `scope.$on('$destroy', ...)` to run a clean-up function when the directive is removed" ... from the Angular documentation


  ```javascript
  /* recommended syntax */
  /* loader.component.js */

  class LoaderComponenet extends BaseComponent
    @componentName = 'wmLoader'
    @directive : ($filter) ->
        restrict : 'AE',
        scope : {}
        controller : () ->
        link : (scope,element,attrs,controller) ->
  LoaderComponent.register(angular.module('app.components'))

  ```

  - You should always use the wallmob prefix (wm) for wallmob specific components. This helps identify our custom components and avoids any naming collision with 3rd party components.

### Manipulate DOM in a Directive
###### [Style [Y072](#style-y072)]

  - When manipulating the DOM directly, use a directive. If alternative ways can be used such as using CSS to set styles or the [animation services](https://docs.angularjs.org/api/ngAnimate), Angular templating, [`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) or [`ngHide`](https://docs.angularjs.org/api/ng/directive/ngHide), then use those instead. For example, if the directive simply hides and shows, use ngHide/ngShow.

    DOM manipulation can be difficult to test, debug, and there are often better ways (e.g. CSS, animations, templates)

### Restrict to Elements and Attributes
###### [Style [Y074](#style-y074)]

  - When creating a directive that makes sense as a stand-alone element, allow restrict `E` (custom element) and optionally restrict `A` (custom attribute). Generally, if it could be its own control, `E` is appropriate. General guideline is allow `EA` but lean towards implementing as an element when it's stand-alone and as an attribute when it enhances its existing DOM element.

    Why? It makes sense.

    Note: EA is the default for Angular 1.3 +


  ```html
  <!-- example usage -->
  <wm-loader></wm-loader>
  <div wm-loader></div>
  ```

### Directives and ControllerAs
###### [Style [Y075](#style-y075)]

  - Use `controller as` syntax with a directive to be consistent with using `controller as` with view and controller pairings.

    Why? It makes sense and it's not difficult.

    Note: The directive below demonstrates some of the ways you can use scope inside of link and directive controllers, using controllerAs. I in-lined the template just to keep it all in one place.

    Note: Regarding dependency injection, see [Manually Identify Dependencies](#manual-annotating-for-dependency-injection).

    Note: Note that the directive's controller is outside the directive's closure. This style eliminates issues where the injection gets created as unreachable code after a `return`.


###### [Style [Y076](#style-y076)]

  - Use `bindToController = true` when using `controller as` syntax with a directive when you want to bind the outer scope to the directive's controller's scope.

    *Why?*: It makes it easy to bind outer scope to the directive's controller scope.

    Note: `bindToController` was introduced in Angular 1.3.0.

  ```html
  <div my-example max="77"></div>
  ```

  ```javascript

  class ExampleComponent extends BaseComponent
    @componentName : 'myExample'
    @directive : () ->
      restrict: 'EA',
      templateUrl: 'example.directive.html',
      scope: {
          max: '='
      },
      controller: () ->
        vm = this;
        vm.min = 3;
        console.log('CTRL: vm.min = %s', vm.min);
        console.log('CTRL: vm.max = %s', vm.max);
      ,
      controllerAs: 'vm',
      bindToController: true

      link : (scope, element, attrs, vm) ->
        console.log(vm.min)
  ```

  ```html
  <!-- example.directive.html -->
  <div>hello world</div>
  <div>max={{vm.max}}<input ng-model="vm.max"/></div>
  <div>min={{vm.min}}<input ng-model="vm.min"/></div>
  ```

**[Back to top](#table-of-contents)**

## Resolving Promises for a Controller

### Controller Activation Promises
###### [Style [Y080](#style-y080)]

  - Resolve start-up logic for a controller in an `initialize` function.

    Placing start-up logic in a consistent place in the controller makes it easier to locate, more consistent to test, and helps avoid spreading out the activation logic across the controller.

    The controller `initialize` makes it convenient to re-use the logic for a refresh for the controller/View, keeps the logic together, gets the user to the View faster, makes animations easy on the `ng-view` or `ui-view`, and feels snappier to the user.

    In most cases however you want to put the initial controller data in the route resolve instead. This ensures that the data ready before loading the view and you avoid showing a half loaded page.

  ```javascript
  /* recommended */
  class AvengersController extends BaseController
    @inject('DataService')
    vm = {}

    initialize : () ->
      vm = @
      vm.avengers = [];
      vm.title = 'Avengers';
      vm.DataService.getAvengers().then((data) ->
          vm.avengers = data
      )
  ```


### Route Resolve Promises
###### [Style [Y081](#style-y081)]

  - Use route resolve promises when ever you controller / view needs initial data

  ```javascript
  /* recommended */
    $stateProvider.state('categories', {
        url: '/categories',
        title: 'Categories',
        templateUrl: 'app/src/modules/inventory/category-list.html',
        controller : 'CategoryListController as vm',
        resolve: {
            categoryList : (CategoryService) ->
                CategoryService.list()
        }
    })

  ```

**[Back to top](#table-of-contents)**

## Exception Handling

### decorators
###### [Style [Y110](#style-y110)]

  - Use a [decorator](https://docs.angularjs.org/api/auto/service/$provide#decorator), at config time using the [`$provide`](https://docs.angularjs.org/api/auto/service/$provide) service, on the [`$exceptionHandler`](https://docs.angularjs.org/api/ng/service/$exceptionHandler) service to perform custom actions when exceptions occur.

    *Why?*: Provides a consistent way to handle uncaught Angular exceptions for development-time or run-time.

    Note: Another option is to override the service instead of using a decorator. This is a fine option, but if you want to keep the default behavior and extend it a decorator is recommended.

    ```javascript
    /* recommended */
    angular
        .module('blocks.exception')
        .config(exceptionConfig);

    exceptionConfig.$inject = ['$provide'];

    function exceptionConfig($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'toastr'];

    function extendExceptionHandler($delegate, toastr) {
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {
                exception: exception,
                cause: cause
            };
            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             */
            toastr.error(exception.msg, errorData);
        };
    }
    ```

### Route Errors
###### [Style [Y112](#style-y112)]

  - Handle and log all routing errors using [`$routeChangeError`](https://docs.angularjs.org/api/ngRoute/service/$route#$routeChangeError).

    *Why?*: Provides a consistent way to handle all routing errors.

    *Why?*: Potentially provides a better user experience if a routing error occurs and you route them to a friendly screen with more details or recovery options.

    ```javascript
    /* recommended */
    handlingRouteChangeError = false;

    handleRoutingErrors : () ->
        /**
         * Route cancellation:
         * On routing error, go to the dashboard.
         * Provide an exit clause if it tries to do it twice.
         */
        $rootScope.$on('$routeChangeError',
            (event, current, previous, rejection) ->
                if (handlingRouteChangeError)
                    return
                handlingRouteChangeError = true;
                destination = (current && (current.title ||
                    current.name || current.loadedTemplateUrl)) ||
                    'unknown target';
                msg = 'Error routing to ' + destination + '. ' +
                    (rejection.msg || '');

                /**
                 * Optionally log using a custom service or $log.
                 */
                logger.warning(msg, [current]);

                /**
                 * On routing error, go to another route/state.
                 */
                $location.path('/');
        );
    ```

**[Back to top](#table-of-contents)**

## Naming

### Naming Guidelines
###### [Style [Y120](#style-y120)]

  - Use consistent names for all components following a pattern that describes the component's feature then (optionally) its type. My recommended pattern is `feature.type.js`. There are 2 names for most assets:
    * the file name (`avengers.controller.js`)
    * the registered component name with Angular (`AvengersController`)

    Naming conventions help provide a consistent way to find content at a glance. Consistency within the project is vital. Consistency with a team is important. Consistency across a company provides tremendous efficiency.

    The naming conventions simply helps you find your code faster and makes it easier to understand.

### Feature File Names
###### [Style [Y121](#style-y121)]

  - Use consistent names for all components following a pattern that describes the component's feature then its type.

    Provides a consistent way to quickly identify components.

    Provides pattern matching for any automated tasks.

    Use dash for word separation in file names


    ```javascript
    /**
     * recommended
     */

    // controllers
    customer.controller.coffee
    customer.controller.spec.coffee

    // services/factories
    customer.service.coffee
    customer.service.spec.coffee

    // constants
    constants.coffee

    // module definition
    customer.module.coffee

    // directives
    customer-profile.component.coffee
    customer-profile.component.specs.coffee
    ```

### Test File Names
###### [Style [Y122](#style-y122)]

  - Name test specifications similar to the component they test with a suffix of `spec`.

    It provides a consistent way to quickly identify components.

    It provides pattern matching for [karma](http://karma-runner.github.io/) or other test runners.

    ```javascript
    /**
     * recommended
     */
    customer.controller.spec.coffee
    customer.service.spec.coffee
    customer-profile.component.spec.coffee
    ```

### Controller Names
###### [Style [Y123](#style-y123)]

  - Use consistent names for all controllers named after their feature. Use UpperCamelCase for controllers, as they are constructors.

    It provides a consistent way to quickly identify and reference controllers.

    UpperCamelCase is conventional for identifying object that can be instantiated using a constructor.

    Append the controller name with the suffix `Controller`.

    The `Controller` suffix is more commonly used and is more explicitly descriptive.

    ```javascript
    /**
     * recommended
     */

    // customer-list.controller.coffee

    class CustomerListController extends BaseController

    ```

### Directive Component Names
###### [Style [Y126](#style-y126)]

  - Use consistent names for all directives using camel-case. Use a short prefix to describe the area that the directives belong (some example are company prefix or project prefix).

    It provides a consistent way to quickly identify and reference components.

    ```javascript
    /**
     * recommended
     */

    // customer-profile.component.coffee
    class CustomerProfileComponent extends BaseComponent
        @componentName = 'wmCustomerProfile'
        @directive : () ->
            ...

    // usage is <wm-customer-profile> </vm-customer-profile>

    ```

### Modules
###### [Style [Y127](#style-y127)]

  - Functionality should be separated into modules for easier reuse, replace and testing

    It provides consistency for multiple module apps, and for expanding to large applications.

    It provides an easy way to use task automation to load all module definitions first, then all other angular files (for bundling).

### Configuration
###### [Style [Y128](#style-y128)]

  - Place module configuration into modules files except for main module configurations.

  Put main module configuration into config.coffee besides app.coffee

  Modules configuration rarely exceed more than 50 - 80 lines which is okay to put in module files



### Routes
###### [Style [Y129](#style-y129)]

  - Separate route configuration into a single file e.g. route.coffee

  If the application grows too large one can separate the routes into each module. E.g. customer.routes.coffee

**[Back to top](#table-of-contents)**

## Application Structure LIFT Principle
### LIFT
###### [Style [Y140](#style-y140)]

  - Structure your app such that you can `L`ocate your code quickly, `I`dentify the code at a glance, keep the `F`lattest structure you can, and `T`ry to stay DRY. The structure should follow these 4 basic guidelines.

    It provides a consistent structure that scales well, is modular, and makes it easier to increase developer efficiency by finding code quickly. Another way to check your app structure is to ask yourself: How quickly can you open and work in all of the related files for a feature?

    When I find my structure is not feeling comfortable, I go back and revisit these LIFT guidelines

    1. `L`ocating our code is easy
    2. `I`dentify code at a glance
    3. `F`lat structure as long as we can
    4. `T`ry to stay DRY (Don’t Repeat Yourself) or T-DRY

## Application Structure

### Overall Guidelines
###### [Style [Y150](#style-y150)]

  - Have a near term view of implementation and a long term vision. In other words, start small but keep in mind on where the app is heading down the road. All of the app's code goes in a root folder named `app`. All content is 1 feature per file. Each controller, service, module, view is in its own file. All 3rd party vendor scripts are stored in another root folder and not in the `app` folder.

    Note: Find more details and reasoning behind the structure at [this original post on application structure](http://www.johnpapa.net/angular-app-structuring-guidelines/).

### Layout
###### [Style [Y151](#style-y151)]

  - Place components that define the overall layout of the application in a folder named `layout`. These may include a shell view and controller may act as the container for the app, navigation, menus, content areas, and other regions.

    *Why?*: Organizes all layout in a single place re-used throughout the application.

### Folders-by-Feature Structure
###### [Style [Y152](#style-y152)]

  - Create folders named for the feature they represent. When a folder grows to contain more than 7 files, start to consider creating a folder for them. Your threshold may be different, so adjust as needed.

    A developer can locate the code, identify what each file represents at a glance, the structure is flat as can be, and there is no repetitive nor redundant names.

    The LIFT guidelines are all covered.

    It helps reduce the app from becoming cluttered through organizing the content and keeping them aligned with the LIFT guidelines.

    ```javascript
    /**
     * recommended
     */

    app/
        app.coffee
        config.coffee
        routes.coffee
        components/
            component.module.coffee
            calendar.component.coffee
            calendar.component.html
            user-profile.component.coffee
            user-profile.component.html
        layout/
            shell.html
            shell.controller.coffee
            topnav.html
            topnav.controller.coffee
        people/
            people.module.coffee
            attendees.html
            attendees.controller.coffee
            speakers.html
            speakers.controller.coffee
            speaker-detail.html
            speaker-detail.controller.coffee
        services/
            services.module.coffee
            data.service.coffee
            localstorage.service.coffee
            logger.service.coffee
            spinner.service.coffee
        sessions/
            session.module.coffee
            sessions.html
            sessions.controller.coffee
            session-detail.html
            session-detail.controller.coffee
    ```

      Note: Do not use structuring using folders-by-type. This requires moving to multiple folders when working on a feature and gets unwieldy quickly as the app grows to 5, 10 or 25+ views and controllers (and other features), which makes it more difficult than folder-by-feature to locate files.

    ```javascript
    /*
    * avoid
    * Alternative folders-by-type.
    */

    app/
        app.coffee
        config.coffee
        routes.coffee
        controllers/
            attendees.coffee
            session-detail.coffee
            sessions.coffee
            shell.coffee
            speakers.coffee
            speaker-detail.coffee
            topnav.coffee
        components/
            calendar.component.coffee
            calendar.component.html
            user-profile.component.coffee
            user-profile.component.html
        services/
            dataservice.j
            localstorage.coffee
            logger.coffee
            spinner.coffee
        views/
            attendees.html
            session-detail.html
            sessions.html
            shell.html
            speakers.html
            speaker-detail.html
            topnav.html
    ```

**[Back to top](#table-of-contents)**

## Modularity

### Many Small, Self Contained Modules
###### [Style [Y160](#style-y160)]

  - Create small modules that encapsulate one responsibility.

    Modular applications make it easy to plug and go as they allow the development teams to build vertical slices of the applications and roll out incrementally. This means we can plug in new features as we develop them.

### Create an App Module
###### [Style [Y161](#style-y161)]

  - Create an application root module whose role is pull together all of the modules and features of your application. Name this for your application.

    Angular encourages modularity and separation patterns. Creating an application root module whose role is to tie your other modules together provides a very straightforward way to add or remove modules from your application.

### Keep the App Module Thin
###### [Style [Y162](#style-y162)]

  - Only put logic for pulling together the app in the application module. Leave features in their own modules.

    *Why?*: Adding additional roles to the application root to get remote data, display views, or other logic not related to pulling the app together muddies the app module and make both sets of features harder to reuse or turn off.

    *Why?*: The app module becomes a manifest that describes which modules help define the application.

### Feature Areas are Modules
###### [Style [Y163](#style-y163)]

  - Create modules that represent feature areas, such as layout, reusable and shared services, dashboards, and app specific features (e.g. customers, admin, sales).

    *Why?*: Self contained modules can be added to the application with little or no friction.

    *Why?*: Sprints or iterations can focus on feature areas and turn them on at the end of the sprint or iteration.

    *Why?*: Separating feature areas into modules makes it easier to test the modules in isolation and reuse code.

### Reusable Blocks are Modules
###### [Style [Y164](#style-y164)]

  - Create modules that represent reusable application blocks for common services such as exception handling, logging, diagnostics, security, and local data stashing.

    *Why?*: These types of features are needed in many applications, so by keeping them separated in their own modules they can be application generic and be reused across applications.

**[Back to top](#table-of-contents)**

## Angular $ Wrapper Services

### $document and $window
###### [Style [Y180](#style-y180)]

  - Use [`$document`](https://docs.angularjs.org/api/ng/service/$document) and [`$window`](https://docs.angularjs.org/api/ng/service/$window) instead of `document` and `window`.

    *Why?*: These services are wrapped by Angular and more easily testable than using document and window in tests. This helps you avoid having to mock document and window yourself.

### $timeout and $interval
###### [Style [Y181](#style-y181)]

  - Use [`$timeout`](https://docs.angularjs.org/api/ng/service/$timeout) and [`$interval`](https://docs.angularjs.org/api/ng/service/$interval) instead of `setTimeout` and `setInterval` .

    *Why?*: These services are wrapped by Angular and more easily testable and handle Angular's digest cycle thus keeping data binding in sync.

**[Back to top](#table-of-contents)**

## Testing
Unit testing helps maintain clean code

### Write Tests with Stories
###### [Style [Y190](#style-y190)]

  - Write a set of tests for every story. Start with an empty test and fill them in as you write the code for the story.

    Writing the test descriptions helps clearly define what your story will do, will not do, and how you can measure success.

    Use wallmobs TestUtility class for easier settings up test scenarios

    ```javascript
    describe('Testing the utility service', () ->
        /**
        * TestUtility does all boilerplate before all tests
        */
    	util = new TestUtility({
    		modules : ['app.services'] //modules to load before each test
    		inject : 'UtilityService' //inject dependencies
            controller : { name : 'PromotionController', resolves : { 'promotion' : null }, mocks : {'PromotionService' : 'PromotionServiceMock'}} //instantiate a controller
    	})
    	/**
    	* deps gives access to all injected and mocked services, controllers etc.
    	*/
    	deps = util.getDeps()

    	it("should remove a simple entry from an array",() ->
    		//Testing code
    	)
    	it("should remove an object entry form an array", () ->
    		//Testing code
    	)
    	it("should leave the array intacts as the item does not exists", () ->
    		//Testing code
    	)

    )
    ```

### Organizing Tests
###### [Style [Y197](#style-y197)]

  - Place unit test files (specs) side-by-side with your client code. Place specs that cover server integration or test multiple components in a separate `tests` folder.

    Unit tests have a direct correlation to a specific component and file in source code.

    It is easier to keep them up to date since they are always in sight. When coding whether you do TDD or test during development or test after development, the specs are side-by-side and never out of sight nor mind, and thus more likely to be maintained which also helps maintain code coverage.

    When you update source code it is easier to go update the tests at the same time.

    Placing them side-by-side makes it easy to find them and easy to move them with the source code if you move the source.

    Having the spec nearby makes it easier for the source code reader to learn how the component is supposed to be used and to discover its known limitations.

    Separating specs so they are not in a distributed build is easy with grunt or gulp.

    ```
    /src/client/app/customers/customer-detail.controller.coffee
                             /customer-detail.controller.spec.coffee
                             /customers.controller.spec.coffee
                             /customers.controller-detail.spec.coffee
                             /customers.module.coffee
    ```

**[Back to top](#table-of-contents)**