---
url: /guide/asset-versioning.md
---
# Asset versioning

One common challenge when building single-page apps is refreshing site assets when they've been changed. Thankfully, Inertia makes this easy by optionally tracking the current version of your site assets. When an asset changes, Inertia will automatically make a full page visit instead of a XHR visit on the next request.

## Configuration

To enable automatic asset refreshing, you need to tell Inertia the current version of your assets using the `InertiaRails.configure` method and setting the `config.version` property. This can be any arbitrary string (letters, numbers, or a file hash), as long as it changes when your assets have been updated.

```ruby
InertiaRails.configure do |config|
  config.version = ViteRuby.digest # or any other versioning method
end

# You can also use lazy evaluation
InertiaRails.configure do |config|
  config.version = lambda { ViteRuby.digest }
end
```

## Cache busting

Asset refreshing in Inertia works on the assumption that a hard page visit will trigger your assets to reload. However, Inertia doesn't actually do anything to force this. Typically this is done with some form of cache busting. For example, appending a version query parameter to the end of your asset URLs.

---

---
url: /guide/authentication.md
---
# Authentication

One of the benefits of using Inertia is that you don't need a special authentication system such as OAuth to connect to your data provider (API). Also, since your data is provided via your controllers, and housed on the same domain as your JavaScript components, you don't have to worry about setting up CORS.

Rather, when using Inertia, you can simply use whatever authentication system you like, such as solutions based on Rails' built-in `has_secure_password` method, or gems like [Devise](https://github.com/heartcombo/devise), [Sorcery](https://github.com/Sorcery/sorcery), [Authentication Zero](https://github.com/lazaronixon/authentication-zero), etc.

---

---
url: /guide/authorization.md
---
# Authorization

When using Inertia, authorization is best handled server-side in your application's authorization policies. However, you may be wondering how to perform checks against your authorization policies from within your Inertia page components since you won't have access to your framework's server-side helpers.

The simplest approach to solving this problem is to pass the results of your authorization checks as props to your page components.

Here's an example of how you might do this in a Rails controller using the [Action Policy](https://github.com/palkan/action_policy) gem:

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      can: {
        create_user: allowed_to?(:create, User)
      },
      users: User.all.map do |user|
        user.as_json(
          only: [:id, :first_name, :last_name, :email]
        ).merge(
          can: {
            edit_user: allowed_to?(:edit, user)
          }
        )
      end
    }
  end
end
```

---

---
url: /awesome.md
---
# Awesome Inertia Rails

## Community and social media

* [X.com](https://x.com/inertiajs) - Official X account.
* [Discord](https://discord.gg/inertiajs) - Official Discord server.
* [Reddit](https://www.reddit.com/r/inertiajs) - Inertia.js subreddit.

## Starter kits

* [Inertia Rails Starter Kit](https://github.com/skryukov/inertia-rails-shadcn-starter) - A starter kit based on the [Laravel Starter Kit](https://github.com/laravel/react-starter-kit) (React, shadcn/ui).
* [Kaze](https://github.com/gtkvn/kaze) - Rails authentication scaffolding (Hotwire/React/Vue).
* [Svelte starter template](https://github.com/georgekettle/rails_svelte) - (Svelte, shadcn/ui).

## Real-world applications

* [Code Basics](https://code-basics.com) — Free online programming courses. **Code available on [GitHub](https://github.com/hexlet-basics/hexlet-basics)**.
* [Crevio](https://crevio.co) — All-In-One creator store.
* [Hardcover](https://hardcover.app) — A social network for book lovers.
* [Clipflow](https://www.clipflow.co) — Project Management for Content Creators.
* [Switch Kanban](https://switchkanban.com.br) — Project management tool for Software Houses.

## Demo applications

* [Ruby on Rails/Vue](https://github.com/ledermann/pingcrm) by Georg Ledermann.
* [Ruby on Rails/Vue SSR/Vite](https://github.com/ElMassimo/pingcrm-vite) by Máximo Mussini.

## Packages

### Inertia-specific

* [Inertia X](https://github.com/buhrmi/inertiax) – Svelte-only fork of Inertia with additional features (Svelte).
* [useInertiaForm](https://github.com/aviemet/useInertiaForm) – direct replacement of Inertia's useForm hook with support for nested forms (React).
* [Inertia Modal](https://github.com/inertiaui/modal) – open any route in a Modal or Slideover without having to change anything about your existing routes or controllers (React, Vue).

### General

* [JsRoutes](https://github.com/railsware/js-routes) – Brings Rails named routes to JavaScript.
* [JS From Routes](https://github.com/ElMassimo/js_from_routes) – Generate path helpers and API methods from your Rails routes.
* [Typelizer](https://github.com/skryukov/typelizer) – A TypeScript type generator for Ruby serializers.
* [types\_from\_serializers](https://github.com/ElMassimo/types_from_serializers) – Generate TypeScript interfaces from your JSON serializers.

## Articles

* [Building Filters with Inertia.js and Rails: A Clean Approach](https://pedro.switchdreams.com.br/inertiajs/2025/06/03/filters-with-inertia-and-rails/) by Pedro Duarte (2025).
* [Inertial Rails project setup to use code generated from v0 (ShadcnUI, TailwindCSS4, React, TypeScript) and deploy with Kamal](https://tuyenhx.com/blog/inertia-rails-shadcn-typescript-ssr-en/) by Tom Ho (2025).
* [How We Fell Out of Love with Next.js and Back in Love with Ruby on Rails & Inertia.js](https://hardcover.app/blog/part-1-how-we-fell-out-of-love-with-next-js-and-back-in-love-with-ruby-on-rails-inertia-js) by Adam Fortuna (2025).
* [How to Handle Bundle Size in Inertia.js](https://pedro.switchdreams.com.br/inertiajs/2025/03/21/handle-bundle-size-inertiajs) by Pedro Duarte (2025).
* [Building an InertiaJS app with Rails](https://avohq.io/blog/inertia-js-with-rails) by Exequiel Rozas (2025).
* [How to Build a Twitter Clone with Rails 8 Inertia and React](https://robrace.dev/blog/build-a-twitter-clone-with-rails-inertia-and-react) by Rob Race (2025).
* [Keeping Rails cool: the modern frontend toolkit](https://evilmartians.com/chronicles/keeping-rails-cool-the-modern-frontend-toolkit) by Irina Nazarova (2024).
* [Inertia.js in Rails: a new era of effortless integration](https://evilmartians.com/chronicles/inertiajs-in-rails-a-new-era-of-effortless-integration) by Svyatoslav Kryukov (2024).

## Other

* [Inertia.js devtools](https://chromewebstore.google.com/detail/inertiajs-devtools/golilfffgehhabacoaoilfgjelagablo?hl=en) - Inertia.js page json in devtools panel.

## Videos

* [Ken Greeff's YouTube channel](https://www.youtube.com/@kengreeff/search?query=inertia) — fresh Inertia Rails content (2025).
* [InertiaJS on Rails](https://www.youtube.com/watch?v=03EjkPaCHEI\&list=PLRxuhjCzzcWj4MUjDCC9TCP_ZfcRL0I1s) – YouTube course by Brandon Shar (2021).

## Talks

* [Tropical on Rails 2025: Defying Front-End Inertia](https://www.youtube.com/watch?v=uLFItMoF_wA) by Svyatoslav Kryukov (2025).
* [RailsConf 2021: Inertia.js on Rails Lightning Talk](https://www.youtube.com/watch?v=-JT1RF-IhKs) by Brandon Shar (2021).

*Please share your projects and resources with us!*

---

---
url: /guide/client-side-setup.md
---
# Client-side setup

Once you have your [server-side framework configured](/guide/server-side-setup.md), you then need to setup your client-side framework. Inertia currently provides support for React, Vue, and Svelte.

> \[!NOTE]
> You can skip this step if you have already executed the [Rails generator](/guide/server-side-setup#rails-generator).

## Install dependencies

First, install the Inertia client-side adapter corresponding to your framework of choice.

:::tabs key:frameworks
\== Vue

```shell
npm install @inertiajs/vue3 vue
```

\== React

```shell
npm install @inertiajs/react react react-dom
```

\== Svelte 4|Svelte 5

```shell
npm install @inertiajs/svelte svelte
```

:::

## Initialize the Inertia app

Next, update your main JavaScript file to boot your Inertia app. To accomplish this, we'll use the `createInertiaApp` function to initialize the client-side framework with the base Inertia component.

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    return pages[`../pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})
```

\== React

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/react'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    return pages[`../pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(createElement(App, props))
  },
})
```

\== Svelte 4

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    return pages[`../pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})
```

\== Svelte 5

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props })
  },
})
```

:::

The `setup` callback receives everything necessary to initialize the client-side framework, including the root Inertia `App` component.

# Resolving components

The `resolve` callback tells Inertia how to load a page component. It receives a page name (string), and returns a page component module. How you implement this callback depends on which bundler (Vite or Webpack) you're using.

:::tabs key:frameworks
\== Vue

```js
// Vite
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    return pages[`../pages/${name}.vue`]
  },
  // ...
})

// Webpacker/Shakapacker
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}`),
  // ...
})
```

\== React

```js
// Vite
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    return pages[`../pages/${name}.jsx`]
  },
  //...
})

// Webpacker/Shakapacker
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}`),
  //...
})
```

\== Svelte 4|Svelte 5

```js
// Vite
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    return pages[`../pages/${name}.svelte`]
  },
  //...
})

// Webpacker/Shakapacker
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}.svelte`),
  //...
})
```

:::

By default we recommend eager loading your components, which will result in a single JavaScript bundle. However, if you'd like to lazy-load your components, see our [code splitting](/guide/code-splitting.md) documentation.

## Defining a root element

By default, Inertia assumes that your application's root template has a root element with an `id` of `app`. If your application's root element has a different `id`, you can provide it using the `id` property.

```js
createInertiaApp({
  id: 'my-app',
  // ...
})
```

---

---
url: /guide/code-splitting.md
---
# Code splitting

Code splitting breaks apart the various pages of your application into smaller bundles, which are then loaded on demand when visiting new pages. This can significantly reduce the size of the initial JavaScript bundle loaded by the browser, improving the time to first render.

While code splitting is helpful for very large projects, it does require extra requests when visiting new pages. Generally speaking, if you're able to use a single bundle, your app is going to feel snappier.

To enable code splitting you'll need to tweak the resolve callback in your `createInertiaApp()` configuration, and how you do this is different depending on which bundler you're using.

## Using Vite

Vite enables code splitting (or lazy-loading as they call it) by default when using their `import.meta.glob()` function, so simply omit the `{ eager: true }` option, or set it to false, to disable eager loading.

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true }) // [!code --]
    return pages[`../pages/${name}.vue`] // [!code --]
    const pages = import.meta.glob('../pages/**/*.vue') // [!code ++]
    return pages[`../pages/${name}.vue`]() // [!code ++]
  },
  //...
})
```

\== React

```js
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true }) // [!code --]
    return pages[`../pages/${name}.jsx`] // [!code --]
    const pages = import.meta.glob('../pages/**/*.jsx') // [!code ++]
    return pages[`../pages/${name}.jsx`]() // [!code ++]
  },
  //...
})
```

\== Svelte 4|Svelte 5

```js
// frontend/entrypoints/inertia.js
createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true }) // [!code --]
    return pages[`../pages/${name}.svelte`] // [!code --]
    const pages = import.meta.glob('../pages/**/*.svelte') // [!code ++]
    return pages[`../pages/${name}.svelte`]() // [!code ++]
  },
  //...
})
```

:::

## Using Webpacker/Shakapacker

> \[!WARNING]
> We recommend using [Vite Ruby](https://vite-ruby.netlify.app) for new projects.

To use code splitting with Webpack, you will first need to enable [dynamic imports](https://github.com/tc39/proposal-dynamic-import) via a Babel plugin. Let's install it now.

```shell
npm install @babel/plugin-syntax-dynamic-import
```

Next, create a `.babelrc` file in your project with the following configuration:

```json
{
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

Finally, update the `resolve` callback in your app's initialization code to use `import` instead of `require`.

:::tabs key:frameworks
\== Vue

```js
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}`), // [!code ii]
  resolve: (name) => import(`../pages/${name}`), // [!code ++]
  //...
})
```

\== React

```js
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}`), // [!code ii]
  resolve: (name) => import(`../pages/${name}`), // [!code ++]
  //...
})
```

\== Svelte 4|Svelte 5

```js
// javascript/packs/inertia.js
createInertiaApp({
  resolve: (name) => require(`../pages/${name}.svelte`), // [!code ii]
  resolve: (name) => import(`../pages/${name}.svelte`), // [!code ++]
  //...
})
```

:::

You should also consider using cache busting to force browsers to load the latest version of your assets. To accomplish this, add the following configuration to your webpack configuration file.

```js
// webpack.config.js
module.exports = {
  //...
  output: {
    //...
    chunkFilename: 'js/[name].js?id=[chunkhash]',
  },
}
```

---

---
url: /guide/configuration.md
---
# Configuration

Inertia Rails can be configured globally or in a specific controller (and subclasses).

## Global Configuration

Use the `InertiaRails.configure` method to set global configuration options. If using global configuration, we recommend you place the code inside an initializer:

```ruby
# config/initializers/inertia.rb

InertiaRails.configure do |config|
  # Example: force a full-reload if the deployed assets change.
  config.version = ViteRuby.digest
end
```

The default configuration can be found [here](https://github.com/inertiajs/inertia-rails/blob/master/lib/inertia_rails/configuration.rb#L5).

## Local Configuration

The `inertia_config` method allows you to override global settings in specific controllers. Use this method in your controllers to customize configuration for specific parts of your application:

```ruby
class EventsController < ApplicationController
  inertia_config(
    version: "events-#{InertiaRails.configuration.version}",
    ssr_enabled: -> { action_name == "index" },
  )
end
```

## Setting Configuration via Environment Variables

Inertia Rails supports setting any configuration option via environment variables out of the box. For each option in the configuration, you can set an environment variable prefixed with `INERTIA_` and the option name in uppercase. For example: `INERTIA_SSR_ENABLED`.

**Boolean values** (like `INERTIA_DEEP_MERGE_SHARED_DATA` or `INERTIA_SSR_ENABLED`) are parsed from the strings `"true"` or `"false"` (case-sensitive).

## Configuration Options

### `component_path_resolver`

**Default**: `->(path:, action:) { "#{path}/#{action}" }`

Use `component_path_resolver` to customize component path resolution when [`default_render`](#default_render) config value is set to `true`. The value should be callable and will receive the `path` and `action` parameters, returning a string component path. See [Automatically determine component name](/guide/responses#automatically-determine-component-name).

### `prop_transformer`

**Default**: `->(props:) { props }`

Use `prop_transformer` to apply a transformation to your props before they're sent to the view. One use-case this enables is to work with `snake_case` props within Rails while working with `camelCase` in your view:

```ruby
  inertia_config(
    prop_transformer: lambda do |props:|
      props.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    end
  )
```

> \[!NOTE]
> This controls the props provided by Inertia Rails but does not concern itself with props coming *into* Rails. You may want to add a global `before_action` to `ApplicationController`:

```ruby
before_action :underscore_params

# ...

def underscore_params
  params.deep_transform_keys! { |key| key.to_s.underscore }
end
```

### `deep_merge_shared_data`

**Default**: `false`
**ENV**: `INERTIA_DEEP_MERGE_SHARED_DATA`

@available\_since rails=3.8.0

When enabled, props will be deep merged with shared data, combining hashes
with the same keys instead of replacing them.

### `default_render`

**Default**: `false`
**ENV**: `INERTIA_DEFAULT_RENDER`

Overrides Rails default rendering behavior to render using Inertia by default.

### `encrypt_history`

**Default**: `false`
**ENV**: `INERTIA_ENCRYPT_HISTORY`

@available\_since rails=3.7.0 core=2.0.0

When enabled, you instruct Inertia to encrypt your app's history, it uses
the browser's built-in [`crypto` api](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
to encrypt the current page's data before pushing it to the history state.

### `ssr_enabled` *(experimental)*

**Default**: `false`
**ENV**: `INERTIA_SSR_ENABLED`

@available\_since rails=3.6.0 core=2.0.0

Whether to use a JavaScript server to pre-render your JavaScript pages,
allowing your visitors to receive fully rendered HTML when they first visit
your application.

Requires a JavaScript server to be available at `ssr_url`. [*Example*](https://github.com/ElMassimo/inertia-rails-ssr-template)

### `ssr_url` *(experimental)*

**Default**: `"http://localhost:13714"`
**ENV**: `INERTIA_SSR_URL`

The URL of the JS server that will pre-render the app using the specified
component and props.

### `version` *(recommended)*

**Default**: `nil`
**ENV**: `INERTIA_VERSION`

This allows Inertia to detect if the app running in the client is oudated,
forcing a full page visit instead of an XHR visit on the next request.

See [assets versioning](/guide/asset-versioning).

### `always_include_errors_hash`

**Default**: `nil`
**ENV**: `INERTIA_ALWAYS_INCLUDE_ERRORS_HASH`

@available\_since rails=master

Whether to include an empty `errors` hash in the props when no validation errors are present.

When set to `true`, an empty `errors: {}` object will always be included in Inertia responses. When set to `false`, the `errors` key will be omitted when there are no errors. The default value `nil` currently behaves like `false` but shows a deprecation warning.

The default value will be changed to `true` in the next major version.

### `parent_controller`

**Default**: `'::ApplicationController'`
**ENV**: `INERTIA_PARENT_CONTROLLER`

Specifies the base controller class for the internal `StaticController` used to render [Shorthand routes](/guide/routing#shorthand-routes).

By default, Inertia Rails creates a `StaticController` that inherits from `ApplicationController`. You can use this option to specify a different base controller (for example, to include custom authentication, layout, or before actions).

---

---
url: /guide/csrf-protection.md
---
# CSRF protection

## Making requests

Inertia's Rails adapter automatically includes the proper CSRF token when making requests via Inertia or Axios. Therefore, **no additional configuration is required**.

However, if you need to handle CSRF protection manually, one approach is to include the CSRF token as a prop on every response. You can then use the token when making Inertia requests with the `router.post` method.

:::tabs key:frameworks
\== Vue

```js
import { router, usePage } from '@inertiajs/vue3'

const page = usePage()

