# Signify

A modern full-stack application with Rails backend and React frontend using Inertia.js.

## Features

- [Inertia Rails](https://inertia-rails.dev) & [Vite Rails](https://vite-ruby.netlify.app) setup
- [React](https://react.dev) frontend with TypeScript & [shadcn/ui](https://ui.shadcn.com) component library
- User authentication system (based on [Authentication Zero](https://github.com/lazaronixon/authentication-zero))
- [Kamal](https://kamal-deploy.org/) for deployment
- Optional SSR support

See also:
- [Svelte Starter Kit](https://github.com/inertia-rails/svelte-starter-kit) for Inertia Rails with Svelte
- [Vue Starter Kit](https://github.com/inertia-rails/vue-starter-kit) for Inertia Rails with Vue


## Setup

1. Clone this repository
2. Setup dependencies & run the server:
   ```bash
   bin/setup
   ```
3. Open http://localhost:3000

## Enabling SSR

This starter kit comes with optional SSR support. To enable it, follow these steps:

1. Open `app/frontend/entrypoints/inertia.ts` and uncomment part of the `setup` function:
   ```ts
   // Uncomment the following to enable SSR hydration:
   // if (el.hasChildNodes()) {
   //   hydrateRoot(el, createElement(App, props))
   //   return
   // }
   ```
2. Open `config/deploy.yml` and uncomment several lines:
   ```yml
   servers:
     # Uncomment to enable SSR:
     # vite_ssr:
     #   hosts:
     #     - 192.168.0.1
     #   cmd: bundle exec vite ssr
     #   options:
     #     network-alias: vite_ssr
      
   # ...
      
   env:
     clear:
       # Uncomment to enable SSR:
       # INERTIA_SSR_ENABLED: true
       # INERTIA_SSR_URL: "http://vite_ssr:13714"
      
   # ...
      
   builder:
     # Uncomment to enable SSR:
     # dockerfile: Dockerfile-ssr
   ```
   
That's it! Now you can deploy your app with SSR support.

## License

The project is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