router.post('/users', {
  _token: page.props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

\== React

```js
import { router, usePage } from '@inertiajs/react'

const props = usePage().props

router.post('/users', {
  _token: props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

\== Svelte 4|Svelte 5

```js
import { page, router } from '@inertiajs/svelte'

router.post('/users', {
  _token: $page.props.csrf_token,
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

:::

You can even use Inertia's [shared data](/guide/shared-data.md) functionality to automatically include the `csrf_token` with each response.

However, a better approach is to use the CSRF functionality already built into [axios](https://github.com/axios/axios) for this. Axios is the HTTP library that Inertia uses under the hood.

Axios automatically checks for the existence of an `XSRF-TOKEN` cookie. If it's present, it will then include the token in an `X-XSRF-TOKEN` header for any requests it makes.

The easiest way to implement this is using server-side middleware. Simply include the `XSRF-TOKEN` cookie on each response, and then verify the token using the `X-XSRF-TOKEN` header sent in the requests from axios. (That's basically what `inertia_rails` does).

> \[!NOTE]
>
> `X-XSRF-TOKEN` header only works for [Inertia requests](/guide/the-protocol#inertia-responses). If you want to send a normal request you can use `X-CSRF-TOKEN` instead.

## Handling mismatches

When a CSRF token mismatch occurs, Rails raises the `ActionController::InvalidAuthenticityToken` error. Since that isn't a valid Inertia response, the error is shown in a modal.

Obviously, this isn't a great user experience. A better way to handle these errors is to return a redirect back to the previous page, along with a flash message that the page expired. This will result in a valid Inertia response with the flash message available as a prop which you can then display to the user. Of course, you'll need to share your [flash messages](/guide/shared-data.md#flash-messages) with Inertia for this to work.

You may modify your application's exception handler to automatically redirect the user back to the page they were previously on while flashing a message to the session. To accomplish this, you may use the `rescue_from` method in your `ApplicationController` to handle the `ActionController::InvalidAuthenticityToken` exception.

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActionController::InvalidAuthenticityToken, with: :inertia_page_expired_error

  inertia_share flash: -> { flash.to_hash }

  private

  def inertia_page_expired_error
    redirect_back_or_to('/', allow_other_host: false, notice: "The page expired, please try again.")
  end
end
```

The end result is a much better experience for your users. Instead of seeing the error modal, the user is instead presented with a message that the page "expired" and are asked to try again.

---

---
url: /guide/deferred-props.md
---
# Deferred props

@available\_since rails=3.6.0 core=2.0.0

Inertia's deferred props feature allows you to defer the loading of certain page data until after the initial page render. This can be useful for improving the perceived performance of your app by allowing the initial page render to happen as quickly as possible.

## Server side

To defer a prop, you can use the `InertiaRails.defer` method when returning your response. This method receives a callback that returns the prop data. The callback will be executed in a separate request after the initial page render.

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: -> { User.all },
      roles: -> { Role.all },
      permissions: InertiaRails.defer { Permission.all },
    }
  end
end
```

### Grouping requests

By default, all deferred props get fetched in one request after the initial page is rendered, but you can choose to fetch data in parallel by grouping props together using the `group` option with the `InertiaRails.defer` method.

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: -> { User.all },
      roles: -> { Role.all },
      permissions: InertiaRails.defer { Permission.all },
      teams: InertiaRails.defer(group: 'attributes') { Team.all },
      projects: InertiaRails.defer(group: 'attributes') { Project.all },
      tasks: InertiaRails.defer(group: 'attributes') { Task.all },
    }
  end
end
```

In the example above, the `teams`, `projects`, and `tasks` props will be fetched in one request, while the `permissions` prop will be fetched in a separate request in parallel. Group names are arbitrary strings and can be anything you choose.

### Combining with mergeable props

Deferred props can be combined with mergeable props. You can learn more about this feature in the [Merging props](/guide/merging-props) section.

## Client side

On the client side, Inertia provides the `Deferred` component to help you manage deferred props. This component will automatically wait for the specified deferred props to be available before rendering its children.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>

<template>
  <Deferred data="permissions">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <div v-for="permission in permissions">
      <!-- ... -->
    </div>
  </Deferred>
</template>
```

\== React

```jsx
import { Deferred } from '@inertiajs/react'

export default () => (
  <Deferred data="permissions" fallback={<div>Loading...</div>}>
    <PermissionsChildComponent />
  </Deferred>
)
```

\== Svelte 4

```svelte
<script>
  import { Deferred } from '@inertiajs/svelte'
  export let permissions
</script>

<Deferred data="permissions">
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</Deferred>
```

\== Svelte 5

```svelte
<script>
  import { Deferred } from '@inertiajs/svelte'
  let { permissions } = $props()
</script>

<Deferred data="permissions">
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</Deferred>
```

:::

If you need to wait for multiple deferred props to become available, you can specify an array to the `data` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Deferred } from '@inertiajs/vue3'
</script>

<template>
  <Deferred :data="['teams', 'users']">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <!-- Props are now loaded -->
  </Deferred>
</template>
```

\== React

```jsx
import { Deferred } from '@inertiajs/react'

export default () => (
  <Deferred data={['teams', 'users']} fallback={<div>Loading...</div>}>
    <ChildComponent />
  </Deferred>
)
```

\== Svelte 4

```svelte
<script>
  import { Deferred } from '@inertiajs/svelte'
  export let teams
  export let users
</script>

<Deferred data={['teams', 'users']}>
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>

  <!-- Props are now loaded -->
</Deferred>
```

\== Svelte 5

```svelte
<script>
  import { Deferred } from '@inertiajs/svelte'
  let { teams, users } = $props()
</script>

<Deferred data={['teams', 'users']}>
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}

  <!-- Props are now loaded -->
</Deferred>
```

:::

---

---
url: /guide/demo-application.md
---
# Demo application

We've setup a demo app for Inertia.js called [Ping CRM](https://demo.inertiajs.com/login). This application is built using Laravel and Vue. You can find the source code on [GitHub](https://github.com/inertiajs/pingcrm).

> \[!NOTE]
> The Ping CRM demo is hosted on Heroku and the database is reset every hour. Please be respectful when editing data.

[![Ping CRM demo](/pingcrm.png)](https://demo.inertiajs.com/login)

In addition to the Vue version of Ping CRM, we also maintain a Svelte version of the application, which you can find [on GitHub](https://github.com/inertiajs/pingcrm-svelte).

## Third party

Beyond our official demo app, Ping CRM has also been translated into numerous different languages and frameworks.

* [Ruby on Rails/Vue](https://github.com/ledermann/pingcrm) by Georg Ledermann
* [Ruby on Rails/Vue SSR/Vite](https://github.com/ElMassimo/pingcrm-vite) by Máximo Mussini
* [Laravel/React](https://github.com/Landish/pingcrm-react) by Lado Lomidze
* [Laravel/Svelte](https://github.com/zgabievi/pingcrm-svelte) by Zura G]abievi
* [Laravel/Mithril.js](https://github.com/tbreuss/pingcrm-mithril) by Thomas Breuss
* [Yii 2/Vue](https://github.com/tbreuss/pingcrm-yii2) by Thomas Breuss
* [Symfony/Vue](https://github.com/aleksblendwerk/pingcrm-symfony) by Aleks Seltenreich
* [Clojure/React](https://github.com/prestancedesign/pingcrm-clojure) by Michaël Salihi

---

---
url: /guide/error-handling.md
---
# Error handling

## Development

One of the advantages to working with a robust server-side framework is the built-in exception handling you get for free. The challenge is, if you're making an XHR request (which Inertia does) and you hit a server-side error, you're typically left digging through the network tab in your browser's devtools to diagnose the problem.

Inertia solves this issue by showing all non-Inertia responses in a modal. This means you get the same beautiful error-reporting you're accustomed to, even though you've made that request over XHR.

## Production

In production you will want to return a proper Inertia error response instead of relying on the modal-driven error reporting that is present during development. To accomplish this, you'll need to update your framework's default exception handler to return a custom error page.

When building Rails applications, you can accomplish this by using the `rescue_from` method in your `ApplicationController`.

```ruby
class ApplicationController < ActionController::Base
  rescue_from StandardError, with: :inertia_error_page

  private

  def inertia_error_page(exception)
    raise exception if Rails.env.local?

    status = ActionDispatch::ExceptionWrapper.new(nil, exception).status_code

    render inertia: 'ErrorPage', props: { status: }, status:
  end
end
```

You may have noticed we're returning an `ErrorPage` page component in the example above. You'll need to actually create this component, which will serve as the generic error page for your application. Here's an example error component you can use as a starting point.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps({ status: Number })

const title = computed(() => {
  return (
    {
      503: 'Service Unavailable',
      500: 'Server Error',
      404: 'Page Not Found',
      403: 'Forbidden',
    }[props.status] || 'Unexpected error'
  )
})

const description = computed(() => {
  return {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[props.status]
})
</script>

<template>
  <div>
    <h1>{{ status }}: {{ title }}</h1>
    <div>{{ description }}</div>
  </div>
</template>
```

\== React

```jsx
export default function ErrorPage({ status }) {
  const title =
    {
      503: 'Service Unavailable',
      500: 'Server Error',
      404: 'Page Not Found',
      403: 'Forbidden',
    }[status] || 'Unexpected error'

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status]

  return (
    <div>
      <h1>
        {status}: {title}
      </h1>
      <div>{description}</div>
    </div>
  )
}
```

\== Svelte 4

```svelte
<script>
  export let status

  $: title =
    {
      503: 'Service Unavailable',
      500: 'Server Error',
      404: 'Page Not Found',
      403: 'Forbidden',
    }[status] || 'Unexpected error'

  $: description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status]
</script>

<div>
  <h1>{status}: {title}</h1>
  <div>{description}</div>
</div>
```

\== Svelte 5

```svelte
<script>
  let { status } = $props()
  const titles = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }
  const descriptions = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }
</script>

<div>
  <h1>{titles[status]}</h1>
  <div>{description[status]}</div>
</div>
```

:::

---

---
url: /guide/events.md
---
# Events

Inertia provides an event system that allows you to "hook into" the various lifecycle events of the library.

## Registering listeners

To register an event listener, use the `router.on()` method.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

:::

Under the hood, Inertia uses native browser events, so you can also interact with Inertia events using the typical event methods you may already be familiar with - just be sure to prepend `inertia:` to the event name.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

document.addEventListener('inertia:start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

document.addEventListener('inertia:start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

document.addEventListener('inertia:start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

:::

## Removing listeners

When you register an event listener, Inertia automatically returns a callback that can be invoked to remove the event listener.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

let removeStartEventListener = router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})

// Remove the listener...
removeStartEventListener()
```

\== React

```jsx
import { router } from '@inertiajs/react'

let removeStartEventListener = router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})

// Remove the listener...
removeStartEventListener()
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

let removeStartEventListener = router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})

// Remove the listener...
removeStartEventListener()
```

:::

Combined with hooks, you can automatically remove the event listener when components unmount.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'
import { onUnmounted } from 'vue'

onUnmounted(
  router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
  }),
)
```

\== React

```jsx
import { router } from '@inertiajs/react'
import { useEffect } from 'react'

useEffect(() => {
  return router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
  })
}, [])
```

\== Svelte 4

```js
import { router } from '@inertiajs/svelte'
import { onMount } from 'svelte'

onMount(() => {
  return router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
  })
})
```

\== Svelte 5

```js
import { router } from '@inertiajs/svelte'

$effect(() => {
  return router.on('start', (event) => {
    console.log(`Starting a visit to ${event.detail.visit.url}`)
  })
})
```

:::

Alternatively, if you're using native browser events, you can remove the event listener using `removeEventListener()`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

let startEventListener = (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
}

document.addEventListener('inertia:start', startEventListener)

// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

\== React

```jsx
import { router } from '@inertiajs/react'

let startEventListener = (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
}

document.addEventListener('inertia:start', startEventListener)

// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

let startEventListener = (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
}

document.addEventListener('inertia:start', startEventListener)

// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

:::

## Cancelling events

Some events, such as `before`, `exception`, and `invalid`, support cancellation, allowing you to prevent Inertia's default behavior. Just like native events, the event will be cancelled if only one event listener calls `event.preventDefault()`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('before', (event) => {
  if (!confirm('Are you sure you want to navigate away?')) {
    event.preventDefault()
  }
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('before', (event) => {
  if (!confirm('Are you sure you want to navigate away?')) {
    event.preventDefault()
  }
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('before', (event) => {
  if (!confirm('Are you sure you want to navigate away?')) {
    event.preventDefault()
  }
})
```

:::

For convenience, if you register your event listener using `router.on()`, you can cancel the event by returning `false` from the listener.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

:::

Note, browsers do not allow cancelling the native `popstate` event, so preventing forward and back history visits while using Inertia.js is not possible.

## Before

The `before` event fires when a request is about to be made to the server. This is useful for intercepting visits.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('before', (event) => {
  console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('before', (event) => {
  console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('before', (event) => {
  console.log(`About to make a visit to ${event.detail.visit.url}`)
})
```

:::

The primary purpose of this event is to allow you to prevent a visit from happening.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('before', (event) => {
  return confirm('Are you sure you want to navigate away?')
})
```

:::

## Start

The `start` event fires when a request to the server has started. This is useful for displaying loading indicators.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('start', (event) => {
  console.log(`Starting a visit to ${event.detail.visit.url}`)
})
```

:::

The `start` event is not cancelable.

## Progress

The `progress` event fires as progress increments during file uploads.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('progress', (event) => {
  this.form.progress = event.detail.progress.percentage
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('progress', (event) => {
  this.form.progress = event.detail.progress.percentage
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('progress', (event) => {
  this.form.progress = event.detail.progress.percentage
})
```

:::

The `progress` event is not cancelable.

## Success

The `success` event fires on successful page visits, unless validation errors are present. However, this does not include history visits.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('success', (event) => {
  console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('success', (event) => {
  console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('success', (event) => {
  console.log(`Successfully made a visit to ${event.detail.page.url}`)
})
```

:::

The `success` event is not cancelable.

## Error

The `error` event fires when validation errors are present on "successful" page visits.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('error', (errors) => {
  console.log(errors)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('error', (errors) => {
  console.log(errors)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('error', (errors) => {
  console.log(errors)
})
```

:::

The `error` event is not cancelable.

## Invalid

The invalid event fires when a non-Inertia response is received from the server, such as an HTML or vanilla JSON response. A valid Inertia response is a response that has the `X-Inertia` header set to `true` with a json payload containing [the page object](/guide/the-protocol.md#the-page-object).

This event is fired for all response types, including `200`, `400`, and `500` response codes.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('invalid', (event) => {
  console.log(`An invalid Inertia response was received.`)
  console.log(event.detail.response)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('invalid', (event) => {
  console.log(`An invalid Inertia response was received.`)
  console.log(event.detail.response)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('invalid', (event) => {
  console.log(`An invalid Inertia response was received.`)
  console.log(event.detail.response)
})
```

:::

You may cancel the `invalid` event to prevent Inertia from showing the non-Inertia response modal.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('invalid', (event) => {
  event.preventDefault()

  // Handle the invalid response yourself...
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('invalid', (event) => {
  event.preventDefault()

  // Handle the invalid response yourself...
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('invalid', (event) => {
  event.preventDefault()

  // Handle the invalid response yourself...
})
```

:::

## Exception

The `exception` event fires on unexpected XHR errors such as network interruptions. In addition, this event fires for errors generated when resolving page components.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('exception', (event) => {
  console.log(`An unexpected error occurred during an Inertia visit.`)
  console.log(event.detail.error)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('exception', (event) => {
  console.log(`An unexpected error occurred during an Inertia visit.`)
  console.log(event.detail.error)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('exception', (event) => {
  console.log(`An unexpected error occurred during an Inertia visit.`)
  console.log(event.detail.error)
})
```

:::

You may cancel the `exception` event to prevent the error from being thrown.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('exception', (event) => {
  event.preventDefault()
  // Handle the error yourself
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('exception', (event) => {
  event.preventDefault()
  // Handle the error yourself
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('exception', (event) => {
  event.preventDefault()
  // Handle the error yourself
})
```

:::

This event will *not* fire for XHR requests that receive `400` and `500` level responses or for non-Inertia responses, as these situations are handled in other ways by Inertia. Please consult the [error handling](/guide/error-handling.md) documentation for more information.

## Finish

The `finish` event fires after an XHR request has completed for both "successful" and "unsuccessful" responses. This event is useful for hiding loading indicators.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('finish', (event) => {
  NProgress.done()
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('finish', (event) => {
  NProgress.done()
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('finish', (event) => {
  NProgress.done()
})
```

:::

The `finish` event is not cancelable.

## Navigate

The `navigate` event fires on successful page visits, as well as when navigating through history.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.on('navigate', (event) => {
  console.log(`Navigated to ${event.detail.page.url}`)
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.on('navigate', (event) => {
  console.log(`Navigated to ${event.detail.page.url}`)
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.on('navigate', (event) => {
  console.log(`Navigated to ${event.detail.page.url}`)
})
```

:::

The `navigate` event is not cancelable.

## Event callbacks

In addition to the global events described throughout this page, Inertia also provides a number of [event callbacks](/guide/manual-visits.md#event-callbacks) that fire when manually making Inertia visits.

---

---
url: /guide/file-uploads.md
---
# File uploads

## FormData conversion

When making Inertia requests that include files (even nested files), Inertia will automatically convert the request data into a `FormData` object. This conversion is necessary in order to submit a `multipart/form-data` request via XHR.

If you would like the request to always use a `FormData` object regardless of whether a file is present in the data, you may provide the `forceFormData` option when making the request.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  forceFormData: true,
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.post('/users', data, {
  forceFormData: true,
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  forceFormData: true,
})
```

:::

You can learn more about the `FormData` interface via its [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

> \[!WARNING]
> Prior to version 0.8.0, Inertia did not automatically convert requests to `FormData`. If you're using an Inertia release prior to this version, you will need to manually perform this conversion.

## File upload example

Let's examine a complete file upload example using Inertia. This example includes both a `name` text input and an `avatar` file input.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  name: null,
  avatar: null,
})

function submit() {
  form.post('/users')
}
</script>

<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.name" />
    <input type="file" @input="form.avatar = $event.target.files[0]" />
    <progress v-if="form.progress" :value="form.progress.percentage" max="100">
      {{ form.progress.percentage }}%
    </progress>
    <button type="submit">Submit</button>
  </form>
</template>
```

\== React

```jsx
import { useForm } from '@inertiajs/react'

const { data, setData, post, progress } = useForm({
  name: null,
  avatar: null,
})

function submit(e) {
  e.preventDefault()
  post('/users')
}

return (
  <form onSubmit={submit}>
    <input
      type="text"
      value={data.name}
      onChange={(e) => setData('name', e.target.value)}
    />
    <input type="file" onChange={(e) => setData('avatar', e.target.files[0])} />
    {progress && (
      <progress value={progress.percentage} max="100">
        {progress.percentage}%
      </progress>
    )}
    <button type="submit">Submit</button>
  </form>
)
```

\== Svelte 4

```svelte
<script>
  import { useForm } from '@inertiajs/svelte'

  const form = useForm({
    name: null,
    avatar: null,
  })

  function submit() {
    $form.post('/users')
  }
</script>

<form on:submit|preventDefault={submit}>
  <input type="text" bind:value={$form.name} />
  <input type="file" on:input={(e) => ($form.avatar = e.target.files[0])} />
  {#if $form.progress}
    <progress value={$form.progress.percentage} max="100">
      {$form.progress.percentage}%
    </progress>
  {/if}
  <button type="submit">Submit</button>
</form>
```

\== Svelte 5

```svelte
<script>
  import { useForm } from '@inertiajs/svelte'

  const form = useForm({
    name: null,
    avatar: null,
  })

  function submit(e) {
    e.preventDefault()
    $form.post('/users')
  }
</script>

<form onsubmit={submit}>
  <input type="text" bind:value={$form.name} />
  <input type="file" oninput={(e) => ($form.avatar = e.target.files[0])} />
  {#if $form.progress}
    <progress value={$form.progress.percentage} max="100">
      {$form.progress.percentage}%
    </progress>
  {/if}
  <button type="submit">Submit</button>
</form>
```

:::

This example uses the [Inertia form helper](/guide/forms.md) for convenience, since the form helper provides easy access to the current upload progress. However, you are free to submit your forms using [manual Inertia visits](/guide/manual-visits.md) as well.

## Multipart limitations

Uploading files using a `multipart/form-data` request is not natively supported in some server-side frameworks when using the `PUT`, `PATCH`, or `DELETE` HTTP methods. The simplest workaround for this limitation is to simply upload files using a `POST` request instead.

However, some frameworks, such as Laravel and Rails, support form method spoofing, which allows you to upload the files using `POST`, but have the framework handle the request as a `PUT` or `PATCH` request. This is done by including a `_method` attribute or a `X-HTTP-METHOD-OVERRIDE` header in the request.

> \[!NOTE]
> For more info see [`Rack::MethodOverride`](https://github.com/rack/rack/blob/main/lib/rack/method_override.rb).

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post(`/users/${user.id}`, {
  _method: 'put',
  avatar: form.avatar,
})

// or

form.post(`/users/${user.id}`, {
  headers: { 'X-HTTP-METHOD-OVERRIDE': 'put' },
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post(`/users/${user.id}`, {
  _method: 'put',
  avatar: form.avatar,
})

// or

form.post(`/users/${user.id}`, {
  headers: { 'X-HTTP-METHOD-OVERRIDE': 'put' },
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post(`/users/${user.id}`, {
  _method: 'put',
  avatar: form.avatar,
})

// or

form.post(`/users/${user.id}`, {
  headers: { 'X-HTTP-METHOD-OVERRIDE': 'put' },
})
```

:::

---

---
url: /guide/forms.md
---
# Forms

Inertia provides two primary ways to build forms: the `<Form>` component and the `useForm` helper. Both integrate with your server-side framework's validation and handle form submissions without full page reloads.

## Form component

@available\_since core=2.1.0

Inertia provides a `<Form>` component that behaves much like a classic HTML form, but uses Inertia under the hood to avoid full page reloads. This is the simplest way to get started with forms in Inertia:

### Submitting forms

While it's possible to make classic HTML form submissions with Inertia, it's not recommended since they cause full-page reloads. Instead, it's better to intercept form submissions and then make the [request using Inertia](/guide/manual-visits.md).

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { Form } from '@inertiajs/vue3'
</script>

<template>
  <Form action="/users" method="post">
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
  </Form>
</template>
```

Just like a traditional HTML form, there is no need to attach a `v-model` to your input fields, just give each input a `name` attribute and the `Form` component will handle the data submission for you.

\== React

```jsx
import { Form } from '@inertiajs/react'

export default () => (
  <Form action="/users" method="post">
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
  </Form>
)
```

Just like a traditional HTML form, there is no need to attach an `onChange` handler to your input fields, just give each input a `name` attribute and a `defaultValue` (if applicable) and the `Form` component will handle the data submission for you.

\== Svelte 4 | Svelte 5

```svelte
<script>
  import { Form } from '@inertiajs/svelte'
</script>

<Form action="/users" method="post">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Create User</button>
</Form>
```

Just like a traditional HTML form, there is no need to attach a `bind:` to your input fields, just give each input a `name` attribute and the `Form` component will handle the data submission for you.

:::

The component also supports advanced use cases, including nested data structures, file uploads, and dotted key notation.

:::tabs key:frameworks

\== Vue

```vue
<Form action="/reports" method="post">
  <input type="text" name="name" />
  <textarea name="report[description]"></textarea>
  <input type="text" name="report[tags][]" />
  <input type="file" name="documents" multiple />
  <button type="submit">Create Report</button>
</Form>
```

\== React

```jsx
<Form action="/reports" method="post">
  <input type="text" name="name" />
  <textarea name="report[description]"></textarea>
  <input type="text" name="report[tags][]" />
  <input type="file" name="documents" multiple />
  <button type="submit">Create Report</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<Form action="/reports" method="post">
  <input type="text" name="name" />
  <textarea name="report[description]"></textarea>
  <input type="text" name="report[tags][]" />
  <input type="file" name="documents" multiple />
  <button type="submit">Create Report</button>
</Form>
```

:::

You can pass a `transform` prop to modify the form data before submission. This is useful for injecting additional fields or transforming existing data, although hidden inputs work too.

:::tabs key:frameworks

\== Vue

```vue
<Form
  action="/posts"
  method="post"
  :transform="(data) => ({ ...data, user_id: 123 })"
>
  <input type="text" name="title" />
  <button type="submit">Create Post</button>
</Form>
```

\== React

```jsx
<Form
  action="/posts"
  method="post"
  transform={(data) => ({ ...data, user_id: 123 })}
>
  <input type="text" name="title" />
  <button type="submit">Create Post</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<Form
  action="/posts"
  method="post"
  transform={(data) => ({ ...data, user_id: 123 })}
>
  <input type="text" name="title" />
  <button type="submit">Create Post</button>
</Form>
```

:::

### Checkbox inputs

When working with checkboxes, you may want to add an explicit `value` attribute such as `value="1"`. Without a value attribute, checked checkboxes will submit as `"on"`, which some server-side validation rules may not recognize as a proper boolean value.

### Slot props

The `<Form>` component exposes reactive state and helper methods through its default slot, giving you access to form processing state, errors, and utility functions.

:::tabs key:frameworks

\== Vue

```vue
<template>
  <Form
    action="/users"
    method="post"
    #default="{
      errors,
      hasErrors,
      processing,
      progress,
      wasSuccessful,
      recentlySuccessful,
      setError,
      clearErrors,
      resetAndClearErrors,
      defaults,
      isDirty,
      reset,
      submit,
    }"
  >
    <input type="text" name="name" />
    <div v-if="errors.name">{{ errors.name }}</div>

    <button type="submit" :disabled="processing">
      {{ processing ? 'Creating...' : 'Create User' }}
    </button>

    <div v-if="wasSuccessful">User created successfully!</div>
  </Form>
</template>
```

\== React

```jsx
<Form action="/users" method="post">
  {({
    errors,
    hasErrors,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    setError,
    clearErrors,
    resetAndClearErrors,
    defaults,
    isDirty,
    reset,
    submit,
  }) => (
    <>
      <input type="text" name="name" />
      {errors.name && <div>{errors.name}</div>}

      <button type="submit" disabled={processing}>
        {processing ? 'Creating...' : 'Create User'}
      </button>

      {wasSuccessful && <div>User created successfully!</div>}
    </>
  )}
</Form>
```

\== Svelte 4

```svelte
<Form
  action="/users"
  method="post"
  let:errors
  let:hasErrors
  let:processing
  let:progress
  let:wasSuccessful
  let:recentlySuccessful
  let:setError
  let:clearErrors
  let:resetAndClearErrors
  let:defaults
  let:isDirty
  let:reset
  let:submit
>
  <input type="text" name="name" />
  {#if errors.name}
    <div>{errors.name}</div>
  {/if}

  <button type="submit" disabled={processing}>
    {processing ? 'Creating...' : 'Create User'}
  </button>

  {#if wasSuccessful}
    <div>User created successfully!</div>
  {/if}
</Form>
```

\== Svelte 5

```svelte
<Form action="/users" method="post">
  {#snippet children({
    errors,
    hasErrors,
    processing,
    progress,
    wasSuccessful,
    recentlySuccessful,
    setError,
    clearErrors,
    resetAndClearErrors,
    defaults,
    isDirty,
    reset,
    submit,
  })}
    <input type="text" name="name" />
    {#if errors.name}
      <div>{errors.name}</div>
    {/if}

    <button type="submit" disabled={processing}>
      {processing ? 'Creating...' : 'Create User'}
    </button>

    {#if wasSuccessful}
      <div>User created successfully!</div>
    {/if}
  {/snippet}
</Form>
```

:::

#### `defaults` method

@available\_since core=2.1.1

The `defaults` method allows you to update the form's default values to match the current field values. When called, subsequent `reset()` calls will restore fields to these new defaults, and the `isDirty` property will track changes from these updated defaults. Unlike `useForm`, this method accepts no arguments and always uses all current form values.

#### `errors` object

The `errors` object uses dotted notation for nested fields, allowing you to display validation messages for complex form structures.

:::tabs key:frameworks

\== Vue

```vue
<Form action="/users" method="post" #default="{ errors }">
  <input type="text" name="user.name" />
  <div v-if="errors['user.name']">{{ errors['user.name'] }}</div>
</Form>
```

\== React

```jsx
<Form action="/users" method="post">
  {({ errors }) => (
    <>
      <input type="text" name="user.name" />
      {errors['user.name'] && <div>{errors['user.name']}</div>}
    </>
  )}
</Form>
```

\== Svelte 4

```svelte
<Form action="/users" method="post" let:errors>
  <input type="text" name="user.name" />
  {#if errors['user.name']}
    <div>{errors['user.name']}</div>
  {/if}
</Form>
```

\== Svelte 5

```svelte
<Form action="/users" method="post">
  {#snippet children({ errors })}
    <input type="text" name="user.name" />
    {#if errors['user.name']}
      <div>{errors['user.name']}</div>
    {/if}
  {/snippet}
</Form>
```

:::

### Props and options

In addition to `action` and `method`, the `<Form>` component accepts several props. Many of them are identical to the options available in Inertia's [visit options](/guide/manual-visits).

:::tabs key:frameworks

\== Vue

```vue
<Form
  action="/profile"
  method="put"
  error-bag="profile"
  query-string-array-format="indices"
  :headers="{ 'X-Custom-Header': 'value' }"
  :show-progress="false"
  :transform="(data) => ({ ...data, timestamp: Date.now() })"
  :invalidate-cache-tags="['users', 'dashboard']"
  disable-while-processing
  :options="{
    preserveScroll: true,
    preserveState: true,
    preserveUrl: true,
    replace: true,
    only: ['users', 'flash'],
    except: ['secret'],
    reset: ['page'],
  }"
>
  <input type="text" name="name" />
  <button type="submit">Update</button>
</Form>
```

Some props are intentionally grouped under `options` instead of being top-level to avoid confusion. For example, `only`, `except`, and `reset` relate to *partial reloads*, not *partial submissions*. The general rule: top-level props are for the form submission itself, while `options` control how Inertia handles the subsequent visit.

When setting the `disable-while-processing` prop, the `Form` component will add the `inert` attribute to the HTML `form` tag while the form is processing to prevent user interaction.

\== React

```jsx
<Form
  action="/profile"
  method="put"
  errorBag="profile"
  queryStringArrayFormat="indices"
  headers={{ 'X-Custom-Header': 'value' }}
  showProgress={false}
  transform={(data) => ({ ...data, timestamp: Date.now() })}
  invalidateCacheTags={['users', 'dashboard']}
  disableWhileProcessing
  options={{
    preserveScroll: true,
    preserveState: true,
    preserveUrl: true,
    replace: true,
    only: ['users', 'flash'],
    except: ['secret'],
    reset: ['page'],
  }}
>
  <input type="text" name="name" />
  <button type="submit">Update</button>
</Form>
```

Some props are intentionally grouped under `options` instead of being top-level to avoid confusion. For example, `only`, `except`, and `reset` relate to *partial reloads*, not *partial submissions*. The general rule: top-level props are for the form submission itself, while `options` control how Inertia handles the subsequent visit.

When setting the `disableWhileProcessing` prop, the `Form` component will add the `inert` attribute to the HTML `form` tag while the form is processing to prevent user interaction.

\== Svelte 4 | Svelte 5

```svelte
<Form
  action="/profile"
  method="put"
  errorBag="profile"
  queryStringArrayFormat="indices"
  headers={{ 'X-Custom-Header': 'value' }}
  showProgress={false}
  transform={(data) => ({ ...data, timestamp: Date.now() })}
  invalidateCacheTags={['users', 'dashboard']}
  disableWhileProcessing
  options={{
    preserveScroll: true,
    preserveState: true,
    preserveUrl: true,
    replace: true,
    only: ['users', 'flash'],
    except: ['secret'],
    reset: ['page'],
  }}
>
  <input type="text" name="name" />
  <button type="submit">Update</button>
</Form>
```

Some props are intentionally grouped under `options` instead of being top-level to avoid confusion. For example, `only`, `except`, and `reset` relate to *partial reloads*, not *partial submissions*. The general rule: top-level props are for the form submission itself, while `options` control how Inertia handles the subsequent visit.

When setting the `disableWhileProcessing` prop, the `Form` component will add the `inert` attribute to the HTML `form` tag while the form is processing to prevent user interaction.

:::

To style the form while it's processing, you can target the inert form in the following ways:

:::tabs key:css

\== Tailwind 4

```html
<form
  action="/profile"
  method="put"
  disableWhileProcessing
  className="inert:opacity-50 inert:pointer-events-none"
>
  {/* Your form fields here */}
</form>
```

\== CSS

```css
form[inert] {
  opacity: 0.5;
  pointer-events: none;
}
```

:::

### Events

The `<Form>` component emits all the standard visit [events](/guide/events) for form submissions:

:::tabs key:frameworks

\== Vue

```vue
<Form
  action="/users"
  method="post"
  @before="handleBefore"
  @start="handleStart"
  @progress="handleProgress"
  @success="handleSuccess"
  @error="handleError"
  @finish="handleFinish"
  @cancel="handleCancel"
  @cancelToken="handleCancelToken"
>
  <input type="text" name="name" />
  <button type="submit">Create User</button>
</Form>
```

\== React

```jsx
<Form
  action="/users"
  method="post"
  onCancelToken={handleCancelToken}
  onBefore={handleBefore}
  onStart={handleStart}
  onProgress={handleProgress}
  onCancel={handleCancel}
  onSuccess={handleSuccess}
  onError={handleError}
  onFinish={handleFinish}
>
  <input type="text" name="name" />
  <button type="submit">Create User</button>
</Form>
```

\== Svelte 4

```svelte
<Form
  action="/users"
  method="post"
  on:cancelToken={handleCancelToken}
  on:before={handleBefore}
  on:start={handleStart}
  on:progress={handleProgress}
  on:cancel={handleCancel}
  on:success={handleSuccess}
  on:error={handleError}
  on:finish={handleFinish}
>
  <input type="text" name="name" />
  <button type="submit">Create User</button>
</Form>
```

\== Svelte 5

```svelte
<Form
  action="/users"
  method="post"
  onCancelToken={handleCancelToken}
  onBefore={handleBefore}
  onStart={handleStart}
  onProgress={handleProgress}
  onCancel={handleCancel}
  onSuccess={handleSuccess}
  onError={handleError}
  onFinish={handleFinish}
>
  <input type="text" name="name" />
  <button type="submit">Create User</button>
</Form>
```

:::

### Resetting the Form

@available\_since core=2.1.2

The `Form` component provides several attributes that allow you to reset the form after a submission.

To reset the form after a successful submission:

:::tabs key:frameworks

\== Vue

```vue
<!-- Reset the entire form on success -->
<Form action="/users" method="post" resetOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

<!-- Reset specific fields on success -->
<Form action="/users" method="post" :resetOnSuccess="['name']">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== React

```jsx
// Reset the entire form on success
<Form action="/users" method="post" resetOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

// Reset specific fields on success
<Form action="/users" method="post" resetOnSuccess={['name']}>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<!-- Reset the entire form on success -->
<Form action="/users" method="post" resetOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

<!-- Reset specific fields on success -->
<Form action="/users" method="post" resetOnSuccess={['name']}>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

:::

To reset the form after errors:

:::tabs key:frameworks

\== Vue

```vue
<!-- Reset the entire form on success -->
<Form action="/users" method="post" resetOnError>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

<!-- Reset specific fields on success -->
<Form action="/users" method="post" :resetOnError="['name']">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== React

```jsx
// Reset the entire form on success
<Form action="/users" method="post" resetOnError>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

// Reset specific fields on success
<Form action="/users" method="post" resetOnError={['name']}>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<!-- Reset the entire form on success -->
<Form action="/users" method="post" resetOnError>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>

<!-- Reset specific fields on success -->
<Form action="/users" method="post" resetOnError={['name']}>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

:::

### Setting New Default Values

@available\_since core=2.1.2

The `Form` component provides the `setDefaultsOnSuccess` attribute to set the current form values as the new defaults after a successful submission:

:::tabs key:frameworks

\== Vue

```vue
<Form action="/users" method="post" setDefaultsOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== React

```jsx
<Form action="/users" method="post" setDefaultsOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<Form action="/users" method="post" setDefaultsOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Submit</button>
</Form>
```

:::

### Dotted key notation

The `<Form>` component supports dotted key notation for creating nested objects from flat input names. This provides a convenient way to structure form data.

:::tabs key:frameworks

\== Vue

```vue
<Form action="/users" method="post">
  <input type="text" name="user.name" />
  <input type="text" name="user.skills[]" />
  <input type="text" name="address.street" />
  <button type="submit">Submit</button>
</Form>
```

\== React

```jsx
<Form action="/users" method="post">
  <input type="text" name="user.name" />
  <input type="text" name="user.skills[]" />
  <input type="text" name="address.street" />
  <button type="submit">Submit</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<Form action="/users" method="post">
  <input type="text" name="user.name" />
  <input type="text" name="user.skills[]" />
  <input type="text" name="address.street" />
  <button type="submit">Submit</button>
</Form>
```

:::

The example above would generate the following data structure.

```json
{
  "user": {
    "name": "John Doe",
    "skills": ["JavaScript"]
  },
  "address": {
    "street": "123 Main St"
  }
}
```

If you need literal dots in your field names (not as nested object separators), you can escape them using backslashes.

:::tabs key:frameworks

\== Vue

```vue
<Form action="/config" method="post">
  <input type="text" name="app\.name" />
  <input type="text" name="settings.theme\.mode" />
  <button type="submit">Save</button>
</Form>
```

\== React

```jsx
<Form action="/config" method="post">
  <input type="text" name="app\.name" />
  <input type="text" name="settings.theme\.mode" />
  <button type="submit">Save</button>
</Form>
```

\== Svelte 4 | Svelte 5

```svelte
<Form action="/config" method="post">
  <input type="text" name="app\.name" />
  <input type="text" name="settings.theme\.mode" />
  <button type="submit">Save</button>
</Form>
```

:::

The example above would generate the following data structure.

```json
{
  "app.name": "My Application",
  "settings": {
    "theme.mode": "dark"
  }
}
```

### Programmatic access

You can access the form's methods programmatically using refs. This provides an alternative to the [slot props](#slot-props) approach when you need to trigger form actions from outside the form.

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { ref } from 'vue'
import { Form } from '@inertiajs/vue3'

const formRef = ref()

const handleSubmit = () => {
  formRef.value.submit()
}
</script>

<template>
  <Form ref="formRef" action="/users" method="post">
    <input type="text" name="name" />
    <button type="submit">Submit</button>
  </Form>

  <button @click="handleSubmit">Submit Programmatically</button>
</template>
```

\== React

```jsx
import { useRef } from 'react'
import { Form } from '@inertiajs/react'

export default function CreateUser() {
  const formRef = useRef()

  const handleSubmit = () => {
    formRef.current.submit()
  }

  return (
    <>
      <Form ref={formRef} action="/users" method="post">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </Form>

      <button onClick={handleSubmit}>Submit Programmatically</button>
    </>
  )
}
```

\== Svelte 4 | Svelte 5

```svelte
<script>
  import { Form } from '@inertiajs/svelte'

  let formRef

  function handleSubmit() {
    formRef.submit()
  }
</script>

<Form bind:this={formRef} action="/users" method="post">
  <input type="text" name="name" />
  <button type="submit">Submit</button>
</Form>

<button on:click={handleSubmit}>Submit Programmatically</button>
```

:::

In React and Vue, refs provide access to all form methods and reactive state. In Svelte, refs expose only methods, so reactive state like isDirty and errors should be accessed via [slot props](#slot-props) instead.

## Form helper

In addition to the `<Form>` component, Inertia also provides a `useForm` helper for when you need programmatic control over your form's data and submission behavior:

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  email: null,
  password: null,
  remember: false,
})
</script>

<template>
  <form @submit.prevent="form.post('/login')">
    <!-- email -->
    <input type="text" v-model="form.email" />
    <div v-if="form.errors.email">{{ form.errors.email }}</div>
    <!-- password -->
    <input type="password" v-model="form.password" />
    <div v-if="form.errors.password">{{ form.errors.password }}</div>
    <!-- remember me -->
    <input type="checkbox" v-model="form.remember" /> Remember Me
    <!-- submit -->
    <button type="submit" :disabled="form.processing">Login</button>
  </form>
</template>
```

\== React

```jsx
import { useForm } from '@inertiajs/react'

const { data, setData, post, processing, errors } = useForm({
  email: '',
  password: '',
  remember: false,
})

function submit(e) {
  e.preventDefault()
  post('/login')
}

return (
  <form onSubmit={submit}>
    <input
      type="text"
      value={data.email}
      onChange={(e) => setData('email', e.target.value)}
    />
    {errors.email && <div>{errors.email}</div>}
    <input
      type="password"
      value={data.password}
      onChange={(e) => setData('password', e.target.value)}
    />
    {errors.password && <div>{errors.password}</div>}
    <input
      type="checkbox"
      checked={data.remember}
      onChange={(e) => setData('remember', e.target.checked)}
    />{' '}
    Remember Me
    <button type="submit" disabled={processing}>
      Login
    </button>
  </form>
)
```

\== Svelte 4

```svelte
<script>
  import { useForm } from '@inertiajs/svelte'

  const form = useForm({
    email: null,
    password: null,
    remember: false,
  })

  function submit() {
    $form.post('/login')
  }
</script>

<form on:submit|preventDefault={submit}>
  <input type="text" bind:value={$form.email} />
  {#if $form.errors.email}
    <div class="form-error">{$form.errors.email}</div>
  {/if}
  <input type="password" bind:value={$form.password} />
  {#if $form.errors.password}
    <div class="form-error">{$form.errors.password}</div>
  {/if}
  <input type="checkbox" bind:checked={$form.remember} /> Remember Me
  <button type="submit" disabled={$form.processing}>Submit</button>
</form>
```

\== Svelte 5

```svelte
<script>
  import { useForm } from '@inertiajs/svelte'

  const form = useForm({
    email: null,
    password: null,
    remember: false,
  })

  function submit(e) {
    e.preventDefault()
    $form.post('/login')
  }
</script>

<form onsubmit={submit}>
  <input type="text" bind:value={$form.email} />
  {#if $form.errors.email}
    <div class="form-error">{$form.errors.email}</div>
  {/if}
  <input type="password" bind:value={$form.password} />
  {#if $form.errors.password}
    <div class="form-error">{$form.errors.password}</div>
  {/if}
  <input type="checkbox" bind:checked={$form.remember} /> Remember Me
  <button type="submit" disabled={$form.processing}>Submit</button>
</form>
```

:::

To submit the form, you may use the `get`, `post`, `put`, `patch` and `delete` methods.

:::tabs key:frameworks
\== Vue

```js
form.submit(method, url, options)
form.get(url, options)
form.post(url, options)
form.put(url, options)
form.patch(url, options)
form.delete(url, options)
```

\== React

```jsx
const { submit, get, post, put, patch, delete: destroy } = useForm({ ... })

submit(method, url, options)
get(url, options)
post(url, options)
put(url, options)
patch(url, options)
destroy(url, options)
```

\== Svelte 4|Svelte 5

```js
$form.submit(method, url, options)
$form.get(url, options)
$form.post(url, options)
$form.put(url, options)
$form.patch(url, options)
$form.delete(url, options)
```

:::

The submit methods support all of the typical [visit options](/guide/manual-visits.md), such as `preserveState`, `preserveScroll`, and event callbacks, which can be helpful for performing tasks on successful form submissions. For example, you might use the `onSuccess` callback to reset inputs to their original state.

:::tabs key:frameworks
\== Vue

```js
form.post('/profile', {
  preserveScroll: true,
  onSuccess: () => form.reset('password'),
})
```

\== React

```jsx
const { post, reset } = useForm({ ... })

post('/profile', {
preserveScroll: true,
onSuccess: () => reset('password'),
})
```

\== Svelte 4|Svelte 5

```js
$form.post('/profile', {
  preserveScroll: true,
  onSuccess: () => $form.reset('password'),
})
```

:::

If you need to modify the form data before it's sent to the server, you can do so via the `transform()` method.

:::tabs key:frameworks
\== Vue

```js
form
  .transform((data) => ({
    ...data,
    remember: data.remember ? 'on' : '',
  }))
  .post('/login')
```

\== React

```jsx
const { transform } = useForm({ ... })

transform((data) => ({
  ...data,
  remember: data.remember ? 'on' : '',
}))
```

\== Svelte 4|Svelte 5

```js
$form
  .transform((data) => ({
    ...data,
    remember: data.remember ? 'on' : '',
  }))
  .post('/login')
```

:::

You can use the `processing` property to track if a form is currently being submitted. This can be helpful for preventing double form submissions by disabling the submit button.

:::tabs key:frameworks
\== Vue

```vue
<button type="submit" :disabled="form.processing">Submit</button>
```

\== React

```jsx
const { processing } = useForm({ ... })

<button type="submit" disabled={processing}>Submit</button>
```

\== Svelte 4|Svelte 5

```svelte
<button type="submit" disabled={$form.processing}>Submit</button>
```

:::

If your form is uploading files, the current progress event is available via the `progress` property, allowing you to easily display the upload progress.

:::tabs key:frameworks
\== Vue

```vue
<progress v-if="form.progress" :value="form.progress.percentage" max="100">
  {{ form.progress.percentage }}%
</progress>
```

\== React

```jsx
const { progress } = useForm({ ... })

{progress && (
  <progress value={progress.percentage} max="100">
    {progress.percentage}%
  </progress>
)}
```

\== Svelte 4|Svelte 5

```svelte
{#if $form.progress}
  <progress value={$form.progress.percentage} max="100">
    {$form.progress.percentage}%
  </progress>
{/if}
```

:::

If there are form validation errors, they are available via the `errors` property. When building Rails powered Inertia applications, form errors will automatically be populated when your application throws instances of `ActiveRecord::RecordInvalid`, such as when using `#save!`.

:::tabs key:frameworks
\== Vue

```vue
<div v-if="form.errors.email">{{ form.errors.email }}</div>
```

\== React

```jsx
const { errors } = useForm({ ... })

{errors.email && <div>{errors.email}</div>}
```

\== Svelte 4|Svelte 5

```svelte
{#if $form.errors.email}
  <div>{$form.errors.email}</div>
{/if}
```

:::

> \[!NOTE]
> For a more thorough discussion of form validation and errors, please consult the [validation documentation](/guide/validation.md).

To determine if a form has any errors, you may use the `hasErrors` property. To clear form errors, use the `clearErrors()` method.

:::tabs key:frameworks
\== Vue

```js
// Clear all errors...
form.clearErrors()

// Clear errors for specific fields...
form.clearErrors('field', 'anotherfield')
```

\== React

```jsx
const { clearErrors } = useForm({ ... })

// Clear all errors...
clearErrors()

// Clear errors for specific fields...
clearErrors('field', 'anotherfield')
```

\== Svelte 4|Svelte 5

```js
// Clear all errors...
$form.clearErrors()

// Clear errors for specific fields...
$form.clearErrors('field', 'anotherfield')
```

:::

If you're using a client-side input validation libraries or do client-side validation manually, you can set your own errors on the form using the `setError()` method.

:::tabs key:frameworks
\== Vue

```js
// Set a single error...
form.setError('field', 'Your error message.')

// Set multiple errors at once...
form.setError({
  foo: 'Your error message for the foo field.',
  bar: 'Some other error for the bar field.',
})
```

\== React

```jsx
const { setError } = useForm({ ... })

// Set a single error...
setError('field', 'Your error message.');

// Set multiple errors at once...
setError({
  foo: 'Your error message for the foo field.',
  bar: 'Some other error for the bar field.'
});
```

\== Svelte 4|Svelte 5

```js
// Set a single error
$form.setError('field', 'Your error message.')

// Set multiple errors at once
$form.setError({
  foo: 'Your error message for the foo field.',
  bar: 'Some other error for the bar field.',
})
```

:::

> \[!NOTE]
> Unlike an actual form submission, the page's props remain unchanged when manually setting errors on a form instance.

When a form has been successfully submitted, the `wasSuccessful` property will be `true`. In addition to this, forms have a `recentlySuccessful` property, which will be set to `true` for two seconds after a successful form submission. This property can be utilized to show temporary success messages.

To reset the form's values back to their default values, you can use the `reset()` method.

:::tabs key:frameworks
\== Vue

```js
// Reset the form...
form.reset()

// Reset specific fields...
form.reset('field', 'anotherfield')
```

\== React

```jsx
const { reset } = useForm({ ... })

// Reset the form...
reset()

// Reset specific fields...
reset('field', 'anotherfield')
```

\== Svelte 4|Svelte 5

```js
// Reset the form...
$form.reset()

// Reset specific fields...
$form.reset('field', 'anotherfield')
```

:::

@available\_since core=2.0.15

Sometimes, you may want to restore your form fields to their default values and clear any validation errors at the same time. Instead of calling `reset()` and `clearErrors()` separately, you can use the `resetAndClearErrors()` method, which combines both actions into a single call.

:::tabs key:frameworks

\== Vue

```js
// Reset the form and clear all errors...
form.resetAndClearErrors()

// Reset specific fields and clear their errors...
form.resetAndClearErrors('field', 'anotherfield')
```

\== React

```jsx
const { resetAndClearErrors } = useForm({ ... })

// Reset the form and clear all errors...
resetAndClearErrors()

// Reset specific fields and clear their errors...
resetAndClearErrors('field', 'anotherfield')
```

\== Svelte 4|Svelte 5

```js
// Reset the form and clear all errors...
$form.resetAndClearErrors()

// Reset specific fields and clear their errors...
$form.resetAndClearErrors('field', 'anotherfield')
```

:::

If your form's default values become outdated, you can use the `defaults()` method to update them. Then, the form will be reset to the correct values the next time the `reset()` method is invoked.

:::tabs key:frameworks
\== Vue

```js
// Set the form's current values as the new defaults...
form.defaults()

// Update the default value of a single field...
form.defaults('email', 'updated-default@example.com')

// Update the default value of multiple fields...
form.defaults({
  name: 'Updated Example',
  email: 'updated-default@example.com',
})
```

\== React

```jsx
const { setDefaults } = useForm({ ... })

// Set the form's current values as the new defaults...
setDefaults()

// Update the default value of a single field...
setDefaults('email', 'updated-default@example.com')

// Update the default value of multiple fields...
setDefaults({
  name: 'Updated Example',
  email: 'updated-default@example.com',
})
```

\== Svelte 4|Svelte 5

```js
// Set the form's current values as the new defaults...
$form.defaults()

// Update the default value of a single field...
$form.defaults('email', 'updated-default@example.com')

// Change the default value of multiple fields...
$form.defaults({
  name: 'Updated Example',
  email: 'updated-default@example.com',
})
```

:::

To determine if a form has any changes, you may use the `isDirty` property.

:::tabs key:frameworks
\== Vue

```vue
<div v-if="form.isDirty">There are unsaved form changes.</div>
```

\== React

```jsx
const { isDirty } = useForm({ ... })

{isDirty && <div>There are unsaved form changes.</div>}
```

\== Svelte 4|Svelte 5

```svelte
{#if $form.isDirty}
  <div>There are unsaved form changes.</div>
{/if}
```

:::

To cancel a form submission, use the `cancel()` method.

:::tabs key:frameworks
\== Vue

```vue
form.cancel()
```

\== React

```jsx
const { cancel } = useForm({ ... })

cancel()
```

\== Svelte 4|Svelte 5

```svelte
$form.cancel()
```

:::

To instruct Inertia to store a form's data and errors in [history state](/guide/remembering-state.md), you can provide a unique form key as the first argument when instantiating your form.

:::tabs key:frameworks
\== Vue

```js
import { useForm } from '@inertiajs/vue3'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`, data)
```

\== React

```js
import { useForm } from '@inertiajs/react'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`, data)
```

\== Svelte 4|Svelte 5

```js
import { useForm } from '@inertiajs/svelte'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`, data)
```

:::

## Server-side responses

When using Inertia, you don't typically inspect form responses client-side like you would with traditional XHR/fetch requests. Instead, your server-side route or controller issues a [redirect](/guide/redirects) response after processing the form, often redirecting to a success page.

```ruby
class UsersController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      redirect_to users_url
    else
      redirect_to new_user_url, inertia: { errors: user.errors }
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
```

This redirect-based approach works with all form submission methods: the `<Form>` component, `useForm` helper, and manual router submissions. It makes handling Inertia forms feel very similar to classic server-side form submissions.

## Server-side validation

Both the `<Form>` component and `useForm` helper automatically handle server-side validation errors. When your server returns validation errors, they're automatically available in the `errors` object without any additional configuration.

Unlike traditional XHR/fetch requests where you'd check for a `422` status code, Inertia handles validation errors as part of its redirect-based flow, just like classic server-side form submissions, but without the full page reload.

For a complete guide on validation error handling, including error bags and advanced scenarios, see the [validation documentation](/guide/validation).

## Manual form submissions

It's also possible to submit forms manually using Inertia's `router` methods directly, without using the `<Form>` component or `useForm` helper:

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

const form = reactive({
  first_name: null,
  last_name: null,
  email: null,
})

function submit() {
  router.post('/users', form)
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="first_name">First name:</label>
    <input id="first_name" v-model="form.first_name" />
    <label for="last_name">Last name:</label>
    <input id="last_name" v-model="form.last_name" />
    <label for="email">Email:</label>
    <input id="email" v-model="form.email" />
    <button type="submit">Submit</button>
  </form>
</template>
```

\== React

```jsx
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function Edit() {
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  function handleChange(e) {
    const key = e.target.id
    const value = e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post('/users', values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">First name:</label>
      <input
        id="first_name"
        value={values.first_name}
        onChange={handleChange}
      />
      <label htmlFor="last_name">Last name:</label>
      <input id="last_name" value={values.last_name} onChange={handleChange} />
      <label htmlFor="email">Email:</label>
      <input id="email" value={values.email} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

\== Svelte 4

```svelte
<script>
  import { router } from '@inertiajs/svelte'

  let values = {
    first_name: null,
    last_name: null,
    email: null,
  }

  function submit() {
    router.post('/users', values)
  }
</script>

<form on:submit|preventDefault={submit}>
  <label for="first_name">First name:</label>
  <input id="first_name" bind:value={values.first_name} />

  <label for="last_name">Last name:</label>
  <input id="last_name" bind:value={values.last_name} />

  <label for="email">Email:</label>
  <input id="email" bind:value={values.email} />

  <button type="submit">Submit</button>
</form>
```

\== Svelte 5

```svelte
<script>
  import { router } from '@inertiajs/svelte'

  let values = {
    first_name: null,
    last_name: null,
    email: null,
  }

  function submit(e) {
    e.preventDefault()
    router.post('/users', values)
  }
</script>

<form onsubmit={submit}>
  <label for="first_name">First name:</label>
  <input id="first_name" bind:value={values.first_name} />

  <label for="last_name">Last name:</label>
  <input id="last_name" bind:value={values.last_name} />

  <label for="email">Email:</label>
  <input id="email" bind:value={values.email} />

  <button type="submit">Submit</button>
</form>
```

:::

## File uploads

When making requests or form submissions that include files, Inertia will automatically convert the request data into a `FormData` object. This works with the `<Form>` component, `useForm` helper, and manual router submissions.

For more information on file uploads, including progress tracking, see the [file uploads documentation](/guide/file-uploads).

## XHR / fetch submissions

Using Inertia to submit forms works great for the vast majority of situations. However, in the event that you need more control over the form submission, you're free to make plain XHR or `fetch` requests instead, using the library of your choice.

---

---
url: /cookbook/handling-validation-error-types.md
---
# Handling Rails validation error types

When using Inertia Rails with TypeScript, you might encounter a mismatch between the way Rails and Inertia handle validation errors.

* Inertia's `useForm` hook expects the `errors` object to have values as single strings (e.g., `"This field is required"`).
* Rails model errors (`model.errors`), however, provide an array of strings for each field (e.g., `["This field is required", "Must be unique"]`).

If you pass `inertia: { errors: user.errors }` directly from a Rails controller, this mismatch will cause a type conflict.

We'll explore two options to resolve this issue.

## Option 1: Adjust Inertia types

You can update the TypeScript definitions to match the Rails error format (arrays of strings).

Create a custom type definition file in your project:

:::tabs key:frameworks
\== Vue

```typescript
// frontend/app/types/inertia-rails.d.ts
import type { FormDataConvertible, FormDataKeys } from '@inertiajs/core'
import type { InertiaFormProps as OriginalProps } from '@inertiajs/vue3'

type FormDataType = Record<string, FormDataConvertible>

declare module '@inertiajs/vue3' {
  interface InertiaFormProps<TForm extends FormDataType>
    extends Omit<OriginalProps<TForm>, 'errors' | 'setError'> {
    errors: Partial<Record<FormDataKeys<TForm>, string[]>>

    setError(field: FormDataKeys<TForm>, value: string[]): this

    setError(errors: Record<FormDataKeys<TForm>, string[]>): this
  }

  export type InertiaForm<TForm extends FormDataType> = TForm &
    InertiaFormProps<TForm>

  export { InertiaFormProps, InertiaForm }

  export function useForm<TForm extends FormDataType>(
    data: TForm | (() => TForm),
  ): InertiaForm<TForm>
  export function useForm<TForm extends FormDataType>(
    rememberKey: string,
    data: TForm | (() => TForm),
  ): InertiaForm<TForm>
}
```

\== React

```typescript
// frontend/app/types/inertia-rails.d.ts
import type { FormDataConvertible, FormDataKeys } from '@inertiajs/core'
import type { InertiaFormProps as OriginalProps } from '@inertiajs/react'

type FormDataType = Record<string, FormDataConvertible>

declare module '@inertiajs/react' {
  interface InertiaFormProps<TForm extends FormDataType>
    extends Omit<OriginalProps<TForm>, 'errors' | 'setError'> {
    errors: Partial<Record<FormDataKeys<TForm>, string[]>>

    setError(field: FormDataKeys<TForm>, value: string[]): void

    setError(errors: Record<FormDataKeys<TForm>, string[]>): void
  }

  export { InertiaFormProps }

  export function useForm<TForm extends FormDataType>(
    initialValues?: TForm,
  ): InertiaFormProps<TForm>
  export function useForm<TForm extends FormDataType>(
    rememberKey: string,
    initialValues?: TForm,
  ): InertiaFormProps<TForm>
}
```

\== Svelte 4|Svelte 5

```typescript
// frontend/app/types/inertia-rails.d.ts
import type { FormDataConvertible, FormDataKeys } from '@inertiajs/core'
import type { InertiaFormProps as OriginalProps } from '@inertiajs/svelte'
import type { Writable } from 'svelte/store'

type FormDataType = Record<string, FormDataConvertible>

declare module '@inertiajs/svelte' {
  interface InertiaFormProps<TForm extends FormDataType>
    extends Omit<OriginalProps<TForm>, 'errors' | 'setError'> {
    errors: Partial<Record<FormDataKeys<TForm>, string[]>>

    setError(field: FormDataKeys<TForm>, value: string[]): this

    setError(errors: Record<FormDataKeys<TForm>, string[]>): this
  }

  type InertiaForm<TForm extends FormDataType> = InertiaFormProps<TForm> & TForm

  export { InertiaFormProps, InertiaForm }

  export function useForm<TForm extends FormDataType>(
    data: TForm | (() => TForm),
  ): Writable<InertiaForm<TForm>>
  export function useForm<TForm extends FormDataType>(
    rememberKey: string,
    data: TForm | (() => TForm),
  ): Writable<InertiaForm<TForm>>
}
```

:::

This tells TypeScript to expect errors as arrays of strings, matching Rails' format.

> \[!NOTE]
> Make sure that `d.ts` files are referenced in your `tsconfig.json` or `tsconfig.app.json`. If it reads something like `"include": ["app/frontend/**/*.ts"]` or `"include": ["app/frontend/**/*"]` and your `d.ts` file is inside `app/frontend`, it should work.

## Option 2: Serialize errors in Rails

You can add a helper on the Rails backend to convert error arrays into single strings before sending them to Inertia.

1. Add a helper method (e.g., in `ApplicationController`):

   ```ruby
   def inertia_errors(model)
     {
       errors: model.errors.to_hash(true).transform_values(&:to_sentence)
     }
   end
   ```

   This combines multiple error messages for each field into a single string.

2. Use the helper when redirecting with errors:

   ```ruby
   redirect_back inertia: inertia_errors(model)
   ```

This ensures the errors sent to the frontend are single strings, matching Inertia's default expectations.

---

---
url: /guide/history-encryption.md
---
# History encryption

Imagine a scenario where your user is authenticated, browses privileged information on your site, then logs out. If they press the back button, they can still see the privileged information that is stored in the window's history state. This is a security risk. To prevent this, Inertia.js provides a history encryption feature.

## How it works

When you instruct Inertia to encrypt your app's history, it uses the browser's built-in [`crypto` api](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) to encrypt the current page's data before pushing it to the history state. We store the corresponding key in the browser's session storage. When the user navigates back to a page, we decrypt the data using the key stored in the session storage.

Once you instruct Inertia to clear your history state, we simply clear the existing key from session storage and roll out a new one. If we attempt to decrypt the history state with the new key, it will fail and Inertia will make a fresh request back to your server for the page data.

> \[!NOTE]
> History encryption relies on `window.crypto.subtle` which is only available in secure environments (sites with SSL enabled).

## Opting in

History encryption is an opt-in feature. There are several methods for enabling it:

### Global encryption

If you'd like to enable history encryption globally, set the `encrypt_history` config value to `true`.

You are able to opt out of encryption on specific pages by passing `false` to the `encrypt_history` option:

```ruby
render inertia: 'Homepage', props: {}, encrypt_history: false
```

### Per-request encryption

To encrypt the history of an individual request, simply pass `true` to the `encrypt_history` option:

```ruby
render inertia: 'Dashboard', props: {}, encrypt_history: true
```

### Controller-level encryption

You can also enable history encryption for all actions in a controller by setting the `encrypt_history` config value in the controller:

```ruby
class DashboardController < ApplicationController
  inertia_config(encrypt_history: true)

  # ...
end
```

## Clearing history

To clear the history state on the server side, you can pass the `clear_history` option to the `render` method:

```ruby
render inertia: 'Dashboard', props: {}, clear_history: true
```

Once the response has rendered on the client, the encryption key will be rotated, rendering the previous history state unreadable.

### Client-side clearing

You can also clear history directly on the client side by calling the `router.clearHistory()` method:

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.clearHistory()
```

\== React

```js
import { router } from '@inertiajs/react'

router.clearHistory()
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.clearHistory()
```

:::

---

---
url: /guide/how-it-works.md
---
# How it works

With Inertia you build applications just like you've always done with your server-side web framework of choice. You use your framework's existing functionality for routing, controllers, middleware, authentication, authorization, data fetching, and more.

However, Inertia replaces your application's view layer. Instead of using server-side rendering via PHP or Ruby templates, the views returned by your application are JavaScript page components. This allows you to build your entire frontend using React, Vue, or Svelte, while still enjoying the productivity of Laravel or your preferred server-side framework.

As you might expect, simply creating your frontend in JavaScript doesn't give you a single-page application experience. If you were to click a link, your browser would make a full page visit, which would then cause your client-side framework to reboot on the subsequent page load. This is where Inertia changes everything.

At its core, Inertia is essentially a client-side routing library. It allows you to make page visits without forcing a full page reload. This is done using the `<Link>` component, a light-weight wrapper around a normal anchor link. When you click an Inertia link, Inertia intercepts the click and makes the visit via XHR instead. You can even make these visits programmatically in JavaScript using `router.visit()`.

When Inertia makes an XHR visit, the server detects that it's an Inertia visit and, instead of returning a full HTML response, it returns a JSON response with the JavaScript page component name and data (props). Inertia then dynamically swaps out the previous page component with the new page component and updates the browser's history state.

**The end result is a silky smooth single-page experience. 🎉**

To learn more about the nitty-gritty, technical details of how Inertia works under the hood, check out [the protocol page](/guide/the-protocol.md).

---

---
url: /cookbook/inertia-modal.md
---
# Inertia Modal

[Inertia Modal](https://github.com/inertiaui/modal) is a powerful library that enables you to render any Inertia page
as a modal dialog. It seamlessly integrates with your existing Inertia Rails application, allowing you to create modal
workflows without the complexity of managing modal state manually.

Here's a summary of the features:

* Supports React and Vue
* Zero backend configuration
* Super simple frontend API
* Support for Base Route / URL
* Modal and slideover support
* Headless support
* Nested/stacked modals support
* Reusable modals
* Multiple sizes and positions
* Reload props in modals
* Easy communication between nested/stacked modals
* Highly configurable

While you can use Inertia Modal without changes on the backend, we recommend using the Rails gem
[`inertia_rails-contrib`](https://github.com/skryukov/inertia_rails-contrib) to enhance your modals with base URL support. This ensures that your modals are accessible,
SEO-friendly, and provide a better user experience.

> \[!NOTE]
> Svelte 5 is not yet supported by Inertia Modal.

## Installation

### 1. Install the NPM Package

:::tabs key:frameworks
\== Vue

```bash
npm install @inertiaui/modal-vue
```

\== React

```bash
npm install @inertiaui/modal-react
```

:::

### 2. Configure Inertia

Update your Inertia app setup to include the modal plugin:

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { renderApp } from '@inertiaui/modal-vue' // [!code ++]

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    return pages[`../pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) }) // [!code --]
    createApp({ render: renderApp(App, props) }) // [!code ++]
      .use(plugin)
      .mount(el)
  },
})
```

\== React

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/react'
import { createElement } from 'react' // [!code --]
import { renderApp } from '@inertiaui/modal-react' // [!code ++]
import { createRoot } from 'react-dom/client'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    return pages[`../pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(createElement(App, props)) // [!code --]
    root.render(renderApp(App, props)) // [!code ++]
  },
})
```

:::

### 3. Tailwind CSS Configuration

:::tabs key:frameworks
\== Vue

For Tailwind CSS v4, add the modal styles to your CSS:

```css
/* app/entrypoints/frontend/application.css */
@source "../../../node_modules/@inertiaui/modal-vue";
```

For Tailwind CSS v3, update your `tailwind.config.js`:

```js
export default {
  content: [
    './node_modules/@inertiaui/modal-vue/src/**/*.{js,vue}',
    // other paths...
  ],
}
```

\== React

For Tailwind CSS v4, add the modal styles to your CSS:

```css
/* app/entrypoints/frontend/application.css */
@source "../../../node_modules/@inertiaui/modal-react";
```

For Tailwind CSS v3, update your `tailwind.config.js`:

```js
export default {
  content: [
    './node_modules/@inertiaui/modal-react/src/**/*.{js,jsx}',
    // other paths...
  ],
}
```

:::

### 4. Add the Ruby Gem (optional but recommended)

Install the [`inertia_rails-contrib`](https://github.com/skryukov/inertia_rails-contrib) gem to your Rails application to enable base URL support for modals:

```bash
bundle add inertia_rails-contrib
```

## Basic example

The package comes with two components: `Modal` and `ModalLink`. `ModalLink` is very similar to Inertia's [built-in
`Link` component](/guide/links), but it opens the linked route in a modal instead of a full page load. So, if you have a
link that you want to open in a modal, you can simply replace `Link` with `ModalLink`.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3' // [!code --]
import { ModalLink } from '@inertiaui/modal-vue' // [!code ++]
</script>

<template>
  <!-- [!code --] -->
  <Link href="/users/create">Create User</Link>
  <!-- [!code ++] -->
  <ModalLink href="/users/create">Create User</ModalLink>
</template>
```

\== React

```jsx
import {Link} from '@inertiajs/react' // [!code --]
import {ModalLink} from '@inertiaui/modal-react' // [!code ++]

export const CreateUserButton = () => {
  return (
    <Link href="/users/create">Create User</Link> // [!code --]
    <ModalLink href="/users/create">Create User</ModalLink> // [!code ++]
  )
}
```

:::

The page you linked can then use the `Modal` component to wrap its content in a modal.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Modal } from '@inertiaui/modal-vue'
</script>

<template>
  <!-- [!code ++] -->
  <Modal>
    <h1>Create User</h1>
    <form>
      <!-- Form fields -->
    </form>
    <!-- [!code ++] -->
  </Modal>
</template>
```

\== React

```jsx
import {Modal} from '@inertiaui/modal-react'

export const CreateUser = () => {
  return (
    {/* [!code --] */}
    <>
    {/* [!code ++] */}
    <Modal>
      <h1>Create User</h1>
      <form>
        {/* Form fields */}
      </form>
      {/* [!code --] */}
    </Modal>
    {/* [!code ++] */}
    </>
  )
}
```

:::

That's it! There is no need to change anything about your routes or controllers!

## Enhanced Usage With Base URL Support

By default, Inertia Modal doesn't change the URL when opening a modal. It just stays on the same page and displays the
modal content. However, you may want to change this behavior and update the URL when opening a modal. This has a few
benefits:

* It allows users to bookmark the modal and share the URL with others.
* The modal becomes part of the browser history, so users can use the back and forward buttons.
* It makes the modal content accessible to search engines (when using [SSR](/guide/server-side-rendering)).
* It allows you to open the modal in a new tab.

> \[!NOTE]
> To enable this feature, you need to use the [`inertia_rails-contrib`](https://github.com/skryukov/inertia_rails-contrib) gem, which provides base URL support for modals.

## Define a Base Route

To define the base route for your modal, you need to use the `inertia_modal` renderer in your controller instead of the
`inertia` one. It accepts the same arguments as the `inertia` renderer:

```ruby

class UsersController < ApplicationController
  def edit
    render inertia: 'Users/Edit', props: { # [!code --]
    render inertia_modal: 'Users/Edit', props: { # [!code ++]
      user:,
      roles: -> { Role.all },
    }
  end
end
```

Then, you can pass the `base_url` parameter to the `inertia_modal` renderer to define the base route for your modal:

```ruby

class UsersController < ApplicationController
  def edit
    render inertia_modal: 'Users/Edit', props: {
      user:,
      roles: -> { Role.all },
    } # [!code --]
    }, base_url : users_path # [!code ++]
  end
end
```

> \[!WARNING] Reusing the Modal URL with different Base Routes
> The `base_url` parameter acts merely as a fallback when the modal is directly opened using a URL. If you open the
> modal from a different route, the URL will be generated based on the current route.

## Open a Modal with a Base Route

Finally, the frontend needs to know that we're using the browser history to navigate between modals. To do this, you need
to add the `navigate` attribute to the `ModalLink` component:

:::tabs key:frameworks
\== Vue

```vue
<template>
  <ModalLink navigate href="/users/create"> Create User </ModalLink>
</template>
```

\== React

```jsx
export default function UserIndex() {
  return (
    <ModalLink navigate href="/users/create">
      Create User
    </ModalLink>
  )
}
```

:::

Now, when you click the "Create User" link, it will open the modal and update the URL to `/users/create`.

## Further Reading

For advanced usage, configuration options, and additional features, check out [the official Inertia Modal documentation](https://inertiaui.com/inertia-modal/docs).

---

---
url: /cookbook/integrating-shadcn-ui.md
---
# Integrating `shadcn/ui`

This guide demonstrates how to integrate [shadcn/ui](https://ui.shadcn.com) - a collection of reusable React components - with your Inertia Rails application.

## Getting Started in 5 Minutes

If you're starting fresh, create a new Rails application with Inertia (or skip this step if you already have one):

:::tabs key:languages

\== TypeScript

```bash
rails new -JA shadcn-inertia-rails
cd shadcn-inertia-rails

bundle add inertia_rails

rails generate inertia:install --framework=react --typescript --vite --tailwind --no-interactive
Installing Inertia's Rails adapter
...
```

\== JavaScript

```bash
rails new -JA shadcn-inertia-rails
cd shadcn-inertia-rails

bundle add inertia_rails

rails generate inertia:install --framework=react --vite --tailwind --no-interactive
Installing Inertia's Rails adapter
...
```

:::

> \[!NOTE]
> You can also run `rails generate inertia:install` to run the installer interactively.
> Need more details on the initial setup? Check out our [server-side setup guide](/guide/server-side-setup.md).

## Setting Up Path Aliases

Let's configure our project to work seamlessly with `shadcn/ui`. Choose your path based on whether you're using TypeScript or JavaScript.

:::tabs key:languages

\== TypeScript

You'll need to configure two files. First, update your `tsconfig.app.json`:

```json lines
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/frontend/*"]
    }
  }
  // ...
}
```

Then, set up your `tsconfig.json` to match `shadcn/ui`'s requirements (note the `baseUrl` and `paths` properties are different from the `tsconfig.app.json`):

```json lines
{
  //...
  "compilerOptions": {
    /* Required for shadcn-ui/ui */
    "baseUrl": "./app/frontend",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

\== JavaScript

Using JavaScript? It's even simpler! Just create a `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./app/frontend",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

:::

## Initializing `shadcn/ui`

Now you can initialize `shadcn/ui` with a single command:

```bash
npx shadcn@latest init

✔ Preflight checks.
✔ Verifying framework. Found Vite.
✔ Validating Tailwind CSS.
✔ Validating import alias.
✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Neutral
✔ Would you like to use CSS variables for theming? … no / yes
✔ Writing components.json.
✔ Checking registry.
✔ Updating tailwind.config.js
✔ Updating app/frontend/entrypoints/application.css
✔ Installing dependencies.
✔ Created 1 file:
  - app/frontend/lib/utils.js

Success! Project initialization completed.
You may now add components.
```

You're all set! Want to try it out? Add your first component:

```shell
npx shadcn@latest add button
```

Now you can import and use your new button component from `@/components/ui/button`. Happy coding!

> \[!NOTE]
> Check out the [`shadcn/ui` components gallery](https://ui.shadcn.com/docs/components/accordion) to explore all the beautiful components at your disposal.

---

---
url: /guide.md
---

# Introduction

Welcome to the documentation for [inertia\_rails](https://github.com/inertiajs/inertia-rails) adapter for [Ruby on Rails](https://rubyonrails.org/) and [Inertia.js](https://inertiajs.com/).

## Why adapter-specific documentation?

The [official documentation for Inertia.js](https://inertiajs.com) is great, but it's not Rails-specific anymore (see the [legacy docs](https://legacy.inertiajs.com)). This documentation aims to fill in the gaps and provide Rails-specific examples and explanations.

## JavaScript apps the monolith way

Inertia is a new approach to building classic server-driven web apps. We call it the modern monolith.

Inertia allows you to create fully client-side rendered, single-page apps, without the complexity that comes with modern SPAs. It does this by leveraging existing server-side patterns that you already love.

Inertia has no client-side routing, nor does it require an API. Simply build controllers and page views like you've always done!

### Not a framework

Inertia isn't a framework, nor is it a replacement for your existing server-side or client-side frameworks. Rather, it's designed to work with them. Think of Inertia as glue that connects the two. Inertia does this via adapters. We currently have three official client-side adapters (React, Vue, and Svelte) and two server-side adapters (Laravel and Rails).

### Next steps

Want to learn a bit more before diving in? Check out the [who is it for](/guide/who-is-it-for.md) and [how it works](/guide/how-it-works.md) pages. Or, if you're ready to get started, jump right into the [installation instructions](/guide/server-side-setup.md).

---

---
url: /guide/links.md
---
# Links

To create links to other pages within an Inertia app, you will typically use the Inertia `<Link>` component. This component is a light wrapper around a standard anchor `<a>` link that intercepts click events and prevents full page reloads. This is [how Inertia provides a single-page app experience](/guide/how-it-works.md) once your application has been loaded.

## Creating links

To create an Inertia link, use the Inertia `<Link>` component. Any attributes you provide to this component will be proxied to the underlying HTML tag.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/">Home</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => <Link href="/">Home</Link>
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/" use:inertia>Home</a>

<Link href="/">Home</Link>
```

> \[!TIP]
> The `use:inertia` action can be applied to any HTML element.

:::

By default, Inertia renders links as anchor `<a>` elements. However, you can change the tag using the `as` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/logout" method="post" as="button">Logout</Link>
  <!-- Renders as... -->
  <!--  <button type="button">Logout</button> -->
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/logout" method="post" as="button">
    Logout
  </Link>
)

// Renders as...
// <button type="button">Logout</button>
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { Link } from '@inertiajs/svelte'
</script>

<Link href="/logout" method="post" as="button">Logout</Link>

<!-- Renders as... -->
<!-- <button type="button">Logout</button> -->
```

:::

> \[!NOTE]
> Creating `POST/PUT/PATCH/DELETE` anchor `<a>` links is discouraged as it causes "Open Link in New Tab / Window" accessibility issues. The component automatically renders a `<button>` element when using these methods.

## Method

You can specify the HTTP request method for an Inertia link request using the `method` prop. The default method used by links is `GET`, but you can use the `method` prop to make `POST`, `PUT`, `PATCH`, and `DELETE` requests via links.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/logout" method="post" as="button">Logout</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/logout" method="post" as="button">
    Logout
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<button use:inertia={{ href: '/logout', method: 'post' }} type="button">Logout</button>

<Link href="/logout" method="post">Logout</button>
```

:::

## Data

When making `POST` or `PUT` requests, you may wish to add additional data to the request. You can accomplish this using the `data` prop. The provided data can be an `object` or `FormData` instance.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/endpoint" method="post" as="button" :data="{ foo: bar }">
    Save
  </Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/endpoint" method="post" as="button" data={{ foo: bar }}>
    Save
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<button
  use:inertia={{ href: '/endpoint', method: 'post', data: { foo: bar } }}
  type="button"
>
  Save
</button>

<Link href="/endpoint" method="post" data={{ foo: bar }}>Save</Link>
```

:::

## Custom headers

The `headers` prop allows you to add custom headers to an Inertia link. However, the headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/endpoint" :headers="{ foo: bar }">Save</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/endpoint" headers={{ foo: bar }}>
    Save
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<button use:inertia={{ href: '/endpoint', headers: { foo: bar } }}>Save</button>

<Link href="/endpoint" headers={{ foo: bar }}>Save</Link>
```

:::

## Browser history

The `replace` prop allows you to specify the browser's history behavior. By default, page visits push (new) state (`window.history.pushState`) into the history; however, it's also possible to replace state (`window.history.replaceState`) by setting the `replace` prop to `true`. This will cause the visit to replace the current history state instead of adding a new history state to the stack.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/" replace>Home</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/" replace>
    Home
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/" use:inertia={{ replace: true }}>Home</a>

<Link href="/" replace>Home</Link>
```

:::

## State preservation

You can preserve a page component's local state using the `preserveState` prop. This will prevent a page component from fully re-rendering. The `preserveState` prop is especially helpful on pages that contain forms, since you can avoid manually repopulating input fields and can also maintain a focused input.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <input v-model="query" type="text" />

  <Link href="/search" :data="{ query }" preserve-state>Search</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <>
    <input onChange={this.handleChange} value={query} type="text" />

    <Link href="/search" data={query} preserveState>
      Search
    </Link>
  </>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<input bind:value={query} type="text" />

<button use:inertia={{ href: '/search', data: { query }, preserveState: true }}>
  Search
</button>

<Link href="/search" data={{ query }} preserveState>Search</Link>
```

:::

## Scroll preservation

You can use the `preserveScroll` prop to prevent Inertia from automatically resetting the scroll position when making a page visit.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/" preserve-scroll>Home</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/" preserveScroll>
    Home
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/" use:inertia={{ preserveScroll: true }}>Home</a>

<Link href="/" preserveScroll>Home</Link>
```

:::

For more information on managing scroll position, please consult the documentation on [scroll management](/guide/scroll-management).

## Partial reloads

The `only` prop allows you to specify that only a subset of a page's props (data) should be retrieved from the server on subsequent visits to that page.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users?active=true" :only="['users']">Show active</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users?active=true" only={['users']}>
    Show active
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/users?active=true" use:inertia={{ only: ['users'] }}>Show active</a>

<Link href="/users?active=true" only={['users']}>Show active</Link>
```

:::

For more information on this topic, please consult the complete documentation on [partial reloads](/guide/partial-reloads.md).

## Active states

It's often desirable to set an active state for navigation links based on the current page. This can be accomplished when using Inertia by inspecting the `page` object and doing string comparisons against the `page.url` and `page.component` properties.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <!-- URL exact match...-->
  <Link href="/users" :class="{ active: $page.url === '/users' }">Users</Link>

  <!-- Component exact match...-->
  <Link href="/users" :class="{ active: $page.component === 'Users/Index' }">
    Users
  </Link>

  <!-- URL starts with (/users, /users/create, /users/1, etc.)...-->
  <Link href="/users" :class="{ active: $page.url.startsWith('/users') }">
    Users
  </Link>

  <!-- Component starts with (Users/Index, Users/Create, Users/Show, etc.)...-->
  <Link href="/users" :class="{ active: $page.component.startsWith('Users') }">
    Users
  </Link>
</template>
```

\== React

```jsx
import { usePage } from '@inertiajs/react'

export default () => {
  const { url, component } = usePage()

  return (
    <>
      // URL exact match...
      <Link href="/users" className={url === '/users' ? 'active' : ''}>
        Users
      </Link>
      // Component exact match...
      <Link
        href="/users"
        className={component === 'Users/Index' ? 'active' : ''}
      >
        Users
      </Link>
      // URL starts with (/users, /users/create, /users/1, etc.)...
      <Link href="/users" className={url.startsWith('/users') ? 'active' : ''}>
        Users
      </Link>
      // Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
      <Link
        href="/users"
        className={component.startsWith('Users') ? 'active' : ''}
      >
        Users
      </Link>
    </>
  )
}
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link, page } from '@inertiajs/svelte'
</script>

<template>
  <!-- URL exact match... -->
  <a href="/users" use:inertia class:active={$page.url === '/users'}>Users</a>

  <!-- Component exact match... -->
  <a href="/users" use:inertia class:active={$page.component === 'Users/Index'}>
    Users
  </a>

  <!-- URL starts with (/users, /users/create, /users/1, etc.)... -->
  <Link href="/users" class={$page.url.startsWith('/users') ? 'active' : ''}>
    Users
  </Link>

  <!-- Component starts with (Users/Index, Users/Create, Users/Show, etc.)... -->
  <Link
    href="/users"
    class={$page.component.startsWith('Users') ? 'active' : ''}
  >
    Users
  </Link>
</template>
```

:::

You can perform exact match comparisons (`===`), `startsWith()` comparisons (useful for matching a subset of pages), or even more complex comparisons using regular expressions.

Using this approach, you're not limited to just setting class names. You can use this technique to conditionally render any markup on active state, such as different link text or even an SVG icon that represents the link is active.

## Data loading attribute

While a link is making an active request, a `data-loading` attribute is added to the link element. This allows you to style the link while it's in a loading state. The attribute is removed once the request is complete.

---

---
url: /guide/load-when-visible.md
---
# Load when visible

Inertia supports lazy loading data on scroll using the Intersection Observer API. It provides the `WhenVisible` component as a convenient way to load data when an element becomes visible in the viewport.

The `WhenVisible` component accepts a `data` prop that specifies the key of the prop to load. It also accepts a `fallback` prop that specifies a component to render while the data is loading. The `WhenVisible` component should wrap the component that depends on the data.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'
</script>

<template>
  <WhenVisible data="permissions">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <div v-for="permission in permissions">
      <!-- ... -->
    </div>
  </WhenVisible>
</template>
```

\== React

```jsx
import { WhenVisible } from '@inertiajs/react'

export default () => (
  <WhenVisible data="permissions" fallback={<div>Loading...</div>}>
    <PermissionsChildComponent />
  </WhenVisible>
)
```

\== Svelte 4

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'
  export let permissions
</script>

<WhenVisible data="permissions">
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</WhenVisible>
```

\== Svelte 5

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  let { permissions } = $props()
</script>

<WhenVisible data="permissions">
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</WhenVisible>
```

:::

If you'd like to load multiple props when an element becomes visible, you can provide an array to the `data` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'
</script>

<template>
  <WhenVisible :data="['teams', 'users']">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <!-- Props are now loaded -->
  </WhenVisible>
</template>
```

\== React

```jsx
import { WhenVisible } from '@inertiajs/react'

export default () => (
  <WhenVisible data={['teams', 'users']} fallback={<div>Loading...</div>}>
    <ChildComponent />
  </WhenVisible>
)
```

\== Svelte 4

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  export let teams
  export let users
</script>

<WhenVisible data={['teams', 'users']}>
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>

  <!-- Props are now loaded -->
</WhenVisible>
```

\== Svelte 5

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  let { teams, users } = $props()
</script>

<WhenVisible data={['teams', 'users']}>
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}

  <!-- Props are now loaded -->
</WhenVisible>
```

:::

## Loading before visible

If you'd like to start loading data before the element is visible, you can provide a value to the `buffer` prop. The buffer value is a number that represents the number of pixels before the element is visible.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'
</script>

<template>
  <WhenVisible data="permissions" :buffer="500">
    <template #fallback>
      <div>Loading...</div>
    </template>

    <div v-for="permission in permissions">
      <!-- ... -->
    </div>
  </WhenVisible>
</template>
```

\== React

```jsx
import { WhenVisible } from '@inertiajs/react'

export default () => (
  <WhenVisible data="permissions" buffer={500} fallback={<div>Loading...</div>}>
    <PermissionsChildComponent />
  </WhenVisible>
)
```

\== Svelte 4

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  export let permissions
</script>

<WhenVisible data="permissions" buffer={500}>
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</WhenVisible>
```

\== Svelte 5

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  let { permissions } = $props()
</script>

<WhenVisible data="permissions" buffer={500}>
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}

  {#each permissions as permission}
    <!-- ... -->
  {/each}
</WhenVisible>
```

:::

In the above example, the data will start loading 500 pixels before the element is visible.

By default, the `WhenVisible` component wraps the fallback template in a `div` element so it can ensure the element is visible in the viewport. If you want to customize the wrapper element, you can provide the `as` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'
</script>

<template>
  <WhenVisible data="products" as="span">
    <!-- ... -->
  </WhenVisible>
</template>
```

\== React

```jsx
import { WhenVisible } from '@inertiajs/react'

export default () => (
  <WhenVisible data="products" as="span">
    <ProductsChildComponent />
  </WhenVisible>
)
```

\== Svelte 4

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  export let products
</script>

<WhenVisible data="products" as="span">
  <!-- ... -->
</WhenVisible>
```

\== Svelte 5

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  let { products } = $props()
</script>

<WhenVisible data="products" as="span">
  <!-- ... -->
</WhenVisible>
```

:::

## Always trigger

By default, the `WhenVisible` component will only trigger once when the element becomes visible. If you want to always trigger the data loading when the element is visible, you can provide the `always` prop.

This is useful when you want to load data every time the element becomes visible, such as when the element is at the end of an infinite scroll list and you want to load more data.

Note that if the data loading request is already in flight, the component will wait until it is finished to start the next request if the element is still visible in the viewport.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'
</script>

<template>
  <WhenVisible data="products" always>
    <!-- ... -->
  </WhenVisible>
</template>
```

\== React

```jsx
import { WhenVisible } from '@inertiajs/react'

export default () => (
  <WhenVisible data="products" always>
    <ProductsChildComponent />
  </WhenVisible>
)
```

\== Svelte 4

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  export let products
</script>

<WhenVisible data="products" always>
  <!-- ... -->
</WhenVisible>
```

\== Svelte 5

```svelte
<script>
  import { WhenVisible } from '@inertiajs/svelte'

  let { products } = $props()
</script>

<WhenVisible data="products" always>
  <!-- ... -->
</WhenVisible>
```

:::

---

---
url: /guide/manual-visits.md
---
# Manual visits

In addition to [creating links](/guide/links.md), it's also possible to manually make Inertia visits / requests programmatically via JavaScript. This is accomplished via the `router.visit()` method.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, {
  method: 'get',
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: 'brackets',
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, {
  method: 'get',
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: 'brackets',
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, {
  method: 'get',
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: 'brackets',
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
})
```

:::

However, it's generally more convenient to use one of Inertia's shortcut request methods. These methods share all the same options as `router.visit()`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

\== React

```js
import { router } from '@inertiajs/react'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.get(url, data, options)
router.post(url, data, options)
router.put(url, data, options)
router.patch(url, data, options)
router.delete(url, options)
router.reload(options) // Uses the current URL
```

:::

The `reload()` method is a convenient, shorthand method that automatically visits the current page with `preserveState` and `preserveScroll` both set to `true`, making it the perfect method to invoke when you just want to reload the current page's data.

## Method

When making manual visits, you may use the `method` option to set the request's HTTP method to `get`, `post`, `put`, `patch` or `delete`. The default method is `get`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { method: 'post' })
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, { method: 'post' })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { method: 'post' })
```

:::

> \[!WARNING]
> Uploading files via `put` or `patch` is not supported in Rails. Instead, make the request via `post`, including a `_method` attribute or a `X-HTTP-METHOD-OVERRIDE` header set to `put` or `patch`. For more info see [`Rack::MethodOverride`](https://github.com/rack/rack/blob/main/lib/rack/method_override.rb).

# Data

You may use the `data` option to add data to the request.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit('/users', {
  method: 'post',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit('/users', {
  method: 'post',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit('/users', {
  method: 'post',
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
```

:::

For convenience, the `get()`, `post()`, `put()`, and `patch()` methods all accept data as their second argument.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', {
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', {
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', {
  name: 'John Doe',
  email: 'john.doe@example.com',
})
```

:::

## Custom headers

The `headers` option allows you to add custom headers to a request.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  headers: {
    'Custom-Header': 'value',
  },
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  headers: {
    'Custom-Header': 'value',
  },
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  headers: {
    'Custom-Header': 'value',
  },
})
```

:::

> \[!NOTE]
> The headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

## File uploads

When making visits / requests that include files, Inertia will automatically convert the request data into a `FormData` object. If you would like the request to always use a `FormData` object, you may use the `forceFormData` option.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/companies', data, {
  forceFormData: true,
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/companies', data, {
  forceFormData: true,
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/companies', data, {
  forceFormData: true,
})
```

:::

For more information on uploading files, please consult the dedicated [file uploads](/guide/file-uploads.md) documentation.

## Browser history

When making visits, Inertia automatically adds a new entry into the browser history. However, it's also possible to replace the current history entry by setting the `replace` option to `true`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { replace: true })
```

\== React

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { replace: true })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { replace: true })
```

:::

> \[!NOTE]
> Visits made to the same URL automatically set `replace` to `true`.

# Client side visits

You can use the `router.push` and `router.replace` method to make client-side visits. This method is useful when you want to update the browser's history without making a server request.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.push({
  url: '/users',
  component: 'Users',
  props: { search: 'John' },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.push({
  url: '/users',
  component: 'Users',
  props: { search: 'John' },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.push({
  url: '/users',
  component: 'Users',
  props: { search: 'John' },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
})
```

:::

All the parameters are optional. By default, all passed parameters (except `errorBag`) will be merged with the current page. This means you are responsible for overriding the current page's URL, component, and props.

If you need access to the current page's props you can pass a function to the props option. This function will receive the current page's props as an argument and should return the new props.

The `errorBag` option allows you to specify which error bag to use when handling validation errors in the `onError` callback.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.push({ url: '/users', component: 'Users' })
router.replace({
  props: (currentProps) => ({ ...currentProps, search: 'John' }),
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.push({ url: '/users', component: 'Users' })
router.replace({
  props: (currentProps) => ({ ...currentProps, search: 'John' }),
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.push({ url: '/users', component: 'Users' })
router.replace({
  props: (currentProps) => ({ ...currentProps, search: 'John' }),
})
```

:::

> \[!NOTE]
> Make sure that any route you push on the client side is also defined on the server side. If the user refreshes the page, the server will need to know how to render the page.

## State preservation

By default, page visits to the same page create a fresh page component instance. This causes any local state, such as form inputs, scroll positions, and focus states to be lost.

However, in some situations, it's necessary to preserve the page component state. For example, when submitting a form, you need to preserve your form data in the event that form validation fails on the server.

For this reason, the `post`, `put`, `patch`, `delete`, and `reload` methods all set the `preserveState` option to `true` by default.

You can instruct Inertia to preserve the component's state when using the `get` method by setting the `preserveState` option to `true`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { preserveState: true })
```

\== React

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { preserveState: true })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { preserveState: true })
```

:::

You can also lazily evaluate the `preserveState` option based on the response by providing a callback to the `preserveState` option.

If you'd like to only preserve state if the response includes validation errors, set the `preserveState` option to `"errors"`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

\== React

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { preserveState: 'errors' })
```

:::

You can also lazily evaluate the `preserveState` option based on the response by providing a callback.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  preserveState: (page) => page.props.someProp === 'value',
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  preserveState: (page) => page.props.someProp === 'value',
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  preserveState: (page) => page.props.someProp === 'value',
})
```

:::

## Scroll preservation

When navigating between pages, Inertia mimics default browser behavior by automatically resetting the scroll position of the document body (as well as any [scroll regions](/guide/scroll-management.md#scroll-regions) you've defined) back to the top of the page.

You can disable this behaviour by setting the `preserveScroll` option to `false`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: false })
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: false })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: false })
```

:::

If you'd like to only preserve the scroll position if the response includes validation errors, set the `preserveScroll` option to `"errors"`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: 'errors' })
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: 'errors' })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: 'errors' })
```

:::

You can also lazily evaluate the `preserveScroll` option based on the response by providing a callback.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

:::

For more information regarding this feature, please consult the [scroll management](/guide/scroll-management.md) documentation.

## Partial reloads

The `only` option allows you to request a subset of the props (data) from the server on subsequent visits to the same page, thus making your application more efficient since it does not need to retrieve data that the page is not interested in refreshing.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

\== React

```js
import { router } from '@inertiajs/react'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.get('/users', { search: 'John' }, { only: ['users'] })
```

:::

For more information on this feature, please consult the [partial reloads](/guide/partial-reloads.md) documentation.

## Visit cancellation

You can cancel a visit using a cancel token, which Inertia automatically generates and provides via the `onCancelToken()` callback prior to making the visit.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Cancel the visit...
this.cancelToken.cancel()
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Cancel the visit...
this.cancelToken.cancel()
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
})

// Cancel the visit...
this.cancelToken.cancel()
```

:::

The `onCancel()` and `onFinish()` event callbacks will be executed when a visit is cancelled.

## Event callbacks

In addition to Inertia's [global events](/guide/events.md), Inertia also provides a number of per-visit event callbacks.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
})
```

:::

Returning `false` from the `onBefore()` callback will cause the visit to be cancelled.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.delete(`/users/${user.id}`, {
  onBefore: () => confirm('Are you sure you want to delete this user?'),
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.delete(`/users/${user.id}`, {
  onBefore: () => confirm('Are you sure you want to delete this user?'),
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.delete(`/users/${user.id}`, {
  onBefore: () => confirm('Are you sure you want to delete this user?'),
})
```

:::

It's also possible to return a promise from the `onSuccess()` and `onError()` callbacks. When doing so, the "finish" event will be delayed until the promise has resolved.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post(url, {
  onSuccess: () => {
    return Promise.all([this.doThing(), this.doAnotherThing()])
  },
  onFinish: (visit) => {
    // This won't be called until doThing()
    // and doAnotherThing() have finished.
  },
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post(url, {
  onSuccess: () => {
    return Promise.all([this.doThing(), this.doAnotherThing()])
  },
  onFinish: (visit) => {
    // This won't be called until doThing()
    // and doAnotherThing() have finished.
  },
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post(url, {
  onSuccess: () => {
    return Promise.all([this.doThing(), this.doAnotherThing()])
  },
  onFinish: (visit) => {
    // This won't be called until doThing()
    // and doAnotherThing() have finished.
  },
})
```

:::

---

---
url: /guide/merging-props.md
---
# Merging props

By default, Inertia overwrites props with the same name when reloading a page. However, there are instances, such as pagination or infinite scrolling, where that is not the desired behavior. In these cases, you can merge props instead of overwriting them.

## Server side

### Using `merge`

@available\_since rails=3.8.0 core=2.0.8

To specify that a prop should be merged, use the `merge` method on the prop's value. This is ideal for merging simple arrays.

On the client side, Inertia detects that this prop should be merged. If the prop returns an array, it will append the response to the current prop value. If it's an object, it will merge the response with the current prop value.

```ruby
class UsersController < ApplicationController
  include Pagy::Backend

  def index
    _pagy, records = pagy(User.all)

    render inertia: {
      # simple array:
      users: InertiaRails.merge { records.as_json(...) },
      # with match_on parameter for smart merging:
      products: InertiaRails.merge(match_on: 'id') { Product.all.as_json(...) },
    }
  end
end
```

### Using `deep_merge`

@available\_since rails=3.8.0 core=2.0.8

For handling nested objects that include arrays or complex structures, such as pagination objects, use the `deep_merge` method.

```ruby
class UsersController < ApplicationController
  include Pagy::Backend

  def index
    pagy, records = pagy(User.all)

    render inertia: {
      # pagination object:
      data: InertiaRails.deep_merge {
        {
          records: records.as_json(...),
          pagy: pagy_metadata(pagy)
        }
      },
      # nested objects with match_on:
      categories: InertiaRails.deep_merge(match_on: %w[items.id tags.id]) {
        {
          items: Category.all.as_json(...),
          tags: Tag.all.as_json(...)
        }
      }
    }
  end
end
```

If you have opted to use `deep_merge`, Inertia ensures a deep merge of the entire structure, including nested objects and arrays.

### Smart merging with `match_on`

@available\_since rails=master core=2.0.13

By default, arrays are simply appended during merging. If you need to update specific items in an array or replace them based on a unique identifier, you can use the `match_on` parameter.

The `match_on` parameter enables smart merging by specifying a field to match on when merging arrays of objects:

* For `merge` with simple arrays, specify the object key to match on (e.g., `'id'`)
* For `deep_merge` with nested structures, use dot notation to specify the path (e.g., `'items.id'`)

You can also combine [deferred props](/guide/deferred-props) with mergeable props to defer the loading of the prop and ultimately mark it as mergeable once it's loaded.

```ruby
class UsersController < ApplicationController
  include Pagy::Backend

  def index
    pagy, records = pagy(User.all)

    render inertia: {
      # simple array:
      users: InertiaRails.defer(merge: true) { records.as_json(...) },
      # pagination object:
      data: InertiaRails.defer(deep_merge: true) {
        {
          records: records.as_json(...),
          pagy: pagy_metadata(pagy)
        }
      },
      # with match_on parameter:
      products: InertiaRails.defer(merge: true, match_on: 'id') { products.as_json(...) },
      # nested objects with match_on:
      categories: InertiaRails.defer(deep_merge: true, match_on: %w[items.id tags.id]) {
        {
          items: Category.all.as_json(...),
          tags: Tag.all.as_json(...)
        }
      }
    }
  end
end
```

## Resetting props

On the client side, you can indicate to the server that you would like to reset the prop. This is useful when you want to clear the prop value before merging new data, such as when the user enters a new search query on a paginated list.

The `reset` request option accepts an array of the props keys you would like to reset.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.reload({ reset: ['users'] })
```

\== React

```js
import { router } from '@inertiajs/react'

router.reload({ reset: ['users'] })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.reload({ reset: ['users'] })
```

:::

---

---
url: /guide/pages.md
---
# Pages

When building applications using Inertia, each page in your application typically has its own controller / route and a corresponding JavaScript component. This allows you to retrieve just the data necessary for that page - no API required.

In addition, all of the data needed for the page can be retrieved before the page is ever rendered by the browser, eliminating the need for displaying "loading" states when users visit your application.

## Creating pages

Inertia pages are simply JavaScript components. If you have ever written a Vue, React, or Svelte component, you will feel right at home. As you can see in the example below, pages receive data from your application's controllers as props.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import Layout from '../Layout'
import { Head } from '@inertiajs/vue3'

defineProps({ user: Object })
</script>

<template>
  <Layout>
    <Head title="Welcome" />
    <h1>Welcome</h1>
    <p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
  </Layout>
</template>
```

\== React

```jsx
import Layout from '../Layout'
import { Head } from '@inertiajs/react'

export default function Welcome({ user }) {
  return (
    <Layout>
      <Head title="Welcome" />
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Inertia app!</p>
    </Layout>
  )
}
```

\== Svelte 4

```svelte
<script>
  import Layout from '../Layout'

  export let user
</script>

<svelte:head>
  <title>Welcome</title>
</svelte:head>

<Layout>
  <h1>Welcome</h1>
  <p>Hello {user.name}, welcome to your first Inertia app!</p>
</Layout>
```

\== Svelte 5

```svelte
<script>
  import Layout from './Layout.svelte'

  let { user } = $props()
</script>

<svelte:head>
  <title>Welcome</title>
</svelte:head>

<Layout>
  <h1>Welcome</h1>
  <p>Hello {user.name}, welcome to your first Inertia app!</p>
</Layout>
```

:::

Given the page above, you can render the page by returning an Inertia response from a controller or route. In this example, let's assume this page is stored at `app/frontend/pages/User/Show.(jsx|vue|svelte)` within a Rails application.

```ruby
class UsersController < ApplicationController
  def show
    user = User.find(params[:id])

    render inertia: 'User/Show', props: { user: }
  end
end
```

See [the responses documentation](/guide/responses) for more information on how to return Inertia responses from your controllers.

## Creating layouts

While not required, for most projects it makes sense to create a site layout that all of your pages can extend. You may have noticed in our page example above that we're wrapping the page content within a `<Layout>` component. Here's an example of such a component:

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <main>
    <header>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </header>
    <article>
      <slot />
    </article>
  </main>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default function Layout({ children }) {
  return (
    <main>
      <header>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </header>
      <article>{children}</article>
    </main>
  )
}
```

\== Svelte 4

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<main>
  <header>
    <a use:inertia href="/">Home</a>
    <a use:inertia href="/about">About</a>
    <a use:inertia href="/contact">Contact</a>
  </header>
  <article>
    <slot />
  </article>
</main>
```

\== Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'

  let { children } = $props()
</script>

<main>
  <header>
    <a use:inertia href="/">Home</a>
    <a use:inertia href="/about">About</a>
    <a use:inertia href="/contact">Contact</a>
  </header>
  <article>
    {@render children()}
  </article>
</main>
```

:::

As you can see, there is nothing Inertia specific within this template. This is just a typical component.

## Persistent layouts

While it's simple to implement layouts as children of page components, it forces the layout instance to be destroyed and recreated between visits. This means you cannot have persistent layout state when navigating between pages.

For example, maybe you have an audio player on a podcast website that you want to continue playing as users navigate the site. Or, maybe you simply want to maintain the scroll position in your sidebar navigation between page visits. In these situations, the solution is to leverage Inertia's persistent layouts.

:::tabs key:frameworks
\== Vue

```vue
<script>
import Layout from '../Layout'

export default {
  // Using a render function...
  layout: (h, page) => h(Layout, [page]),

  // Using shorthand syntax...
  layout: Layout,
}
</script>

<script setup>
defineProps({ user: Object })
</script>

<template>
  <h1>Welcome</h1>
  <p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
</template>
```

\== React

```jsx
import Layout from '../Layout'

const Home = ({ user }) => {
  return (
    <>
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Inertia app!</p>
    </>
  )
}

Home.layout = (page) => <Layout children={page} title="Welcome" />

export default Home
```

\== Svelte 4

```svelte
<script context="module">
  export { default as layout } from './Layout.svelte'
</script>

<script>
  export let user
</script>

<h1>Welcome</h1>

<p>Hello {user.name}, welcome to your first Inertia app!</p>
```

\== Svelte 5

```svelte
<script module>
  export { default as layout } from './Layout.svelte'
</script>

<script>
  let { user } = $props()
</script>

<h1>Welcome</h1>

<p>Hello {user.name}, welcome to your first Inertia app!</p>
```

:::

You can also create more complex layout arrangements using nested layouts.

:::tabs key:frameworks
\== Vue

```vue
<script>
import SiteLayout from './SiteLayout'
import NestedLayout from './NestedLayout'

export default {
  // Using a render function...
  layout: (h, page) => {
    return h(SiteLayout, () => h(NestedLayout, () => page))
  },

  // Using the shorthand...
  layout: [SiteLayout, NestedLayout],
}
</script>

<script setup>
defineProps({ user: Object })
</script>

<template>
  <h1>Welcome</h1>
  <p>Hello {{ user.name }}, welcome to your first Inertia app!</p>
</template>
```

If you're using Vue 3.3+, you can alternatively use [`defineOptions`](https://vuejs.org/api/sfc-script-setup.html#defineoptions) to define a layout within `<script setup>`.
Older versions of Vue can use the [defineOptions plugin](https://vue-macros.sxzz.moe/macros/define-options.html).

```vue
<script setup>
import Layout from '../Layout'

defineOptions({ layout: Layout })
</script>
```

\== React

```jsx
import SiteLayout from './SiteLayout'
import NestedLayout from './NestedLayout'

const Home = ({ user }) => {
  return (
    <>
      <h1>Welcome</h1>
      <p>Hello {user.name}, welcome to your first Inertia app!</p>
    </>
  )
}

Home.layout = (page) => (
  <SiteLayout title="Welcome">
    <NestedLayout children={page} />
  </SiteLayout>
)

export default Home
```

\== Svelte 4

```svelte
<script context="module">
  import SiteLayout from './SiteLayout.svelte'
  import NestedLayout from './NestedLayout.svelte'

  // Using a render function...
  export const layout = (h, page) => {
    return h(SiteLayout, [h(NestedLayout, [page])])
  }

  // Using the shorthand...
  export const layout = [SiteLayout, NestedLayout]
</script>

<script>
  export let user
</script>

<h1>Welcome</h1>

<p>Hello {user.name}, welcome to your first Inertia app!</p>
```

\== Svelte 5

```svelte
<script module>
  import SiteLayout from './SiteLayout.svelte'
  import NestedLayout from './NestedLayout.svelte'
  // Using a render function...
  export const layout = (h, page) => {
    return h(SiteLayout, [h(NestedLayout, [page])])
  }
  // Using the shorthand...
  export const layout = [SiteLayout, NestedLayout]
</script>

<script>
  let { user } = $props()
</script>

<h1>Welcome</h1>

<p>Hello {user.name}, welcome to your first Inertia app!</p>
```

:::

## Default layouts

If you're using persistent layouts, you may find it convenient to define the default page layout in the `resolve()` callback of your application's main JavaScript file.

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    let page = pages[`../pages/${name}.vue`]
    page.default.layout = page.default.layout || Layout
    return page
  },
  // ...
})
```

\== React

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    let page = pages[`../pages/${name}.jsx`]
    page.default.layout =
      page.default.layout || ((page) => <Layout children={page} />)
    return page
  },
  // ...
})
```

\== Svelte 4|Svelte 5

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    let page = pages[`../pages/${name}.svelte`]
    return { default: page.default, layout: page.layout || Layout }
  },
  // ...
})
```

:::

This will automatically set the page layout to `Layout` if a layout has not already been set for that page.

You can even go a step further and conditionally set the default page layout based on the page `name`, which is available to the `resolve()` callback. For example, maybe you don't want the default layout to be applied to your public pages.

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    let page = pages[`../pages/${name}.vue`]
    page.default.layout = name.startsWith('Public/') ? undefined : Layout
    return page
  },
  // ...
})
```

\== React

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    let page = pages[`../pages/${name}.jsx`]
    page.default.layout = name.startsWith('Public/')
      ? undefined
      : (page) => <Layout children={page} />
    return page
  },
  // ...
})
```

\== Svelte 4|Svelte 5

```js
// frontend/entrypoints/inertia.js
import Layout from '../Layout'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    let page = pages[`../pages/${name}.svelte`]
    return {
      default: page.default,
      layout: name.startsWith('Public/') ? undefined : Layout,
    }
  },
  // ...
})
```

:::

---

---
url: /guide/partial-reloads.md
---
# Partial reloads

When making visits to the same page you are already on, it's not always necessary to re-fetch all of the page's data from the server. In fact, selecting only a subset of the data can be a helpful performance optimization if it's acceptable that some page data becomes stale. Inertia makes this possible via its "partial reload" feature.

As an example, consider a "user index" page that includes a list of users, as well as an option to filter the users by their company. On the first request to the page, both the `users` and `companies` props are passed to the page component. However, on subsequent visits to the same page (maybe to filter the users), you can request only the `users` data from the server without requesting the `companies` data. Inertia will then automatically merge the partial data returned from the server with the data it already has in memory client-side.

> \[!NOTE]
> Partial reloads only work for visits made to the same page component.

## Only certain props

To perform a partial reload, use the `only` visit option to specify which data the server should return. This option should be an array of keys which correspond to the keys of the props.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, {
  only: ['users'],
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.visit(url, {
  only: ['users'],
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, {
  only: ['users'],
})
```

:::

## Except certain props

In addition to the only visit option you can also use the except option to specify which data the server should exclude. This option should also be an array of keys which correspond to the keys of the props.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, {
  except: ['users'],
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.visit(url, {
  except: ['users'],
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, {
  except: ['users'],
})
```

:::

## Dot notation

Both the `only` and `except` visit options support dot notation to specify nested data, and they can be used together. In the following example, only `settings.theme` will be rendered, but without its `colors` property.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, {
  only: ['settings.theme'],
  except: ['setting.theme.colors'],
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.visit(url, {
  only: ['settings.theme'],
  except: ['setting.theme.colors'],
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, {
  only: ['settings.theme'],
  except: ['setting.theme.colors'],
})
```

:::

Please remember that, by design, partial reloading filters props *before* they are evaluated, so it can only target explicitly defined prop keys. Let's say you have this prop:

`users: -> { User.all }`

Requesting `only: ['users.name']` will exclude the entire `users` prop, since `users.name` is not available before evaluating the prop.

Requesting `except: ['users.name']` will not exclude anything.

## Router shorthand

Since partial reloads can only be made to the same page component the user is already on, it almost always makes sense to just use the `router.reload()` method, which automatically uses the current URL.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.reload({ only: ['users'] })
```

\== React

```js
import { router } from '@inertiajs/react'

router.reload({ only: ['users'] })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.reload({ only: ['users'] })
```

:::

## Using links

It's also possible to perform partial reloads with Inertia links using the `only` property.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users?active=true" :only="['users']">Show active</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users?active=true" only={['users']}>
    Show active
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/users?active=true" use:inertia={{ only: ['users'] }}>Show active</a>

<Link href="/users?active=true" only={['users']}>Show active</Link>
```

:::

## Lazy data evaluation

For partial reloads to be most effective, be sure to also use lazy data evaluation when returning props from your server-side routes or controllers. This can be accomplished by wrapping all optional page data in a lambda.

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: -> { User.all },
      companies: -> { Company.all },
    }
  end
end
```

When Inertia performs a request, it will determine which data is required and only then will it evaluate the closure. This can significantly increase the performance of pages that contain a lot of optional data.

Additionally, Inertia provides an `InertiaRails.optional` method to specify that a prop should never be included unless explicitly requested using the `only` option:

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: InertiaRails.optional { User.all },
    }
  end
end
```

> \[!NOTE]
> Prior to Inertia.js v2, the method `InertiaRails.lazy` was used. It is now deprecated and has been replaced by `InertiaRails.optional`. Please update your code accordingly to ensure compatibility with the latest version.

On the inverse, you can use the `InertiaRails.always` method to specify that a prop should always be included, even if it has not been explicitly required in a partial reload.

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: InertiaRails.always { User.all },
    }
  end
end
```

Here's a summary of each approach:

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      # ALWAYS included on standard visits
      # OPTIONALLY included on partial reloads
      # ALWAYS evaluated
      users: User.all,

      # ALWAYS included on standard visits
      # OPTIONALLY included on partial reloads
      # ONLY evaluated when needed
      users: -> { User.all },

      # NEVER included on standard visits
      # OPTIONALLY included on partial reloads
      # ONLY evaluated when needed
      users: InertiaRails.optional { User.all },

      # ALWAYS included on standard visits
      # ALWAYS included on partial reloads
      # ALWAYS evaluated
      users: InertiaRails.always { User.all },
    }
  end
end
```

---

---
url: /guide/polling.md
---
# Polling

## Poll helper

Polling your server for new information on the current page is common, so Inertia provides a poll helper designed to help reduce the amount of boilerplate code. In addition, the poll helper will automatically stop polling when the page is unmounted.

The only required argument is the polling interval in milliseconds.

:::tabs key:frameworks
\== Vue

```js
import { usePoll } from '@inertiajs/vue3'
usePoll(2000)
```

\== React

```js
import { usePoll } from '@inertiajs/react'
usePoll(2000)
```

\== Svelte 4|Svelte 5

```js
import { usePoll } from '@inertiajs/svelte'
usePoll(2000)
```

:::

If you need to pass additional request options to the poll helper, you can pass any of the `router.reload` options as the second parameter.

:::tabs key:frameworks
\== Vue

```js
import { usePoll } from '@inertiajs/vue3'

usePoll(2000, {
  onStart() {
    console.log('Polling request started')
  },
  onFinish() {
    console.log('Polling request finished')
  },
})
```

\== React

```js
import { usePoll } from '@inertiajs/react'

usePoll(2000, {
  onStart() {
    console.log('Polling request started')
  },
  onFinish() {
    console.log('Polling request finished')
  },
})
```

\== Svelte 4|Svelte 5

```js
import { usePoll } from '@inertiajs/svelte'

usePoll(2000, {
  onStart() {
    console.log('Polling request started')
  },
  onFinish() {
    console.log('Polling request finished')
  },
})
```

:::

If you'd like more control over the polling behavior, the poll helper provides `stop` and `start` methods that allow you to manually start and stop polling. You can pass the `autoStart: false` option to the poll helper to prevent it from automatically starting polling when the component is mounted.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { usePoll } from '@inertiajs/vue3'
const { start, stop } = usePoll(
  2000,
  {},
  {
    autoStart: false,
  },
)
</script>

<template>
  <button @click="start">Start polling</button>
  <button @click="stop">Stop polling</button>
</template>
```

\== React

```jsx
import { usePoll } from '@inertiajs/react'

export default () => {
  const { start, stop } = usePoll(
    2000,
    {},
    {
      autoStart: false,
    },
  )
  return (
    <div>
      <button onClick={start}>Start polling</button>
      <button onClick={stop}>Stop polling</button>
    </div>
  )
}
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { usePoll } from '@inertiajs/svelte'

  const { start, stop } = usePoll(
    2000,
    {},
    {
      autoStart: false,
    },
  )
</script>

<button on:click={start}>Start polling</button>
<button on:click={stop}>Stop polling</button>
```

:::

## Throttling

By default, the poll helper will throttle requests by 90% when the browser tab is in the background. If you'd like to disable this behavior, you can pass the `keepAlive` option to the poll helper.

:::tabs key:frameworks
\== Vue

```js
import { usePoll } from '@inertiajs/vue3'

usePoll(
  2000,
  {},
  {
    keepAlive: true,
  },
)
```

\== React

```js
import { usePoll } from '@inertiajs/react'

usePoll(
  2000,
  {},
  {
    keepAlive: true,
  },
)
```

\== Svelte 4|Svelte 5

```js
import { usePoll } from '@inertiajs/svelte'

usePoll(
  2000,
  {},
  {
    keepAlive: true,
  },
)
```

:::

---

---
url: /guide/prefetching.md
---
# Prefetching

Inertia supports prefetching data for pages that are likely to be visited next. This can be useful for improving the perceived performance of your app by allowing the data to be fetched in the background while the user is still interacting with the current page.

## Link prefetching

To prefetch data for a page, you can use the `prefetch` method on the Inertia link component. By default, Inertia will prefetch the data for the page when the user hovers over the link after more than 75ms.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch>Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users" prefetch>
    Users
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: true }}>Users</a>
```

:::

By default, data is cached for 30 seconds before being evicted. You can customize this behavior by passing a `cacheFor` prop to the `Link` component.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch cache-for="1m">Users</Link>
  <Link href="/users" prefetch cache-for="10s">Users</Link>
  <Link href="/users" prefetch :cache-for="5000">Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <>
    <Link href="/users" prefetch cacheFor="1m">
      Users
    </Link>
    <Link href="/users" prefetch cacheFor="10s">
      Users
    </Link>
    <Link href="/users" prefetch cacheFor={5000}>
      Users
    </Link>
  </>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: true, cacheFor: '1m' }}>Users</a>
<a href="/users" use:inertia={{ prefetch: true, cacheFor: '10s' }}>Users</a>
<a href="/users" use:inertia={{ prefetch: true, cacheFor: 5000 }}>Users</a>
```

:::

You can also start prefetching on `mousedown` by passing the `click` value to the `prefetch` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch="click">Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users" prefetch="click">
    Users
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: 'click' }}>Users</a>
```

:::

If you're confident that the user will visit a page next, you can prefetch the data on mount as well.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch="mount">Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users" prefetch="mount">
    Users
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: 'mount' }}>Users</a>
```

:::

You can also combine strategies by passing an array of values to the `prefetch` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" :prefetch="['mount', 'hover']">Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users" prefetch={['mount', 'hover']}>
    Users
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: ['mount', 'hover'] }}>Users</a>
```

:::

## Programmatic prefetching

You can also prefetch data programmatically using `router.prefetch`. The signature is identical to `router.visit` with the exception of a third argument that allows you to specify prefetch options.

When the `cacheFor` option is not specified, it defaults to 30 seconds.

```js
router.prefetch('/users', { method: 'get', data: { page: 2 } })

router.prefetch(
  '/users',
  { method: 'get', data: { page: 2 } },
  { cacheFor: '1m' },
)
```

Inertia also provides a `usePrefetch` hook that allows you to track the prefetch state for the current page. It returns information about whether the page is currently prefetching, has been prefetched, when it was last updated, and a `flush` method that flushes the cache for the current page only.

:::tabs key:frameworks
\== Vue

```js
import { usePrefetch } from '@inertiajs/vue3'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch()
```

\== React

```js
import { usePrefetch } from '@inertiajs/react'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch()
```

\== Svelte 4|Svelte 5

```js
import { usePrefetch } from '@inertiajs/svelte'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch()
```

:::

You can also pass visit options when you need to differentiate between different request configurations for the same URL.

:::tabs key:frameworks

\== Vue

```js
import { usePrefetch } from '@inertiajs/vue3'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch({
  headers: { 'X-Custom-Header': 'value' },
})
```

\== React

```js
import { usePrefetch } from '@inertiajs/react'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch({
  headers: { 'X-Custom-Header': 'value' },
})
```

\== Svelte 4|Svelte 5

```js
import { usePrefetch } from '@inertiajs/svelte'

const { lastUpdatedAt, isPrefetching, isPrefetched, flush } = usePrefetch({
  headers: { 'X-Custom-Header': 'value' },
})
```

:::

## Cache tags

@available\_since core=2.1.2

Cache tags allow you to group related prefetched data and invalidate it all at once when specific events occur.

To tag cached data, pass a `cacheTags` prop to your `Link` component.

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch cache-tags="users">Users</Link>
  <Link href="/dashboard" prefetch :cache-tags="['dashboard', 'stats']">
    Dashboard
  </Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

<Link href="/users" prefetch cacheTags="users">Users</Link>
<Link href="/dashboard" prefetch cacheTags={['dashboard', 'stats']}>Dashboard</Link>
```

\== Svelte 4 | Svelte 5

```svelte
import {inertia} from '@inertiajs/svelte'

<a href="/users" use:inertia={{ prefetch: true, cacheTags: 'users' }}>Users</a>
<a
  href="/dashboard"
  use:inertia={{ prefetch: true, cacheTags: ['dashboard', 'stats'] }}
  >Dashboard</a
>
```

:::

When prefetching programmatically, pass `cacheTags` in the third argument to `router.prefetch`.

```js
router.prefetch('/users', {}, { cacheTags: 'users' })
router.prefetch('/dashboard', {}, { cacheTags: ['dashboard', 'stats'] })
```

## Cache invalidation

You can manually flush the prefetch cache by calling `router.flushAll` to remove all cached data, or `router.flush` to remove cache for a specific page.

```js
// Flush all prefetch cache
router.flushAll()

// Flush cache for a specific page
router.flush('/users', { method: 'get', data: { page: 2 } })

// Using the usePrefetch hook
const { flush } = usePrefetch()

flush() // Flush cache for the current page
```

For more granular control, you can flush cached data by their tags using `router.flushByCacheTags`. This removes any cached response that contains *any* of the specified tags.

```js
// Flush all responses tagged with 'users'
router.flushByCacheTags('users')

// Flush all responses tagged with 'dashboard' OR 'stats'
router.flushByCacheTags(['dashboard', 'stats'])
```

### Invalidate on requests

@available\_since core=2.1.2

To automatically invalidate caches when making requests, pass an `invalidateCacheTags` prop to the Form component. The specified tags will be flushed when the form submission succeeds.

:::tabs key:frameworks

\== Vue

```vue
<script setup>
import { Form } from '@inertiajs/vue3'
</script>

<template>
  <Form
    action="/users"
    method="post"
    :invalidate-cache-tags="['users', 'dashboard']"
  >
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
  </Form>
</template>
```

\== React

```jsx
import { Form } from '@inertiajs/react'

export default () => (
  <Form
    action="/users"
    method="post"
    invalidateCacheTags={['users', 'dashboard']}
  >
    <input type="text" name="name" />
    <input type="email" name="email" />
    <button type="submit">Create User</button>
  </Form>
)
```

\== Svelte 4 | Svelte 5

```svelte
<script>
  import { Form } from '@inertiajs/svelte'
</script>

<Form
  action="/users"
  method="post"
  invalidateCacheTags={['users', 'dashboard']}
>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Create User</button>
</Form>
```

:::

With the `useForm` helper, you can include `invalidateCacheTags` in the visit options.

:::tabs key:frameworks

\== Vue

```vue
import { useForm } from '@inertiajs/vue3' const form = useForm({ name: '',
email: '', }) const submit = () => { form.post('/users', { invalidateCacheTags:
['users', 'dashboard'] }) }
```

\== React

```jsx
import { useForm } from '@inertiajs/react'

const { data, setData, post } = useForm({
  name: '',
  email: '',
})

function submit(e) {
  e.preventDefault()
  post('/users', {
    invalidateCacheTags: ['users', 'dashboard'],
  })
}
```

\== Svelte 4 | Svelte 5

```svelte
import { useForm } from '@inertiajs/svelte'

const form = useForm({
  name: '',
  email: '',
})

function submit() {
  $form.post('/users', {
    invalidateCacheTags: ['users', 'dashboard']
  })
}
```

:::

You can also invalidate cache tags with programmatic visits by including `invalidateCacheTags` in the options.

```js
router.delete(
  `/users/${userId}`,
  {},
  {
    invalidateCacheTags: ['users', 'dashboard'],
  },
)

router.post('/posts', postData, {
  invalidateCacheTags: ['posts', 'recent-posts'],
})
```

## Stale while revalidate

By default, Inertia will fetch a fresh copy of the data when the user visits the page if the cached data is older than the cache duration. You can customize this behavior by passing a tuple to the `cacheFor` prop.

The first value in the array represents the number of seconds the cache is considered fresh, while the second value defines how long it can be served as stale data before fetching data from the server is necessary.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/users" prefetch :cacheFor="['30s', '1m']">Users</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/users" prefetch cacheFor={['30s', '1m']}>
    Users
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia } from '@inertiajs/svelte'
</script>

<a href="/users" use:inertia={{ prefetch: true, cacheFor: ['30s', '1m'] }}>
  Users
</a>
```

:::

### How it works

If a request is made within the fresh period (before the first value), the cache is returned immediately without making a request to the server.

If a request is made during the stale period (between the two values), the stale value is served to the user, and a request is made in the background to refresh the cached value. Once the value is returned, the data is merged into the page so the user has the most recent data.

If a request is made after the second value, the cache is considered expired, and the value is fetched from the sever as a regular request.

---

---
url: /guide/progress-indicators.md
---
# Progress indicators

Since Inertia requests are made via XHR, there would typically not be a browser loading indicator when navigating from one page to another. To solve this, Inertia displays a progress indicator at the top of the page whenever you make an Inertia visit. However, [asynchronous requests](#visit-options) do not show the progress indicator unless explicitly configured.

Of course, if you prefer, you can disable Inertia's default loading indicator and provide your own custom implementation. We'll discuss both approaches below.

## Default

Inertia's default progress indicator is a light-weight wrapper around the [NProgress](https://ricostacruz.com/nprogress/) library. You can customize it via the `progress` property of the `createInertiaApp()` function.

```js
createInertiaApp({
  progress: {
    // The delay after which the progress bar will appear, in milliseconds...
    delay: 250,

    // The color of the progress bar...
    color: '#29d',

    // Whether to include the default NProgress styles...
    includeCSS: true,

    // Whether the NProgress spinner will be shown...
    showSpinner: false,
  },
  // ...
})
```

You can disable Inertia's default loading indicator by setting the `progress` property to `false`.

```js
createInertiaApp({
  progress: false,
  // ...
})
```

## Custom

It's also possible to setup your own custom page loading indicators using [Inertia events](/guide/events.md). Let's explore how to do this using the [NProgress](https://ricostacruz.com/nprogress/) library as an example.

First, disable Inertia's default loading indicator.

```js
createInertiaApp({
  progress: false,
  // ...
})
```

Next, install the NProgress library.

```shell
npm install nprogress
```

After installation, you'll need to add the [NProgress styles](https://github.com/rstacruz/nprogress/blob/master/nprogress.css) to your project. You can do this using a CDN hosted copy of the styles.

```html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
/>
```

Next, import both `NProgress` and the Inertia `router` into your application.

:::tabs key:frameworks
\== Vue

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/vue3'
```

\== React

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'
```

\== Svelte 4|Svelte 5

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/svelte'
```

:::

Next, let's add a `start` event listener. We'll use this listener to show the progress bar when a new Inertia visit begins.

```js
router.on('start', () => NProgress.start())
```

Then, let's add a `finish` event listener to hide the progress bar when the page visit finishes.

```js
router.on('finish', () => NProgress.done())
```

That's it! Now, as you navigate from one page to another, the progress bar will be added and removed from the page.

### Handling cancelled visits

While this custom progress implementation works great for page visits that finish properly, it would be nice to handle cancelled visits as well. First, for interrupted visits (those that get cancelled as a result of a new visit), the progress bar should simply be reset back to the start position. Second, for manually cancelled visits, the progress bar should be immediately removed from the page.

We can accomplish this by inspecting the `event.detail.visit` object that's provided to the finish event.

```js
router.on('finish', (event) => {
  if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})
```

### File upload progress

Let's take this a step further. When files are being uploaded, it would be great to update the loading indicator to reflect the upload progress. This can be done using the `progress` event.

```js
router.on('progress', (event) => {
  if (event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})
```

Now, instead of the progress bar "trickling" while the files are being uploaded, it will actually update it's position based on the progress of the request. We limit the progress here to 90%, since we still need to wait for a response from the server.

### Loading indicator delay

The last thing we're going to implement is a loading indicator delay. It's often preferable to delay showing the loading indicator until a request has taken longer than 250-500 milliseconds. This prevents the loading indicator from appearing constantly on quick page visits, which can be visually distracting.

To implement the delay behavior, we'll use the `setTimeout` and `clearTimeout` functions. Let's start by defining a variable to keep track of the timeout.

```js
let timeout = null
```

Next, let's update the `start` event listener to start a new timeout that will show the progress bar after 250 milliseconds.

```js
router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})
```

Next, we'll update the `finish` event listener to clear any existing timeouts in the event that the page visit finishes before the timeout does.

```js
router.on('finish', (event) => {
  clearTimeout(timeout)
  // ...
})
```

In the `finish` event listener, we need to determine if the progress bar has actually started displaying progress, otherwise we'll inadvertently cause it to show before the timeout has finished.

```js
router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  }
  // ...
})
```

And, finally, we need to do the same check in the `progress` event listener.

```js
router.on('progress', event => {
  if (!NProgress.isStarted()) {
    return
  }
  // ...
}
```

That's it, you now have a beautiful custom page loading indicator!

### Complete example

For convenience, here is the full source code of the final version of our custom loading indicator.

:::tabs key:frameworks
\== Vue

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/vue3'

let timeout = null

router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})

router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})
```

\== React

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/react'

let timeout = null

router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})

router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})
```

\== Svelte 4|Svelte 5

```js
import NProgress from 'nprogress'
import { router } from '@inertiajs/svelte'

let timeout = null

router.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})

router.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})

router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})
```

:::

## Visit Options

In addition to these configurations, Inertia.js provides two visit options to control the loading indicator on a per-request basis: `showProgress` and `async`. These options offer greater control over how Inertia.js handles asynchronous requests and manages progress indicators.

### `showProgress`

The `showProgress` option provides fine-grained control over the visibility of the loading indicator during requests.

```js
router.get('/settings', {}, { showProgress: false })
```

### `async`

The `async` option allows you to perform asynchronous requests without displaying the default progress indicator. It can be used in combination with the `showProgress` option.

```js
// Disable the progress indicator
router.get('/settings', {}, { async: true })
// Enable the progress indicator with async requests
router.get('/settings', {}, { async: true, showProgress: true })
```

---

---
url: /guide/redirects.md
---
# Redirects

When making a non-GET Inertia request manually or via a `<Link>` element, you should ensure that you always respond with a proper Inertia redirect response.

For example, if your controller is creating a new user, your "create" endpoint should return a redirect back to a standard `GET` endpoint, such as your user "index" page. Inertia will automatically follow this redirect and update the page accordingly.

```ruby
class UsersController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      redirect_to users_url
    else
      redirect_to new_user_url, inertia: { errors: user.errors }
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
```

## 303 response code

When redirecting after a `PUT`, `PATCH`, or `DELETE` request, you must use a `303` response code, otherwise the subsequent request will not be treated as a `GET` request. A `303` redirect is very similar to a `302` redirect; however, the follow-up request is explicitly changed to a `GET` request.

If you're using one of our official server-side adapters, all redirects will automatically be converted to `303` redirects.

## External redirects

Sometimes it's necessary to redirect to an external website, or even another non-Inertia endpoint in your app while handling an Inertia request. This can be accomplished using a server-side initiated `window.location` visit via the `inertia_location` method.

```ruby
inertia_location index_path
```

The `inertia_location` method will generate a `409 Conflict` response and include the destination URL in the `X-Inertia-Location` header. When this response is received client-side, Inertia will automatically perform a `window.location = url` visit.

---

---
url: /guide/remembering-state.md
---
# Remembering state

When navigating browser history, Inertia restores pages using prop data cached in history state. However, Inertia does not restore local page component state since this is beyond its reach. This can lead to outdated pages in your browser history.

For example, if a user partially completes a form, then navigates away, and then returns back, the form will be reset and their work will be lost.

To mitigate this issue, you can tell Inertia which local component state to save in the browser history.

## Saving local state

To save local component state to the history state, use the "useRemember" hook to tell Inertia which data it should remember.

:::tabs key:frameworks
\== Vue

```js
import { useRemember } from '@inertiajs/vue3'

const form = useRemember({
  first_name: null,
  last_name: null,
})
```

\== React

```js
import { useRemember } from '@inertiajs/react'

export default function Profile() {
  const [formState, setFormState] = useRemember({
    first_name: null,
    last_name: null,
    // ...
  })

  // ...
}
```

\== Svelte 4|Svelte 5

```js
import { useRemember } from '@inertiajs/svelte'

const form = useRemember({
  first_name: null,
  last_name: null,
})

// ...
```

:::

Now, whenever your local `form` state changes, Inertia will automatically save this data to the history state and will also restore it on history navigation.

## Multiple components

If your page contains multiple components that use the remember functionality provided by Inertia, you need to provide a unique key for each component so that Inertia knows which data to restore to each component.

:::tabs key:frameworks
\== Vue

```js
import { useRemember } from '@inertiajs/vue3'

const form = useRemember(
  {
    first_name: null,
    last_name: null,
  },
  'Users/Create',
)
```

\== React

```js
import { useRemember } from '@inertiajs/react'

export default function Profile() {
  const [formState, setFormState] = useRemember(
    {
      first_name: null,
      last_name: null,
    },
    'Users/Create',
  )
}
```

\== Svelte 4|Svelte 5

```js
import { page, useRemember } from '@inertiajs/svelte'

let form = useRemember(
  {
    first_name: null,
    last_name: null,
  },
  'Users/Create',
)
```

:::

If you have multiple instances of the same component on the page using the remember functionality, be sure to also include a unique key for each component instance, such as a model identifier.

:::tabs key:frameworks
\== Vue

```js
import { useRemember } from '@inertiajs/vue3'

const props = defineProps({ user: Object })

const form = useRemember(
  {
    first_name: null,
    last_name: null,
  },
  `Users/Edit:${props.user.id}`,
)
```

\== React

```js
import { useRemember } from '@inertiajs/react'

export default function Profile() {
  const [formState, setFormState] = useRemember(
    {
      first_name: props.user.first_name,
      last_name: props.user.last_name,
    },
    `Users/Edit:${this.user.id}`,
  )
}
```

\== Svelte 4|Svelte 5

```js
import { page, useRemember } from '@inertiajs/svelte'

let form = useRemember(
  {
    first_name: $page.props.user.first_name,
    last_name: $page.props.user.last_name,
  },
  `Users/Edit:${$page.props.user.id}`,
)
```

:::

## Form helper

If you're using the Inertia [form helper](/guide/forms.md#form-helper), you can pass a unique form key as the first argument when instantiating your form. This will cause the form data and errors to automatically be remembered.

:::tabs key:frameworks
\== Vue

```js
import { useForm } from '@inertiajs/vue3'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${props.user.id}`, data)
```

\== React

```js
import { useForm } from '@inertiajs/react'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`, data)
```

\== Svelte 4|Svelte 5

```js
import { useForm } from '@inertiajs/svelte'

const form = useForm('CreateUser', data)
const form = useForm(`EditUser:${user.id}`, data)
```

:::

## Manually saving state

The `useRemember` hook watches for data changes and automatically saves them to the history state. When navigating back to the page, Inertia will restore this data.

However, it's also possible to manage this manually using the underlying `remember()` and `restore()` methods in Inertia.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

// Save local component state to history state...
router.remember(data, 'my-key')

// Restore local component state from history state...
let data = router.restore('my-key')
```

\== React

```js
import { router } from '@inertiajs/react'

// Save local component state to history state...
router.remember(data, 'my-key')

// Restore local component state from history state...
let data = router.restore('my-key')
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

// Save local component state to history state...
router.remember(data, 'my-key')

// Restore local component state from history state...
let data = router.restore('my-key')
```

:::

---

---
url: /guide/responses.md
---
# Responses

## Creating responses

Creating an Inertia response is simple. To get started, just use the `inertia` renderer in your controller methods, providing both the name of the [JavaScript page component](/guide/pages.md) that you wish to render, as well as any props (data) for the page.

```ruby
class EventsController < ApplicationController
  def show
    event = Event.find(params[:id])

    render inertia: 'Event/Show', props: {
      event: event.as_json(
        only: [:id, :title, :start_date, :description]
      )
    }
  end
end
```

Within Rails applications, the `Event/Show` page would typically correspond to the file located at `app/frontend/pages/Event/Show.(jsx|vue|svelte)`.

> \[!WARNING]
> To ensure that pages load quickly, only return the minimum data required for the page. Also, be aware that **all data returned from the controllers will be visible client-side**, so be sure to omit sensitive information.

### Automatically determine component name

You can pass props without specifying a component name:

```ruby
class UsersController < ApplicationController
  def show
    render inertia: { user: @user } # Will render '../users/show.jsx|vue|svelte'
  end
end
```

If the default component path doesn't match your convention, you can define a custom resolution method via the `component_path_resolver` config value. The value should be callable and will receive the path and action parameters, returning a string component path.

```ruby
inertia_config(
  component_path_resolver: ->(path:, action:) do
    "Storefront/#{path.camelize}/#{action.camelize}"
  end
)
```

### Using instance variables as props

Inertia enables the automatic passing of instance variables as props. This can be achieved by invoking the `use_inertia_instance_props` function in a controller or in a base controller from which other controllers inherit.

```ruby
class EventsController < ApplicationController
  use_inertia_instance_props

  def index
    @events = Event.all

    render inertia: 'Events/Index'
  end
end
```

This action automatically passes the `@events` instance variable as the `events` prop to the `Events/Index` page component.

> \[!NOTE]
> Manually providing any props for a response disables the instance props feature for that specific response.

> \[!NOTE]
> Instance props are only included if they are defined **after** the `use_inertia_instance_props` call, hence the order of `before_action` callbacks is crucial.

## Root template data

There are situations where you may want to access your prop data in your ERB template. For example, you may want to add a meta description tag, Twitter card meta tags, or Facebook Open Graph meta tags. You can access this data via the `page` method.

```erb
# app/views/inertia.html.erb

<% content_for(:head) do %>
<meta name="twitter:title" content="<%= page["props"]["event"].title %>">
<% end %>

<div id="app" data-page="<%= page.to_json %>"></div>
```

Sometimes you may even want to provide data to the root template that will not be sent to your JavaScript page / component. This can be accomplished by passing the `view_data` option.

```ruby
def show
  event = Event.find(params[:id])

  render inertia: 'Event', props: { event: }, view_data: { meta: event.meta }
end
```

You can then access this variable like a regular local variable.

```erb
# app/views/inertia.html.erb

<% content_for(:head) do %>
<meta
  name="description"
  content="<%= local_assigns.fetch(:meta, "Default description") %>">
<% end %>

<div id="app" data-page="<%= page.to_json %>"></div>
```

## Rails generators

Inertia Rails provides a number of generators to help you get started with Inertia in your Rails application. You can generate controllers or use scaffolds to create a new resource with Inertia responses.

### Scaffold generator

Use the `inertia:scaffold` generator to create a resource with Inertia responses. Execute the following command in the terminal:

```bash
bin/rails generate inertia:scaffold ModelName field1:type field2:type
```

Example output:

```bash
$ bin/rails generate inertia:scaffold Post title:string body:text
      invoke  active_record
      create    db/migrate/20240611123952_create_posts.rb
      create    app/models/post.rb
      invoke    test_unit
      create      test/models/post_test.rb
      create      test/fixtures/posts.yml
      invoke  resource_route
       route    resources :posts
      invoke  scaffold_controller
      create    app/controllers/posts_controller.rb
      invoke    inertia_templates
      create      app/frontend/pages/Post
      create      app/frontend/pages/Post/Index.svelte
      create      app/frontend/pages/Post/Edit.svelte
      create      app/frontend/pages/Post/Show.svelte
      create      app/frontend/pages/Post/New.svelte
      create      app/frontend/pages/Post/Form.svelte
      create      app/frontend/pages/Post/Post.svelte
      invoke    resource_route
      invoke    test_unit
      create      test/controllers/posts_controller_test.rb
      create      test/system/posts_test.rb
      invoke    helper
      create      app/helpers/posts_helper.rb
      invoke      test_unit
```

#### Tailwind CSS integration

Inertia Rails tries to detect the presence of Tailwind CSS in the application and generate the templates accordingly. If you want to specify templates type, use the `--inertia-templates` option:

* `inertia_templates` - default
* `inertia_tw_templates` - Tailwind CSS

### Controller generator

Use the `inertia:controller` generator to create a controller with an Inertia response. Execute the following command in the terminal:

```bash
bin/rails generate inertia:controller ControllerName action1 action2
```

Example output:

```bash
$ bin/rails generate inertia:controller pages welcome next_steps
      create  app/controllers/pages_controller.rb
       route  get 'pages/welcome'
              get 'pages/next_steps'
      invoke  test_unit
      create    test/controllers/pages_controller_test.rb
      invoke  helper
      create    app/helpers/pages_helper.rb
      invoke    test_unit
      invoke  inertia_templates
      create    app/frontend/pages/Pages
      create    app/frontend/pages/Pages/Welcome.jsx
      create    app/frontend/pages/Pages/NextSteps.jsx
```

### Customizing the generator templates

Rails generators allow templates customization. You can create custom template files in your application to override the default templates used by the generators. For example, to customize the controller generator view template for React, create a file at the path `lib/templates/inertia_templates/controller/react/view.jsx.tt`:

```jsx
export default function <%= @action.camelize %>() {
  return (
    <h1>Hello from my new default template</h1>
  );
}
```

You can find the default templates in the gem's source code:

* [Default controller generator templates](https://github.com/inertiajs/inertia-rails/tree/master/lib/generators/inertia_templates/controller/templates)
* [Default scaffold generator templates](https://github.com/inertiajs/inertia-rails/tree/master/lib/generators/inertia_templates/scaffold/templates)
* [Tailwind controller generator templates](https://github.com/inertiajs/inertia-rails/tree/master/lib/generators/inertia_tw_templates/controller/templates)
* [Tailwind scaffold generator templates](https://github.com/inertiajs/inertia-rails/tree/master/lib/generators/inertia_tw_templates/scaffold/templates)

> \[!TIP]
> You can also replace the whole generator with your own implementation. See the [Rails documentation](https://guides.rubyonrails.org/generators.html#overriding-rails-generators) for more information.

## Maximum response size

To enable client-side history navigation, all Inertia server responses are stored in the browser's history state. However, keep in mind that some browsers impose a size limit on how much data can be saved within the history state.

For example, [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) has a size limit of 16 MiB and throws a `NS_ERROR_ILLEGAL_VALUE` error if you exceed this limit. Typically, this is much more data than you'll ever practically need when building applications.

## Detecting Inertia Requests

Controllers can determine if a request was made via Inertia:

```ruby
def some_action
  if request.inertia?
  # This is an Inertia request
  end

  if request.inertia_partial?
  # This is a partial Inertia request
  end
end
```

## Inertia responses and `respond_to`

Inertia responses always operate as a `:html` response type. This means that you can use the `respond_to` method to handle JSON requests differently, while still returning Inertia responses:

```ruby
def some_action
  respond_to do |format|
    format.html do
      render inertia: 'Some/Component', props: { data: 'value' }
    end

    format.json do
      render json: { message: 'This is a JSON response' }
    end
  end
end
```

---

---
url: /guide/routing.md
---
# Routing

## Defining routes

When using Inertia, all of your application's routes are defined server-side. This means that you don't need Vue Router or React Router. Instead, you can simply define Rails routes and return Inertia responses from those routes.

## Shorthand routes

If you have a page that doesn't need a corresponding controller method, like an "FAQ" or "about" page, you can route directly to a component via the `inertia` method.

```ruby
# In config/routes.rb
Rails.application.routes.draw do
  # Basic usage - maps 'dashboard' URL to 'Dashboard' component
  inertia 'dashboard' => 'Dashboard'

  # Using a symbol - infers component name from route
  inertia :settings

  # Within namespaces and scopes
  namespace :admin do
    inertia 'dashboard' => 'Admin/Dashboard'
  end

  # Within resource definitions
  resources :users do
    inertia :activity, on: :member
    inertia :statistics, on: :collection
  end
end
```

## Generating URLs

Some server-side frameworks allow you to generate URLs from named routes. However, you will not have access to those helpers client-side. Here are a couple ways to still use named routes with Inertia.

The first option is to generate URLs server-side and include them as props. Notice in this example how we're passing the `edit_url` and `create_url` to the `Users/Index` component.

```ruby
class UsersController < ApplicationController
  def index
    render inertia: 'Users/Index', props: {
      users: User.all.map do |user|
        user.as_json(
          only: [ :id, :name, :email ]
        ).merge(
          edit_url: edit_user_path(user)
        )
      end,
      create_url: new_user_path
    }
  end
end
```

Another option is to use [JsRoutes](https://github.com/railsware/js-routes) or [JS From Routes](https://js-from-routes.netlify.app) gems that make named server-side routes available on the client via autogenerated helpers.

---

---
url: /guide/scroll-management.md
---
# Scroll management

## Scroll resetting

When navigating between pages, Inertia mimics default browser behavior by automatically resetting the scroll position of the document body (as well as any [scroll regions](#scroll-regions) you've defined) back to the top.

In addition, Inertia keeps track of the scroll position of each page and automatically restores that scroll position as you navigate forward and back in history.

## Scroll preservation

Sometimes it's desirable to prevent the default scroll resetting when making visits. You can disable this behaviour by setting the `preserveScroll` option to `false`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: false })
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: false })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: false })
```

:::

If you'd like to only preserve the scroll position if the response includes validation errors, set the `preserveScroll` option to `"errors"`.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.visit(url, { preserveScroll: 'errors' })
```

\== React

```js
import { router } from '@inertiajs/react'

router.visit(url, { preserveScroll: 'errors' })
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.visit(url, { preserveScroll: 'errors' })
```

:::

You can also lazily evaluate the `preserveScroll` option based on the response by providing a callback.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

\== React

```js
import { router } from '@inertiajs/react'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/users', data, {
  preserveScroll: (page) => page.props.someProp === 'value',
})
```

:::

When using an [Inertia link](/guide/links), you can preserve the scroll position using the `preserveScroll` prop.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
  <Link href="/" preserve-scroll>Home</Link>
</template>
```

\== React

```jsx
import { Link } from '@inertiajs/react'

export default () => (
  <Link href="/" preserveScroll>
    Home
  </Link>
)
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { inertia, Link } from '@inertiajs/svelte'
</script>

<a href="/" use:inertia={{ preserveScroll: true }}>Home</a>

<Link href="/" preserveScroll>Home</Link>
```

:::

## Scroll regions

If your app doesn't use document body scrolling, but instead has scrollable elements (using the `overflow` CSS property), scroll resetting will not work.

In these situations, you must tell Inertia which scrollable elements to manage by adding the `scroll-region` attribute to the element.

```html
<div class="overflow-y-auto" scroll-region="">
  <!-- Your page content -->
</div>
```

---

---
url: /cookbook/server-managed-meta-tags.md
---
# Server Managed Meta Tags

Inertia Rails can manage a page's meta tags on the server instead of on the frontend. This means that link previews (such as on Facebook, LinkedIn, etc.) will include correct meta *without server-side rendering*.

Inertia Rails renders server defined meta tags into both the server rendered HTML and the client-side Inertia page props. Because the tags share unique `head-key` attributes, the client will "take over" the meta tags after the initial page load.

@available\_since rails=3.10.0

## Setup

### Server Side

Simply add the `inertia_meta_tags` helper to your layout. This will render the meta tags in the `<head>` section of your HTML.

```erb
<!-- app/views/layouts/application.html.erb (or your custom layout) -->

<!DOCTYPE html>
<html>
  <head>
    ...
    <%= inertia_meta_tags %> <!-- Add this inside your <head> tag --> // [!code ++]
    <title inertia>My Inertia App</title> <!-- Remove existing title --> // [!code --]
  </head>
</html>
```

> \[!NOTE]
> Make sure to remove the `<title>` tag in your Rails layout if you plan to manage it with Inertia Rails. Otherwise you will end up with duplicate `<title>` tags.

### Client Side

Copy the following code into your application. It should be rendered **once** in your application, such as in a [layout component
](/guide/pages#creating-layouts).

:::tabs key:frameworks
\== Vue

```vue
<script>
import { Head } from '@inertiajs/vue3'
import { usePage } from '@inertiajs/vue3'
import { h } from 'vue'

export default {
  name: 'MetaTags',
  setup() {
    const page = usePage()

    return () => {
      const metaTags = page.props._inertia_meta || []

      return h(Head, {}, () =>
        metaTags.map((meta) => {
          const { tagName, innerContent, headKey, httpEquiv, ...attrs } = meta

          const attributes = {
            key: headKey,
            'head-key': headKey,
            ...attrs,
          }

          if (httpEquiv) {
            attributes['http-equiv'] = httpEquiv
          }

          let content = null
          if (innerContent != null) {
            content =
              typeof innerContent === 'string'
                ? innerContent
                : JSON.stringify(innerContent)
          }

          return h(tagName, attributes, content)
        }),
      )
    }
  },
}
</script>
```

\== React

```jsx
import React from 'react'
import { Head, usePage } from '@inertiajs/react'

const MetaTags = () => {
  const { _inertia_meta: meta } = usePage().props
  return (
    <Head>
      {meta.map((meta) => {
        const { tagName, innerContent, headKey, httpEquiv, ...attrs } = meta

        let stringifiedInnerContent
        if (innerContent != null) {
          stringifiedInnerContent =
            typeof innerContent === 'string'
              ? innerContent
              : JSON.stringify(innerContent)
        }

        return React.createElement(tagName, {
          key: headKey,
          'head-key': headKey,
          ...(httpEquiv ? { 'http-equiv': httpEquiv } : {}),
          ...attrs,
          ...(stringifiedInnerContent
            ? { dangerouslySetInnerHTML: { __html: stringifiedInnerContent } }
            : {}),
        })
      })}
    </Head>
  )
}

export default MetaTags
```

\== Svelte 4|Svelte 5

```svelte
<!-- MetaTags.svelte -->
<script>
  import { onMount } from 'svelte'
  import { page } from '@inertiajs/svelte'

  $: metaTags = ($page.props._inertia_meta ?? []).map(
    ({ tagName, headKey, innerContent, httpEquiv, ...attrs }) => ({
      tagName,
      headKey,
      innerContent,
      attrs: httpEquiv ? { ...attrs, 'http-equiv': httpEquiv } : attrs,
    }),
  )

  // Svelte throws warnings if we render void elements like meta with content
  $: voidTags = metaTags.filter((tag) => tag.innerContent == null)
  $: contentTags = metaTags.filter((tag) => tag.innerContent != null)

  let ready = false

  onMount(() => {
    // Clean up server-rendered tags
    document.head.querySelectorAll('[inertia]').forEach((el) => el.remove())

    ready = true
  })
</script>

<svelte:head>
  {#if ready}
    <!-- Void elements (no content) -->
    {#each voidTags as tag (tag.headKey)}
      <svelte:element this={tag.tagName} inertia={tag.headKey} {...tag.attrs} />
    {/each}

    <!-- Elements with content -->
    {#each contentTags as tag (tag.headKey)}
      <svelte:element this={tag.tagName} inertia={tag.headKey} {...tag.attrs}>
        {@html typeof tag.innerContent === 'string'
          ? tag.innerContent
          : JSON.stringify(tag.innerContent)}
      </svelte:element>
    {/each}
  {/if}
</svelte:head>
```

:::

## Rendering Meta Tags

Tags are defined as plain hashes and conform to the following structure:

```ruby
# All fields are optional.
{
  # Defaults to "meta" if not provided
  tag_name: "meta",

  # Used for <meta http-equiv="...">
  http_equiv: "Content-Security-Policy",

  # Used to deduplicate tags. InertiaRails will auto-generate one if not provided
  head_key: "csp-header",

  # Used with <script>, <title>, etc.
  inner_content: "Some content",

  # Any additional attributes will be passed directly to the tag.
  # For example: name: "description", content: "Page description"
  name: "description",
  content: "A description of the page"
}
```

The `<title>` tag has shortcut syntax:

```ruby
{ title: "The page title" }
```

### In the renderer

Add meta tags to an action by passing an array of hashes to the `meta:` option in the `render` method:

```ruby
class EventsController < ApplicationController
  def show
    event = Event.find(params[:id])

    render inertia: 'Event/Show', props: { event: event.as_json }, meta: [
      { title: "Check out the #{event.name} event!" },
      { name: 'description', content: event.description },
      { tag_name: 'script', type: 'application/ld+json', inner_content: { '@context': 'https://schema.org', '@type': 'Event', name: 'My Event' } }
    ]
  end
end
```

### Shared Meta Tags

Often, you will want to define default meta tags that are shared across certain pages and which you can override within a specific controller or action. Inertia Rails has an `inertia_meta` controller instance method which references a store of meta tag data.

You can call it anywhere in a controller to manage common meta tags, such as in `before_action` callbacks or directly in an action.

```ruby
class EventsController < ApplicationController
  before_action :set_meta_tags

  def show
    render inertia: 'Event/Show', props: { event: Event.find(params[:id]) }
  end

  private

  def set_meta_tags
    inertia_meta.add([
      { title: 'Look at this event!' }
    ])
  end
end
```

#### The `inertia_meta` API

The `inertia_meta` method provides a simple API to manage your meta tags. You can add, remove, or clear tags as needed. The `inertia_meta.remove` method accepts either a `head_key` string or a block to filter tags.

```ruby
# Add a single tag
inertia_meta.add({ title: 'Some Page title' })

# Add multiple tags at once
inertia_meta.add([
  { tag_name: 'meta', name: 'og:description', content: 'A description of the page' },
  { tag_name: 'meta', name: 'twitter:title', content: 'A title for Twitter' },
  { tag_name: 'title', inner_content: 'A title for the page', head_key: 'my_custom_head_key' },
  { tag_name: 'script', type: 'application/ld+json', inner_content: { '@context': 'https://schema.org', '@type': 'Event', name: 'My Event' } }
])

# Remove a specific tag by head_key
inertia_meta.remove("my_custom_head_key")

# Remove tags by a condition
inertia_meta.remove do |tag|
  tag[:tag_name] == 'script' && tag[:type] == 'application/ld+json'
end

# Remove all tags
inertia_meta.clear
```

#### JSON-LD and Script Tags

Inertia Rails supports defining `<script>` tags with `type="application/ld+json"` for structured data. All other script tags will be marked as `type="text/plain"` to prevent them from executing on the client side. Executable scripts should be added either in the Rails layout or using standard techniques in your frontend framework.

```ruby
inertia_meta.add({
  tag_name: "script",
  type: "application/ld+json",
  inner_content: {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "My Event",
    startDate: "2023-10-01T10:00:00Z",
    location: {
      "@type": "Place",
      name: "Event Venue",
      address: "123 Main St, City, Country"
    }
  }
})
```

## Deduplication

> \[!NOTE]
> The Svelte adapter does not have a `<Head />` component. Inertia Rails will deduplicate meta tags *on the server*, and the Svelte component above will render them deduplicated accordingly.

### Automatic Head Keys

Inertia Rails relies on the `head-key` attribute and the `<Head />` components that the Inertia.js core uses to [manage meta tags](/guide/title-and-meta) and deduplicate them. Inertia.js core expects us to manage `head-key` attributes and deduplication manually, but Inertia Rails will generate them automatically for you.

* `<meta>` tags will use the `name`,`property`, or `http_equiv` attributes to generate a head key. This enables automatic deduplication of common meta tags like `description`, `og:title`, and `twitter:card`.
* All other tags will deterministically generate a `head-key` based on the tag's attributes.

#### Allowing Duplicates

Sometimes, it is valid HTML to have multiple meta tags with the same name or property. If you want to allow duplicates, you can set the `allow_duplicates` option to `true` when defining the tag.

```ruby
class StoriesController < ApplicationController
  before_action do
    inertia_meta.add({ name: 'article:author', content: 'Tony Gilroy' })
  end

  # Renders a single article:author meta tag
  def single_author
    render inertia: 'Stories/Show'
  end

  # Renders multiple article:author meta tags
  def multiple_authors
    render inertia: 'Stories/Show', meta: [
      { name: 'article:author', content: 'Dan Gilroy', allow_duplicates: true },
    ]
  end
end
```

### Manual Head Keys

Automatic head keys should cover the majority of use cases, but you can set `head_key` manually if you need to control the deduplication behavior more precisely. For example, you may want to do this if you know you will remove a shared meta tag in a specific action.

```ruby
# In a concern or `before_action` callback
inertia_meta.add([
  {
    tag_name: 'meta',
    name: 'description',
    content: 'A description of the page',
    head_key: 'my_custom_head_key'
  },
])

# Later in a specific action
inertia_meta.remove('my_custom_head_key')
```

## Combining Meta Tag Methods

There are multiple ways to manage meta tags in Inertia Rails:

* Adding tags to a Rails layout such as `application.html.erb`.
* Using the `<Head />` component from Inertia.js (or the Svelte head element) in the frontend.
* Using the server driven meta tags feature described here.

Nothing prevents you from using these together, but for organizational purposes, we recommended using only one of the last two techniques.

---

---
url: /guide/server-side-rendering.md
---
# Server-side Rendering (SSR)

Server-side rendering pre-renders your JavaScript pages on the server, allowing your visitors to receive fully rendered HTML when they visit your application. Since fully rendered HTML is served by your application, it's also easier for search engines to index your site.

> \[!NOTE]
> Server-side rendering uses Node.js to render your pages in a background process; therefore, Node must be available on your server for server-side rendering to function properly.

> \[!NOTE]
> For Vue `< 3.2.13` you will need to install `@vue/server-renderer` as a dependency, and use it instead of `vue/server-renderer`.

## Add server entry-point

Next, we'll create a `app/frontend/ssr/ssr.js` file within the Rails project that will serve as the SSR entry point.

This file is going to look very similar to your regular inertia initialization file, except it's not going to run in the browser, but rather in Node.js. Here's a complete example.

:::tabs key:frameworks
\== Vue

```js
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from 'vue/server-renderer'
import { createSSRApp, h } from 'vue'

createServer((page) =>
  createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
      return pages[`../pages/${name}.vue`]
    },
    setup({ App, props, plugin }) {
      return createSSRApp({
        render: () => h(App, props),
      }).use(plugin)
    },
  }),
)
```

\== React

```js
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
      return pages[`../pages/${name}.jsx`]
    },
    setup: ({ App, props }) => <App {...props} />,
  }),
)
```

\== Svelte 4

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'

createServer((page) =>
  createInertiaApp({
    page,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
      return pages[`../pages/${name}.svelte`]
    },
    setup({ App, props }) {
      return App.render(props)
    },
  }),
)
```

\== Svelte 5

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'
import { render } from 'svelte/server'

createServer((page) =>
  createInertiaApp({
    page,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
      return pages[`../pages/${name}.svelte`]
    },
    setup({ App, props }) {
      return render(App, { props })
    },
  }),
)
```

:::

When creating this file, be sure to add anything that's missing from your regular initialization file that makes sense to run in SSR mode, such as plugins or custom mixins.

## Clustering

> Requires `@inertiajs/core` v2.0.7 or higher.

By default, the SSR server will run on a single thread. Clustering starts multiple Node servers on the same port, requests are then handled by each thread in a round-robin way.

You can enable clustering by passing a second argument to `createServer`:

:::tabs key:frameworks
\== Vue

```js
import { createInertiaApp } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from 'vue/server-renderer'
import { createSSRApp, h } from 'vue'

createServer(
  (page) =>
    createInertiaApp({
      // ...
    }),
  { cluster: true },
)
```

\== React

```js
import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

createServer(
  (page) =>
    createInertiaApp({
      // ...
    }),
  { cluster: true },
)
```

\== Svelte 4

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'

createServer(
  (page) =>
    createInertiaApp({
      // ...
    }),
  { cluster: true },
)
```

\== Svelte 5

```js
import { createInertiaApp } from '@inertiajs/svelte'
import createServer from '@inertiajs/svelte/server'
import { render } from 'svelte/server'

createServer(
  (page) =>
    createInertiaApp({
      // ...
    }),
  { cluster: true },
)
```

:::

## Setup Vite Ruby

Next, we need to update our Vite configuration to build our new `ssr.js` file. We can do this by adding a `ssrBuildEnabled` property to Ruby Vite plugin configuration in the `config/vite.json` file.

```json
  "production": {
    "ssrBuildEnabled": true // [!code ++]
  }
```

> \[!NOTE]
> For more available properties see the [Ruby Vite documentation](https://vite-ruby.netlify.app/config/#ssr-options-experimental).

## Enable SSR in the Inertia's Rails adapter

```ruby
InertiaRails.configure do |config|
  config.ssr_enabled = ViteRuby.config.ssr_build_enabled
end
```

Now you can build your server-side bundle.

```shell
bin/vite build --ssr
```

## Running the SSR server

Now that you have built both your client-side and server-side bundles, you should be able run the Node-based Inertia SSR server using the following command.

```shell
bin/vite ssr
```

With the server running, you should be able to access your app within the browser with server-side rendering enabled. In fact, you should be able to disable JavaScript entirely and still navigate around your application.

## Client side hydration

Since your website is now being server-side rendered, you can instruct your client to "hydrate" the static markup and make it interactive instead of re-rendering all the HTML that we just generated.

To enable client-side hydration, update your initialization file:

:::tabs key:frameworks
\== Vue

```js
// frontend/entrypoints/inertia.js
import { createApp, h } from 'vue' // [!code --]
import { createSSRApp, h } from 'vue' // [!code ++]
import { createInertiaApp } from '@inertiajs/vue3'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    return pages[`../pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) }) // [!code --]
    createSSRApp({ render: () => h(App, props) }) // [!code ++]
      .use(plugin)
      .mount(el)
  },
})
```

\== React

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client' // [!code --]
import { hydrateRoot } from 'react-dom/client' // [!code ++]

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.jsx', { eager: true })
    return pages[`../pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />) // [!code --]
    hydrateRoot(el, <App {...props} />) // [!code ++]
  },
})
```

\== Svelte 4

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
    return pages[`../pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    new App({ target: el, props }) // [!code --]
    new App({ target: el, props, hydrate: true }) // [!code ++]
  },
})
```

You will also need to set the `hydratable` compiler option to `true` in your `vite.config.js` file:

```js
// vite.config.js
import { svelte } from '@sveltejs/vite-plugin-svelte'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    laravel.default({
      input: ['resources/css/app.css', 'resources/js/app.js'],
      ssr: 'resources/js/ssr.js',
      refresh: true,
    }),
    svelte(), // [!code --]
    svelte({ // [!code ++]
      // [!code ++]
      compilerOptions: { // [!code ++]
        // [!code ++]
        hydratable: true, // [!code ++]
      }, // [!code ++]
    }), // [!code ++]
  ],
})
```

\== Svelte 5

```js
// frontend/entrypoints/inertia.js
import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte' // [!code --]
import { hydrate, mount } from 'svelte' // [!code ++]

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[`./Pages/${name}.svelte`]
  },
  setup({ el, App, props }) {
    mount(App, { target: el, props }) // [!code --]
    if (el.dataset.serverRendered === 'true') { // [!code ++]
      hydrate(App, { target: el, props }) // [!code ++]
    } else { // [!code ++]
      mount(App, { target: el, props }) // [!code ++]
    } // [!code ++]
  },
})
```

:::

## Deployment

When deploying your SSR enabled app to production, you'll need to build both the client-side (`application.js`) and server-side bundles (`ssr.js`), and then run the SSR server as a background process.

---

---
url: /guide/server-side-setup.md
---
# Server-side setup

The first step when installing Inertia is to configure your server-side framework. Inertia maintains official server-side adapters for [Laravel](https://laravel.com) and [Ruby on Rails](https://rubyonrails.org). For other frameworks, please see the [community adapters](https://inertiajs.com/community-adapters).

> \[!NOTE]
> For the official Laravel adapter instructions, please see the [official documentation](https://inertiajs.com/server-side-setup).

## Install dependencies

First, install the Inertia server-side adapter gem and add to the application's Gemfile by executing:

```bash
bundle add inertia_rails
```

## Rails generator

If you plan to use Vite as your frontend build tool, you can use the built-in generator to install and set up Inertia in a Rails application. It automatically detects if the [Vite Rails](https://vite-ruby.netlify.app/guide/rails.html) gem is installed and will attempt to install it if not present.

To install and setup Inertia in a Rails application, execute the following command in the terminal:

```bash
bin/rails generate inertia:install
```

This command will:

* Check for Vite Rails and install it if not present
* Ask if you want to use TypeScript
* Ask you to choose your preferred frontend framework (React, Vue, Svelte 4, or Svelte 5)
* Ask if you want to install Tailwind CSS
* Install necessary dependencies
* Set up the application to work with Inertia
* Copy example Inertia controller and views (can be skipped with the `--skip-example` option)

> \[!NOTE]
> To use TypeScript with Svelte, you need to install `@inertiajs/svelte` version `1.3.0-beta.2` or higher. You can use the `--inertia-version` option to specify the version.

Example output:

```bash
$ bin/rails generate inertia:install
Installing Inertia's Rails adapter
Could not find a package.json file to install Inertia to.
Would you like to install Vite Ruby? (y/n) y
         run  bundle add vite_rails from "."
Vite Rails gem successfully installed
         run  bundle exec vite install from "."
Vite Rails successfully installed
Would you like to use TypeScript? (y/n) y
Adding TypeScript support
What framework do you want to use with Inertia? [react, vue, svelte4, svelte] (react)
         run  npm add @types/react @types/react-dom typescript --silent from "."
Would you like to install Tailwind CSS? (y/n) y
Installing Tailwind CSS
         run  npm add tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography @tailwindcss/container-queries --silent from "."
      create  tailwind.config.js
      create  postcss.config.js
      create  app/frontend/entrypoints/application.css
Adding Tailwind CSS to the application layout
      insert  app/views/layouts/application.html.erb
Adding Inertia's Rails adapter initializer
      create  config/initializers/inertia_rails.rb
Installing Inertia npm packages
         run  npm add @vitejs/plugin-react react react-dom --silent from "."
         run  npm add @inertiajs/react@latest --silent from "."
Adding Vite plugin for react
      insert  vite.config.ts
     prepend  vite.config.ts
Copying inertia.ts entrypoint
      create  app/frontend/entrypoints/inertia.ts
Adding inertia.ts script tag to the application layout
      insert  app/views/layouts/application.html.erb
Adding Vite React Refresh tag to the application layout
      insert  app/views/layouts/application.html.erb
        gsub  app/views/layouts/application.html.erb
Copying example Inertia controller
      create  app/controllers/inertia_example_controller.rb
Adding a route for the example Inertia controller
       route  get 'inertia-example', to: 'inertia_example#index'
Copying page assets
      create  app/frontend/pages/InertiaExample.module.css
      create  app/frontend/assets/react.svg
      create  app/frontend/assets/inertia.svg
      create  app/frontend/assets/vite_ruby.svg
      create  app/frontend/pages/InertiaExample.tsx
      create  tsconfig.json
      create  tsconfig.app.json
      create  tsconfig.node.json
      create  app/frontend/vite-env.d.ts
Copying bin/dev
      create  bin/dev
Inertia's Rails adapter successfully installed
```

With that done, you can now start the Rails server and the Vite development server (we recommend using [Overmind](https://github.com/DarthSim/overmind)):

```bash
bin/dev
```

And navigate to `http://localhost:3100/inertia-example` to see the example Inertia page.

That's it! You're all set up to start using Inertia in your Rails application. Check the guide on [creating pages](/guide/pages) to know more.

## Root template

If you decide not to use the generator, you can manually set up Inertia in your Rails application.

First, setup the root template that will be loaded on the first page visit. This will be used to load your site assets (CSS and JavaScript), and will also contain a root `<div>` to boot your JavaScript application in.

:::tabs key:builders
\== Vite

```erb
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csp_meta_tag %>

    <%= inertia_ssr_head %>

    <%# If you want to use React add `vite_react_refresh_tag` %>
    <%= vite_client_tag %>
    <%= vite_javascript_tag 'application' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

\== Webpacker/Shakapacker

```erb
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csp_meta_tag %>

    <%= inertia_ssr_head %>

    <%= stylesheet_pack_tag 'application' %>
    <%= javascript_pack_tag 'application', defer: true %>
  </head>
  <body>
    <%= yield %>
  </body>
</html>
```

:::

This template should include your assets, as well as the `yield` method to render the Inertia page. The `inertia_ssr_head` method is used to include the Inertia headers in the response, it's required when [SSR](/guide/server-side-rendering.md) is enabled.

Inertia's adapter will use standard Rails layout inheritance, with `view/layouts/application.html.erb` as a default layout. If you would like to use a different default layout, you can change it using the `InertiaRails.configure`.

```ruby
# config/initializers/inertia_rails.rb
InertiaRails.configure do |config|
  config.layout = 'my_inertia_layout'
end
```

# Creating responses

That's it, you're all ready to go server-side! Once you setup the [client-side](/guide/client-side-setup.md) framework, you can start start creating Inertia [pages](/guide/pages.md) and rendering them via [responses](/guide/responses.md).

```ruby
class EventsController < ApplicationController
  def show
    event = Event.find(params[:id])

    render inertia: 'Event/Show', props: {
      event: event.as_json(
        only: [:id, :title, :start_date, :description]
      )
    }
  end
end
```

---

---
url: /guide/shared-data.md
---
# Shared data

Sometimes you need to access specific pieces of data on numerous pages within your application. For example, you may need to display the current user in the site header. Passing this data manually in each response across your entire application is cumbersome. Thankfully, there is a better option: shared data.

## Sharing data

The `inertia_share` method allows you to define data that will be available to all controller actions, automatically merging with page-specific props.

### Basic Usage

```ruby
class EventsController < ApplicationController
  # Static sharing: Data is evaluated immediately
  inertia_share app_name: Rails.configuration.app_name

  # Dynamic sharing: Data is evaluated at render time
  inertia_share do
    {
      user: current_user,
      notifications: current_user&.unread_notifications_count
    } if user_signed_in?
  end

  # Alternative syntax for single dynamic values
  inertia_share total_users: -> { User.count }
end
```

### Inheritance and Shared Data

Shared data defined in parent controllers is automatically inherited by child controllers. Child controllers can also override or add to the shared data:

```ruby
# Parent controller
  class ApplicationController < ActionController::Base
  inertia_share app_name: 'My App', version: '1.0'
end

# Child controller
class UsersController < ApplicationController
  # Inherits app_name and version, adds/overrides auth
  inertia_share auth: -> { { user: current_user } }
end
```

### Conditional Sharing

You can control when data is shared using Rails-style controller filters. The `inertia_share` method supports these filter options:

* `only`: Share data for specific actions
* `except`: Share data for all actions except specified ones
* `if`: Share data when condition is true
* `unless`: Share data when condition is false

```ruby
class EventsController < ApplicationController
  # Share user data only when authenticated
  inertia_share if: :user_signed_in? do
    {
      user: {
        name: current_user.name,
        email: current_user.email,
        role: current_user.role
      }
    }
  end

  # Share data only for specific actions
  inertia_share only: [:index, :show] do
    {
      meta: {
        last_updated: Time.current,
        version: "1.0"
      }
    }
  end
end
```

> \[!NOTE]
> Shared data should be used sparingly as all shared data is included with every response.

> \[!NOTE]
> Page props and shared data are merged together, so be sure to namespace your shared data appropriately to avoid collisions.

## Accessing shared data

Once you have shared the data server-side, you will be able to access it within any of your pages or components. Here's an example of how to access shared data in a layout component.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

const page = usePage()

const user = computed(() => page.props.auth.user)
</script>

<template>
  <main>
    <header>You are logged in as: {{ user.name }}</header>
    <article>
      <slot />
    </article>
  </main>
</template>
```

\== React

```jsx
import { usePage } from '@inertiajs/react'

export default function Layout({ children }) {
  const { auth } = usePage().props

  return (
    <main>
      <header>You are logged in as: {auth.user.name}</header>
      <article>{children}</article>
    </main>
  )
}
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { page } from '@inertiajs/svelte'
</script>

<main>
  <header>
    You are logged in as: {$page.props.auth.user.name}
  </header>
  <article>
    <slot />
  </article>
</main>
```

:::

# Flash messages

Another great use-case for shared data is flash messages. These are messages stored in the session only for the next request. For example, it's common to set a flash message after completing a task and before redirecting to a different page.

Here's a simple way to implement flash messages in your Inertia applications. First, share the flash message on each request.

```ruby
class ApplicationController < ActionController::Base
  inertia_share flash: -> { flash.to_hash }
end
```

Next, display the flash message in a frontend component, such as the site layout.

:::tabs key:frameworks
\== Vue

```vue
<template>
  <main>
    <header></header>
    <article>
      <div v-if="$page.props.flash.alert" class="alert">
        {{ $page.props.flash.alert }}
      </div>
      <div v-if="$page.props.flash.notice" class="notice">
        {{ $page.props.flash.notice }}
      </div>
      <slot />
    </article>
    <footer></footer>
  </main>
</template>
```

\== React

```jsx
import { usePage } from '@inertiajs/react'

export default function Layout({ children }) {
  const { flash } = usePage().props

  return (
    <main>
      <header></header>
      <article>
        {flash.alert && <div className="alert">{flash.alert}</div>}
        {flash.notice && <div className="notice">{flash.notice}</div>}
        {children}
      </article>
      <footer></footer>
    </main>
  )
}
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { page } from '@inertiajs/svelte'
</script>

<main>
  <header></header>
  <article>
    {#if $page.props.flash.alert}
      <div class="alert">{$page.props.flash.alert}</div>
    {/if}
    {#if $page.props.flash.notice}
      <div class="notice">{$page.props.flash.notice}</div>
    {/if}
    <slot />
  </article>
  <footer></footer>
</main>
```

:::

## Deep Merging Shared Data

By default, Inertia will shallow merge data defined in an action with the shared data. You might want a deep merge. Imagine using shared data to represent defaults you'll override sometimes.

```ruby
class ApplicationController
  inertia_share do
    { basketball_data: { points: 50, rebounds: 100 } }
  end
end
```

Let's say we want a particular action to change only part of that data structure. The renderer accepts a `deep_merge` option:

```ruby
class CrazyScorersController < ApplicationController
  def index
    render inertia: 'CrazyScorersComponent',
      props: { basketball_data: { points: 100 } },
      deep_merge: true
  end
end

# The renderer will send this to the frontend:
{
  basketball_data: {
    points: 100,
    rebounds: 100,
  }
}
```

Deep merging can be set as the project wide default via the `InertiaRails` configuration:

```ruby
# config/initializers/some_initializer.rb
InertiaRails.configure do |config|
  config.deep_merge_shared_data = true
end

```

If deep merging is enabled by default, it's possible to opt out within the action:

```ruby
class CrazyScorersController < ApplicationController
  inertia_share do
    {
      basketball_data: {
        points: 50,
        rebounds: 10,
      }
    }
  end

  def index
    render inertia: 'CrazyScorersComponent',
      props: { basketball_data: { points: 100 } },
      deep_merge: false
  end
end

# Even if deep merging is set by default, since the renderer has `deep_merge: false`, it will send a shallow merge to the frontend:
{
  basketball_data: {
    points: 100,
  }
}
```

---

---
url: /guide/testing.md
---
# Testing

There are many different ways to test an Inertia.js app. This page provides a quick overview of the tools available.

## End-to-end tests

One popular approach to testing your JavaScript page components, is to use an end-to-end testing tool like [Capybara](https://github.com/teamcapybara/capybara) or [Cypress](https://www.cypress.io). These are browser automation tools that allow you to run real simulations of your app in the browser. These tests are known to be slower, and sometimes brittle, but since they test your application at the same layer as your end users, they can provide a lot of confidence that your app is working correctly. And, since these tests are run in the browser your JavaScript code is actually executed and tested as well.

## Client-side unit tests

Another approach to testing your page components is using a client-side unit testing framework, such as [Vitest](https://vitest.dev), [Jest](https://jestjs.io) or [Mocha](https://mochajs.org). This approach allows you to test your JavaScript page components in isolation using Node.js.

## Endpoint tests

In addition to testing your JavaScript page components, you'll also want to test the Inertia responses that come back from your server-side framework. A popular approach to doing this is using endpoint tests, where you make requests to your application and examine the responses.

If you're using RSpec, Inertia Rails comes with some nice test helpers to make things simple.

To use these helpers, just add the following require statement to your `spec/rails_helper.rb`

```ruby
require 'inertia_rails/rspec'
```

And in any test you want to use the inertia helpers, add the `:inertia` flag to the block.

```ruby
# spec/requests/events_spec.rb
RSpec.describe "/events", inertia: true do
  describe '#index' do
    # ...
  end
end
```

### Assertions

Inertia Rails provides several RSpec matchers for testing Inertia responses. You can use methods like `expect_inertia`, `render_component`, `have_exact_props`, `include_props`, `have_exact_view_data`, and `include_view_data` to test your Inertia responses.

```ruby
# spec/requests/events_spec.rb
RSpec.describe '/events', inertia: true do
  describe '#index' do
    let!(:event) { Event.create!(title: 'Foo', start_date: '2024-02-21', description: 'Foo bar') }

    it "renders inertia component" do
      get events_path

      # check the component
      expect(inertia).to render_component 'Event/Index'
      # or
      expect_inertia.to render_component 'Event/Index'
      # same as above
      expect(inertia.component).to eq 'Event/Index'

      # props (including shared props)
      expect(inertia).to have_exact_props({title: 'Foo', description: 'Foo bar'})
      expect(inertia).to include_props({title: 'Foo'})

      # access props
      expect(inertia.props[:title]).to eq 'Foo'

      # view data
      expect(inertia).to have_exact_view_data({meta: 'Foo bar'})
      expect(inertia).to include_view_data({meta: 'Foo bar'})

      # access view data
      expect(inertia.view_data[:meta]).to eq 'Foo bar'
    end
  end
end
```

---

---
url: /guide/the-protocol.md
---
# The protocol

This page contains a detailed specification of the Inertia protocol. Be sure to read the [how it works](/guide/how-it-works.md) page first for a high-level overview.

## HTML responses

The very first request to an Inertia app is just a regular, full-page browser request, with no special Inertia headers or data. For these requests, the server returns a full HTML document.

This HTML response includes the site assets (CSS, JavaScript) as well as a root `<div>` in the page's body. The root `<div>` serves as a mounting point for the client-side app, and includes a `data-page` attribute with a JSON encoded [page object] for the initial page. Inertia uses this information to boot your client-side framework and display the initial page component.

```http
REQUEST
GET: http://example.com/events/80
Accept: text/html, application/xhtml+xml


RESPONSE
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<html>
<head>
    <title>My app</title>
    <link href="/css/app.css" rel="stylesheet">
    <script src="/js/app.js" defer></script>
</head>
<body>

<div id="app" data-page='{"component":"Event","props":{"errors":{},"event":{"id":80,"title":"Birthday party","start_date":"2019-06-02","description":"Come out and celebrate Jonathan&apos;s 36th birthday party!"}},"url":"/events/80","version":"6b16b94d7c51cbe5b1fa42aac98241d5"}'></div>

</body>
</html>
```

> \[!NOTE]
> While the initial response is HTML, Inertia does not server-side render the JavaScript page components by default (see [Server-side Rendering](/guide/server-side-rendering)).

## Inertia responses

Once the Inertia app has been booted, all subsequent requests to the site are made via XHR with a `X-Inertia` header set to `true`. This header indicates that the request is being made by Inertia and isn't a standard full-page visit.

When the server detects the `X-Inertia` header, instead of responding with a full HTML document, it returns a JSON response with an encoded [page object].

```http
REQUEST
GET: http://example.com/events/80
Accept: text/html, application/xhtml+xml
X-Requested-With: XMLHttpRequest
X-Inertia: true
X-Inertia-Version: 6b16b94d7c51cbe5b1fa42aac98241d5

RESPONSE
HTTP/1.1 200 OK
Content-Type: application/json
Vary: X-Inertia
X-Inertia: true

{
  "component": "Event",
  "props": {
    "errors": {},
    "event": {
      "id": 80,
      "title": "Birthday party",
      "start_date": "2019-06-02",
      "description": "Come out and celebrate Jonathan's 36th birthday party!"
    }
  },
  "url": "/events/80",
  "version": "6b16b94d7c51cbe5b1fa42aac98241d5",
  "encryptHistory": true,
  "clearHistory": false
}
```

## The page object

Inertia shares data between the server and client via a page object. This object includes the necessary information required to render the page component, update the browser's history state, and track the site's asset version. The page object includes the following four properties:

1. `component`: The name of the JavaScript page component.
2. `props`: The page props. Contains all of the page data along with an `errors` object (defaults to `{}` if there are no errors).
3. `url`: The page URL.
4. `version`: The current asset version.
5. `encryptHistory`: Whether or not to encrypt the current page's history state.
6. `clearHistory`: Whether or not to clear any encrypted history state.

On standard full page visits, the page object is JSON encoded into the `data-page` attribute in the root `<div>`. On Inertia visits, the page object is returned as the JSON payload.

## Asset versioning

One common challenge with single-page apps is refreshing site assets when they've been changed. Inertia makes this easy by optionally tracking the current version of the site's assets. In the event that an asset changes, Inertia will automatically make a full-page visit instead of an XHR visit.

The Inertia [page object] includes a `version` identifier. This version identifier is set server-side and can be a number, string, file hash, or any other value that represents the current "version" of your site's assets, as long as the value changes when the site's assets have been updated.

Whenever an Inertia request is made, Inertia will include the current asset version in the `X-Inertia-Version` header. When the server receives the request, it compares the asset version provided in the `X-Inertia-Version` header with the current asset version. This is typically handled in the middleware layer of your server-side framework.

If the asset versions are the same, the request simply continues as expected. However, if the asset versions are different, the server immediately returns a `409 Conflict` response, and includes the URL in a `X-Inertia-Location` header. This header is necessary, since server-side redirects may have occurred. This tells Inertia what the final intended destination URL is.

Note, `409 Conflict` responses are only sent for `GET` requests, and not for `POST/PUT/PATCH/DELETE` requests. That said, they will be sent in the event that a `GET` redirect occurs after one of these requests.

If "flash" session data exists when a `409 Conflict` response occurs, Inertia's server-side framework adapters will automatically reflash this data.

```http
REQUEST
GET: http://example.com/events/80
Accept: text/html, application/xhtml+xml
X-Requested-With: XMLHttpRequest
X-Inertia: true
X-Inertia-Version: 6b16b94d7c51cbe5b1fa42aac98241d5

RESPONSE
409: Conflict
X-Inertia-Location: http://example.com/events/80
```

You can read more about this on the [asset versioning](/guide/asset-versioning) page.

## Partial reloads

When making Inertia requests, the partial reload option allows you to request a subset of the props (data) from the server on subsequent visits to the same page component. This can be a helpful performance optimization if it's acceptable that some page data becomes stale.

When a partial reload request is made, Inertia includes the `X-Inertia-Partial-Component` header and may include `X-Inertia-Partial-Data` and/or `X-Inertia-Partial-Except` headers with the request.

The `X-Inertia-Partial-Data` header is a comma separated list of the desired props (data) keys that should be returned.

The `X-Inertia-Partial-Except` header is a comma separated list of the props (data) keys that should not be returned. When only the `X-Inertia-Partial-Except` header is included, all props (data) except those listed will be sent. If both `X-Inertia-Partial-Data` and `X-Inertia-Partial-Except` headers are included, the `X-Inertia-Partial-Except` header will take precedence.

The `X-Inertia-Partial-Component` header includes the name of the component that is being partially reloaded. This is necessary, since partial reloads only work for requests made to the same page component. If the final destination is different for some reason (e.g. the user was logged out and is now on the login page), then no partial reloading will occur.

```http
REQUEST
GET: http://example.com/events
Accept: text/html, application/xhtml+xml
X-Requested-With: XMLHttpRequest
X-Inertia: true
X-Inertia-Version: 6b16b94d7c51cbe5b1fa42aac98241d5
X-Inertia-Partial-Data: events
X-Inertia-Partial-Component: Events

RESPONSE
HTTP/1.1 200 OK
Content-Type: application/json

{
  "component": "Events",
  "props": {
    "auth": {...},       // NOT included
    "categories": [...], // NOT included
    "events": [...],     // included
    "errors": {}         // always included
  },
  "url": "/events/80",
  "version": "6b16b94d7c51cbe5b1fa42aac98241d5"
}
```

[page object]: #the-page-object

---

---
url: /guide/title-and-meta.md
---
# Title & meta

Since Inertia powered JavaScript apps are rendered within the document `<body>`, they are unable to render markup to the document `<head>`, as it's outside of their scope. To help with this, Inertia ships with a `<Head>` component which can be used to set the page `<title>`, `<meta>` tags, and other `<head>` elements.

> \[!NOTE]
> Since v3.10.0, Inertia Rails supports managing meta tags via Rails. This allows your meta tags to work with link preview services without setting up server-side rendering. Since this isn't a part of the Inertia.js core, it's documented in the [server driven meta tags cookbook](/cookbook/server-managed-meta-tags).

> \[!NOTE]
> The `<Head>` component will only replace `<head>` elements that are not in your server-side layout.

> \[!NOTE]
> The `<Head>` component is not available in the Svelte adapter, as Svelte already ships with its own `<svelte:head>` component.

## Head component

To add `<head>` elements to your page, use the `<Head>` component. Within this component, you can include the elements that you wish to add to the document `<head>`.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>Your page title</title>
    <meta name="description" content="Your page description" />
  </Head>
</template>
```

\== React

```jsx
import { Head } from '@inertiajs/react'

export default () => (
  <Head>
    <title>Your page title</title>
    <meta name="description" content="Your page description" />
  </Head>
)
```

\== Svelte 4|Svelte 5

```svelte
<svelte:head>
  <title>Your page title</title>
  <meta name="description" content="Your page description" />
</svelte:head>
```

> \[!NOTE]
> The `<svelte:head>` component is provided by Svelte.

:::

Title shorthand

If you only need to add a `<title>` to the document `<head>`, you may simply pass the title as a prop to the `<Head>` component.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Your page title" />
</template>
```

\== React

```jsx
import { Head } from '@inertiajs/react'

export default () => <Head title="Your page title" />
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

## Title callback

You can globally modify the page `<title>` using the title callback in the `createInertiaApp` setup method. Typically, this method is invoked in your application's main JavaScript file. A common use case for the title callback is automatically adding an app name before or after each page title.

```js
createInertiaApp({
  title: (title) => `${title} - My App`,
  // ...
})
```

After defining the title callback, the callback will automatically be invoked when you set a title using the `<Head>` component.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Home" />
</template>
```

\== React

```jsx
import { Head } from '@inertiajs/react'

export default () => <Head title="Home" />
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

Which, in this example, will result in the following `<title>` tag.

```html
<title>Home - My App</title>
```

The `title` callback will also be invoked when you set the title using a `<title>` tag within your `<Head>` component.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>Home</title>
  </Head>
</template>
```

\== React

```jsx
import { Head } from '@inertiajs/react'

export default () => (
  <Head>
    <title>Home</title>
  </Head>
)
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

# Multiple Head instances

It's possible to have multiple instances of the `<Head>` component throughout your application. For example, your layout can set some default `<Head>` elements, and then your individual pages can override those defaults.

:::tabs key:frameworks
\== Vue

```vue
<!-- Layout.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>My app</title>
    <meta
      head-key="description"
      name="description"
      content="This is the default description"
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Head>
</template>

<!-- About.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head>
    <title>About - My app</title>
    <meta
      head-key="description"
      name="description"
      content="This is a page specific description"
    />
  </Head>
</template>
```

\== React

```jsx
// Layout.jsx
import { Head } from '@inertiajs/react'

export default () => (
  <Head>
    <title>My app</title>
    <meta
      head-key="description"
      name="description"
      content="This is the default description"
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </Head>
)

// About.jsx
import { Head } from '@inertiajs/react'

export default () => (
  <Head>
    <title>About - My app</title>
    <meta
      head-key="description"
      name="description"
      content="This is a page specific description"
    />
  </Head>
)
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

Inertia will only ever render one `<title>` tag; however, all other tags will be stacked since it's valid to have multiple instances of them. To avoid duplicate tags in your `<head>`, you can use the `head-key` property, which will make sure the tag is only rendered once. This is illustrated in the example above for the `<meta name="description">` tag.

The code example above will render the following HTML.

```html
<head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <title>About - My app</title>
  <meta name="description" content="This is a page specific description" />
</head>
```

### Head extension

When building a real application, it can sometimes be helpful to create a custom head component that extends Inertia's `<Head>` component. This gives you a place to set app-wide defaults, such as appending the app name to the page title.

:::tabs key:frameworks
\== Vue

```vue
<!-- AppHead.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'

defineProps({ title: String })
</script>

<template>
  <Head :title="title ? `${title} - My App` : 'My App'">
    <slot />
  </Head>
</template>
```

\== React

```jsx
// AppHead.jsx
import { Head } from '@inertiajs/react'

export default ({ title, children }) => {
  return (
    <Head>
      <title>{title ? `${title} - My App` : 'My App'}</title>
      {children}
    </Head>
  )
}
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

Once you have created the custom component, you may simply start using the custom component in your pages.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import AppHead from './AppHead'
</script>

<template>
  <AppHead title="About" />
</template>
```

\== React

```jsx
import AppHead from './AppHead'

export default () => <AppHead title="About" />
```

\== Svelte 4|Svelte 5

```js
// Not supported
```

:::

---

---
url: /guide/upgrade-guide.md
---
# Upgrade guide for v2.0

## What's new

Inertia.js v2.0 is a huge step forward for Inertia! The core library has been completely rewritten to architecturally support asynchronous requests, enabling a whole set of new features, including:

* [Polling](/guide/polling)
* [Prefetching](/guide/prefetching)
* [Deferred props](/guide/deferred-props)
* [Infinite scrolling](/guide/merging-props)
* [Lazy loading data on scroll](/guide/load-when-visible)

Additionally, for security sensitive projects, Inertia now offers a [history encryption API](/guide/history-encryption), allowing you to clear page data from history state when logging out of an application.

## Upgrade dependencies

To upgrade to the Inertia.js v2.0 beta, first use npm to install the client-side adapter of your choice:

:::tabs key:frameworks
\== Vue

```vue
npm install @inertiajs/vue3@^2.0
```

\== React

```jsx
npm install @inertiajs/react@^2.0
```

\== Svelte 4|Svelte 5

```svelte
npm install @inertiajs/svelte@^2.0
```

:::

Next, use at least the 3.6 version of `inertia-rails`.

```ruby
gem 'inertia_rails', '~> 3.6'
```

## Breaking changes

While a significant release, Inertia.js v2.0 doesn't introduce many breaking changes. Here's a list of all the breaking changes:

### Dropped Vue 2 support

The Vue 2 adapter has been removed. Vue 2 reached End of Life on December 3, 2023, so this felt like it was time.

### Svelte adapter

* Dropped support for Svelte 3 as it reached End of Life on June 20, 2023.
* The `remember` helper has been renamed to `useRemember` to be consistent with other helpers.
* Updated `setup` callback in `inertia.js`. You need to pass `props` when initializing the `App` component. [See the updated guide](/guide/client-side-setup#initialize-the-inertia-app)
* The `setup` callback is now required in `ssr.js`. [See the updated guide](/guide/server-side-rendering#add-server-entry-point)

### Partial reloads are now async

Previously partial reloads in Inertia were synchronous, just like all Inertia requests. In v2.0, partial reloads are now asynchronous. Generally this is desirable, but if you were relying on these requests being synchronous, you may need to adjust your code.

---

---
url: /guide/validation.md
---
# Validation

## How it works

Handling server-side validation errors in Inertia works differently than a classic XHR-driven form that requires you to catch the validation errors from `422` responses and manually update the form's error state - because Inertia never receives `422` responses. Instead, Inertia operates much more like a standard full page form submission. Here's how:

First, you [submit your form using Inertia](/guide/forms.md). If there are server-side validation errors, you don't return those errors as a `422` JSON response. Instead, you redirect (server-side) the user back to the form page they were previously on, flashing the validation errors in the session.

```ruby
class UsersController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      redirect_to users_url
    else
      redirect_to new_user_url, inertia: { errors: user.errors }
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
```

Next, any time these validation errors are present in the session, they automatically get shared with Inertia, making them available client-side as page props which you can display in your form. Since props are reactive, they are automatically shown when the form submission completes.

Finally, since Inertia apps never generate `422` responses, Inertia needs another way to determine if a response includes validation errors. To do this, Inertia checks the `page.props.errors` object for the existence of any errors. In the event that errors are present, the request's `onError()` callback will be called instead of the `onSuccess()` callback.

## Sharing errors

In order for your server-side validation errors to be available client-side, your server-side framework must share them via the `errors` prop. Inertia's Rails adapter does this automatically.

## Displaying errors

Since validation errors are made available client-side as page component props, you can conditionally display them based on their existence. Remember, when using Rails server adapter, the `errors` prop will automatically be available to your page.

:::tabs key:frameworks
\== Vue

```vue
<script setup>
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

defineProps({ errors: Object })

const form = reactive({
  first_name: null,
  last_name: null,
  email: null,
})

function submit() {
  router.post('/users', form)
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="first_name">First name:</label>
    <input id="first_name" v-model="form.first_name" />
    <div v-if="errors.first_name">{{ errors.first_name }}</div>
    <label for="last_name">Last name:</label>
    <input id="last_name" v-model="form.last_name" />
    <div v-if="errors.last_name">{{ errors.last_name }}</div>
    <label for="email">Email:</label>
    <input id="email" v-model="form.email" />
    <div v-if="errors.email">{{ errors.email }}</div>
    <button type="submit">Submit</button>
  </form>
</template>
```

> \[!NOTE]
> When using the Vue adapters, you may also access the errors via the `$page.props.errors` object.

\== React

```jsx
import { useState } from 'react'
import { router, usePage } from '@inertiajs/react'

export default function Edit() {
  const { errors } = usePage().props

  const [values, setValues] = useState({
    first_name: null,
    last_name: null,
    email: null,
  })

  function handleChange(e) {
    setValues((values) => ({
      ...values,
      [e.target.id]: e.target.value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    router.post('/users', values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">First name:</label>
      <input
        id="first_name"
        value={values.first_name}
        onChange={handleChange}
      />
      {errors.first_name && <div>{errors.first_name}</div>}
      <label htmlFor="last_name">Last name:</label>
      <input id="last_name" value={values.last_name} onChange={handleChange} />
      {errors.last_name && <div>{errors.last_name}</div>}
      <label htmlFor="email">Email:</label>
      <input id="email" value={values.email} onChange={handleChange} />
      {errors.email && <div>{errors.email}</div>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

\== Svelte 4|Svelte 5

```svelte
<script>
  import { router } from '@inertiajs/svelte'

  export let errors = {}

  let values = {
    first_name: null,
    last_name: null,
    email: null,
  }

  function handleSubmit() {
    router.post('/users', values)
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="first_name">First name:</label>
  <input id="first_name" bind:value={values.first_name} />
  {#if errors.first_name}<div>{errors.first_name}</div>{/if}

  <label for="last_name">Last name:</label>
  <input id="last_name" bind:value={values.last_name} />
  {#if errors.last_name}<div>{errors.last_name}</div>{/if}

  <label for="email">Email:</label>
  <input id="email" bind:value={values.email} />
  {#if errors.email}<div>{errors.email}</div>{/if}

  <button type="submit">Submit</button>
</form>
```

:::

## Repopulating input

While handling errors in Inertia is similar to full page form submissions, Inertia offers even more benefits. In fact, you don't even need to manually repopulate old form input data.

When validation errors occur, the user is typically redirected back to the form page they were previously on. And, by default, Inertia automatically preserves the [component state](/guide/manual-visits.md#state-preservation) for `post`, `put`, `patch`, and `delete` requests. Therefore, all the old form input data remains exactly as it was when the user submitted the form.

So, the only work remaining is to display any validation errors using the `errors` prop.

## Error bags

> \[!NOTE]
> If you're using the [form helper](/guide/forms.md), it's not necessary to use error bags since validation errors are automatically scoped to the form object making the request.

For pages that have more than one form, it's possible to encounter conflicts when displaying validation errors if two forms share the same field names. For example, imagine a "create company" form and a "create user" form that both have a `name` field. Since both forms will be displaying the `page.props.errors.name` validation error, generating a validation error for the `name` field in either form will cause the error to appear in both forms.

To solve this issue, you can use "error bags". Error bags scope the validation errors returned from the server within a unique key specific to that form. Continuing with our example above, you might have a `createCompany` error bag for the first form and a `createUser` error bag for the second form.

:::tabs key:frameworks
\== Vue

```js
import { router } from '@inertiajs/vue3'

router.post('/companies', data, {
  errorBag: 'createCompany',
})

router.post('/users', data, {
  errorBag: 'createUser',
})
```

\== React

```jsx
import { router } from '@inertiajs/react'

router.post('/companies', data, {
  errorBag: 'createCompany',
})

router.post('/users', data, {
  errorBag: 'createUser',
})
```

\== Svelte 4|Svelte 5

```js
import { router } from '@inertiajs/svelte'

router.post('/companies', data, {
  errorBag: 'createCompany',
})

router.post('/users', data, {
  errorBag: 'createUser',
})
```

:::

Specifying an error bag will cause the validation errors to come back from the server within `page.props.errors.createCompany` and `page.props.errors.createUser`.

---

---
url: /guide/who-is-it-for.md
---
# Who is Inertia.js for?

Inertia was crafted for development teams and solo hackers who typically build server-side rendered applications using frameworks like Laravel, Ruby on Rails, or Django. You're used to creating controllers, retrieving data from the database (via an ORM), and rendering views.

But what happens when you want to replace your server-side rendered views with a modern, JavaScript-based single-page application frontend? The answer is always "you need to build an API". Because that's how modern SPAs are built.

This means building a REST or GraphQL API. It means figuring out authentication and authorization for that API. It means client-side state management. It means setting up a new Git repository. It means a more complicated deployment strategy. And this list goes on. It's a complete paradigm shift, and often a complete mess. We think there is a better way.

**Inertia empowers you to build a modern, JavaScript-based single-page application without the tiresome complexity.**

Inertia works just like a classic server-side rendered application. You create controllers, you get data from the database (via your ORM), and you render views. But, Inertia views are JavaScript page components written in React, Vue, or Svelte.

This means you get all the power of a client-side application and modern SPA experience, but you don't need to build an API. We think it's a breath of fresh air that will supercharge your productivity.