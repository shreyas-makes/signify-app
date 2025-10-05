================
CODE SNIPPETS
================
TITLE: Install shadcn/ui Registry Item via CLI
DESCRIPTION: This command demonstrates how to install a specific registry item using the `shadcn` command-line interface. The `add` command is followed by the URL of the registry item's JSON definition, allowing for easy integration of pre-built components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
npx shadcn@latest add http://localhost:3000/r/hello-world.json
```

--------------------------------

TITLE: Install shadcn CLI for registry build operations
DESCRIPTION: This command demonstrates how to install the `shadcn` command-line interface (CLI) tool using npm. The CLI is essential for building and managing shadcn-ui component registries, and this specific command installs the `@canary` version for access to the latest features.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_3

LANGUAGE: bash
CODE:
```
npm install shadcn@canary
```

--------------------------------

TITLE: Perform initial setup for Remix Indie Stack dependencies
DESCRIPTION: Run this command to execute the project's initial setup script, typically defined in `package.json`. This script is crucial for installing all necessary Node.js dependencies and performing any other one-time configurations required before starting development or running the application.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/test/fixtures/frameworks/remix-indie-stack/README.md#_snippet_2

LANGUAGE: sh
CODE:
```
npm run setup
```

--------------------------------

TITLE: Install shadcn CLI Canary Version
DESCRIPTION: This `bash` command installs the `shadcn` CLI, specifically the `canary` version, which is necessary to access the `build` command for generating registry JSON files. It uses `npm` for package management.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
npm install shadcn@canary
```

--------------------------------

TITLE: Install shadcn UI Registry Item using CLI
DESCRIPTION: This command demonstrates how to add a component or block from a shadcn UI registry to your project using the `shadcn` CLI. It utilizes the `add` command followed by the URL of the specific registry item.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_8

LANGUAGE: bash
CODE:
```
npx shadcn@latest add http://localhost:3000/r/hello-world.json
```

--------------------------------

TITLE: Serve shadcn-ui registry in development mode
DESCRIPTION: This command is commonly used to start a development server, particularly for frameworks like Next.js, which will serve the built shadcn-ui registry files. Running this allows local testing and access to the registry endpoint, typically at `http://localhost:3000/r/[NAME].json`.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_6

LANGUAGE: bash
CODE:
```
npm run dev
```

--------------------------------

TITLE: Install foo package using npm
DESCRIPTION: This command installs the 'foo' package using npm. It's a basic example of using the npm package manager.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/styleguide.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install foo
```

--------------------------------

TITLE: Create a simple React/TypeScript component for shadcn-ui registry
DESCRIPTION: This example demonstrates how to create a basic React component (`HelloWorld`) using TypeScript/TSX, suitable for inclusion in a shadcn-ui component registry. It shows a functional component that renders a `Button` from the `@/components/ui/button` path.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
import { Button } from "@/components/ui/button"

export function HelloWorld() {
  return <Button>Hello World</Button>
}
```

--------------------------------

TITLE: Serve Registry Locally for Development
DESCRIPTION: This `bash` command starts the local development server, typically `next dev` for Next.js projects. It allows you to serve and test your newly built registry files locally, verifying their accessibility and functionality before deployment to a public URL.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
npm run dev
```

--------------------------------

TITLE: Install Input OTP dependency manually
DESCRIPTION: Install the `input-otp` package using npm as a project dependency for manual setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/input-otp.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
npm install input-otp
```

--------------------------------

TITLE: Install Dialog component using CLI
DESCRIPTION: Installs the Shadcn UI Dialog component using the `npx shadcn@latest add` command, which automates the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/dialog.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add dialog
```

--------------------------------

TITLE: Run shadcn-ui registry build script
DESCRIPTION: This command executes the `registry:build` script previously defined in the `package.json` file. Running this command triggers the `shadcn build` process, which generates the necessary JSON files for the component registry, preparing it for serving or publishing.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
npm run registry:build
```

--------------------------------

TITLE: Install Resizable component using shadcn/ui CLI
DESCRIPTION: Installs the Resizable component and its dependencies using the shadcn/ui CLI, simplifying the setup process and integrating it into your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/resizable.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add resizable
```

--------------------------------

TITLE: Install Command Component via CLI
DESCRIPTION: Installs the shadcn/ui Command component using the `npx shadcn@latest add` command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/command.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add command
```

--------------------------------

TITLE: Initialize registry.json for Component Registry
DESCRIPTION: This JSON snippet defines the foundational `registry.json` file, crucial for setting up a `shadcn` component registry. It includes schema reference, registry name, homepage, and an empty array for component items, serving as the starting point for your registry configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_0

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    // ...
  ]
}
```

--------------------------------

TITLE: Execute Registry Build Process
DESCRIPTION: This `bash` command runs the `registry:build` script defined in `package.json`. Executing this command triggers the `shadcn build` process, which generates the final registry JSON files, making your components ready for distribution.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_6

LANGUAGE: bash
CODE:
```
npm run registry:build
```

--------------------------------

TITLE: Install Textarea component via shadcn/ui CLI
DESCRIPTION: Installs the Textarea component into your project using the shadcn/ui command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/textarea.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add textarea
```

--------------------------------

TITLE: Install Tailwind CSS dependencies for TanStack Start
DESCRIPTION: This command installs `tailwindcss` and its required PostCSS dependencies using npm, preparing the project for Tailwind CSS integration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/tanstack.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install tailwindcss @tailwindcss/postcss postcss
```

--------------------------------

TITLE: Install Shadcn UI Input Component via CLI
DESCRIPTION: Installs the Shadcn UI Input component into your project using the command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/input.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add input
```

--------------------------------

TITLE: Define shadcn/ui Universal Item for Custom ESLint Config (JSON)
DESCRIPTION: This example showcases a universal shadcn/ui registry item for installing a custom ESLint configuration. Named 'my-eslint-config', it targets '~/.eslintrc.json' to place the custom ESLint setup. The 'content' field holds the actual JSON configuration for ESLint.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/examples.mdx#_snippet_24

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-eslint-config",
  "type": "registry:item",
  "files": [
    {
      "path": "/path/to/your/registry/default/custom-eslint.json",
      "type": "registry:file",
      "target": "~/.eslintrc.json",
      "content": "..."
    }
  ]
}
```

--------------------------------

TITLE: Manually install dependencies and configure Shadcn UI Toast
DESCRIPTION: Guides through manually installing the required Radix UI Toast dependency and integrating the Toaster component into the root layout for Shadcn UI Toast setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/toast.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-toast
```

LANGUAGE: tsx
CODE:
```
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

--------------------------------

TITLE: Create a new Gatsby project
DESCRIPTION: Start by creating a new Gatsby project using the `create-gatsby` command-line tool.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/gatsby.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm init gatsby
```

--------------------------------

TITLE: Install Command Component via CLI
DESCRIPTION: Installs the shadcn/ui Command component using the `npx shadcn@latest add` command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/command.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add command
```

--------------------------------

TITLE: Register HelloWorld Component in registry.json
DESCRIPTION: This JSON snippet shows how to formally register the `HelloWorld` component within the `registry.json` file. It defines metadata such as name, type, title, description, and crucially, the relative path and type of the component's source file, making it discoverable by the registry.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_3

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "registry/new-york/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

--------------------------------

TITLE: Install Input OTP component using shadcn CLI
DESCRIPTION: Run the shadcn CLI command to add the Input OTP component to your project, automating the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/input-otp.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add input-otp
```

--------------------------------

TITLE: Install Tooltip dependencies manually
DESCRIPTION: This command installs the `@radix-ui/react-tooltip` package, which is a required dependency for the manual setup of the Tooltip component. Ensure you have npm installed.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/tooltip.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-tooltip
```

--------------------------------

TITLE: Add a component definition to shadcn-ui `registry.json`
DESCRIPTION: This snippet shows how to update the `registry.json` file to include a new component definition within its `items` array. It specifies the component's name, type, title, description, and details the path and type of its associated source files, integrating it into the registry's manifest.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_2

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "files": [
        {
          "path": "registry/new-york/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

--------------------------------

TITLE: Create a Basic HelloWorld React Component
DESCRIPTION: This TypeScript React (TSX) snippet demonstrates creating a simple `HelloWorld` component. It imports a `Button` from `@/components/ui/button`, showcasing a common pattern for UI component development within a registry context. This component will be registered and made available.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
import { Button } from "@/components/ui/button"

export function HelloWorld() {
  return <Button>Hello World</Button>
}
```

--------------------------------

TITLE: Add registry:build Script to package.json
DESCRIPTION: This JSON snippet modifies `package.json` to include a new `registry:build` script. This script executes `shadcn build`, automating the process of compiling your registry components into consumable JSON files, streamlining the build workflow.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_5

LANGUAGE: json
CODE:
```
{
  "scripts": {
    "registry:build": "shadcn build"
  }
}
```

--------------------------------

TITLE: Install Shadcn UI Button via CLI
DESCRIPTION: Installs the Shadcn UI Button component using the `npx shadcn@latest add` command-line interface for quick setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/button.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add button
```

--------------------------------

TITLE: Install Carousel Component via CLI
DESCRIPTION: Installs the shadcn/ui carousel component and its dependencies using the command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/carousel.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add carousel
```

--------------------------------

TITLE: Install Tailwind CSS dependencies for TanStack Start
DESCRIPTION: Installs `tailwindcss` and its required PostCSS dependencies using npm. This step prepares your TanStack Start project for integrating Tailwind CSS by adding the necessary packages.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/tanstack.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install tailwindcss @tailwindcss/postcss postcss
```

--------------------------------

TITLE: Install Command Component Manual Dependencies
DESCRIPTION: Installs the `cmdk` dependency, which is the underlying component used by the shadcn/ui Command component, required for manual setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/command.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install cmdk
```

--------------------------------

TITLE: Install Navigation Menu Component via CLI
DESCRIPTION: Installs the Shadcn UI Navigation Menu component using the command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/navigation-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add navigation-menu
```

--------------------------------

TITLE: Install Menubar dependencies manually
DESCRIPTION: Installs the required Radix UI Menubar primitive dependency for manual setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/menubar.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-menubar
```

--------------------------------

TITLE: Define `registry.json` structure for shadcn-ui component registry
DESCRIPTION: This snippet illustrates the basic structure of the `registry.json` file, which serves as the entry point for a shadcn-ui component registry. It includes essential fields like the schema reference, registry name, homepage URL, and an array to list all registry items.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_0

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    // ...
  ]
}
```

--------------------------------

TITLE: Install Collapsible UI Component (CLI & Manual)
DESCRIPTION: This section provides instructions for installing the Collapsible UI component. You can either use the shadcn/ui CLI for automated setup or manually install the core Radix UI dependency.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/collapsible.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add collapsible
```

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-collapsible
```

--------------------------------

TITLE: Install Calendar component using CLI
DESCRIPTION: Installs the shadcn/ui Calendar component into your project using the command-line interface. This is the recommended method for quick setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/calendar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add calendar
```

--------------------------------

TITLE: Install Checkbox Component via CLI
DESCRIPTION: Installs the shadcn/ui Checkbox component using the command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/checkbox.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add checkbox
```

--------------------------------

TITLE: Install Checkbox Component via CLI
DESCRIPTION: Installs the shadcn/ui Checkbox component using the command-line interface, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/checkbox.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add checkbox
```

--------------------------------

TITLE: Install Shadcn UI Select Component via CLI
DESCRIPTION: Installs the Shadcn UI Select component using the `npx shadcn@latest add` command. This method automates the setup process by adding the component's files to your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/select.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add select
```

--------------------------------

TITLE: Install Shadcn UI Button via CLI
DESCRIPTION: Installs the Shadcn UI Button component using the `npx shadcn@latest add` command-line interface, which automates the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/button.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add button
```

--------------------------------

TITLE: Install Shadcn UI Components from Configured Namespaced Registries
DESCRIPTION: Shows how to install components using the `npx shadcn add` command with namespaced registries. Examples include installing from a public registry (`@v0`), a private registry (`@private`), and installing multiple resources from different configured registries simultaneously.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/components-json.mdx#_snippet_17

LANGUAGE: bash
CODE:
```
npx shadcn@latest add @v0/dashboard

npx shadcn@latest add @private/button

npx shadcn@latest add @acme/header @internal/auth-utils
```

--------------------------------

TITLE: Example shadcn/ui initialization prompt output
DESCRIPTION: Displays an example of the interactive prompt that appears when running the `shadcn init` command. It shows a typical question asked by the CLI, such as selecting a base color for the components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/vite.mdx#_snippet_8

LANGUAGE: txt
CODE:
```
Which color would you like to use as base color? › Neutral
```

--------------------------------

TITLE: Install Shadcn UI Progress component via CLI
DESCRIPTION: Instructions for adding the Progress component to a project using the Shadcn UI CLI command, which automates the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/progress.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add progress
```

--------------------------------

TITLE: Install Hover Card manual dependencies
DESCRIPTION: Installs the required `@radix-ui/react-hover-card` dependency, which is necessary for the manual setup of the Hover Card component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/hover-card.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-hover-card
```

--------------------------------

TITLE: Install shadcn/ui block with custom primitives
DESCRIPTION: This configuration demonstrates how to install a shadcn/ui block like 'login-01' and simultaneously override its default primitive components (e.g., button, input, label) with custom versions sourced from external registry URLs. This allows for consistent custom styling across installed blocks.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/examples.mdx#_snippet_5

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "custom-login",
  "type": "registry:block",
  "registryDependencies": [
    "login-01",
    "https://example.com/r/button.json",
    "https://example.com/r/input.json",
    "https://example.com/r/label.json"
  ]
}
```

--------------------------------

TITLE: Add `registry:build` script to `package.json` for shadcn-ui
DESCRIPTION: This snippet illustrates how to add a custom script named `registry:build` to the `scripts` section of a `package.json` file. This script is configured to execute the `shadcn build` command, providing a convenient way to automate the registry's build process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/getting-started.mdx#_snippet_4

LANGUAGE: json
CODE:
```
{
  "scripts": {
    "registry:build": "shadcn build"
  }
}
```

--------------------------------

TITLE: Install Shadcn UI Label via CLI
DESCRIPTION: Installs the Shadcn UI Label component using the `npx shadcn@latest add` command, automating setup and integration into your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/label.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add label
```

--------------------------------

TITLE: Install Shadcn UI Tooltip component via CLI
DESCRIPTION: Install the Tooltip component in your project using the shadcn UI command-line interface. This command automates the setup process for the component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/tooltip.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add tooltip
```

--------------------------------

TITLE: Install Radix UI Switch Dependency Manually
DESCRIPTION: Installs the `@radix-ui/react-switch` dependency, which is required for the manual setup of the Shadcn UI Switch component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/switch.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-switch
```

--------------------------------

TITLE: Install Radix UI Label dependency manually
DESCRIPTION: Installs the `@radix-ui/react-label` package, a required dependency for manual setup of the Shadcn UI Label component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/label.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-label
```

--------------------------------

TITLE: Install Shadcn UI Alert Dialog via CLI
DESCRIPTION: Installs the Alert Dialog component using the shadcn/ui command-line interface, simplifying the setup process by adding the component and its dependencies to your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/alert-dialog.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add alert-dialog
```

--------------------------------

TITLE: Install Dialog dependencies manually
DESCRIPTION: Installs the `@radix-ui/react-dialog` dependency, which is required for the manual setup of the Dialog component. This step ensures the core functionality is available.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/dialog.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-dialog
```

--------------------------------

TITLE: Install Breadcrumb component using CLI
DESCRIPTION: Installs the Breadcrumb component into your project using the shadcn/ui CLI command, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/breadcrumb.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add breadcrumb
```

--------------------------------

TITLE: Install Menubar Component using shadcn/ui CLI
DESCRIPTION: This command adds the Menubar component to your project using the shadcn/ui CLI, automating the setup process and integrating it with your existing UI components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/menubar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add menubar
```

--------------------------------

TITLE: Initialize shadcn/ui in TanStack Start project
DESCRIPTION: Executes the `shadcn` CLI initialization command. This command sets up `shadcn/ui` in your project by creating a `components.json` file and configuring necessary CSS variables within `app/styles/app.css`.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/tanstack.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
npx shadcn@canary init
```

--------------------------------

TITLE: Initialize shadcn/ui in your Gatsby project
DESCRIPTION: Run the `shadcn` init command to set up the shadcn/ui configuration in your Gatsby project, preparing it for component installation.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/gatsby.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Install Context Menu Dependencies Manually (npm)
DESCRIPTION: Installs the core `@radix-ui/react-context-menu` package, a required dependency for manual setup of the Context Menu component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/context-menu.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-context-menu
```

--------------------------------

TITLE: Start the development server
DESCRIPTION: Launch the local development server by running `pnpm www:dev`. This allows you to preview your changes and work on your blocks in real-time.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/blocks.mdx#_snippet_3

LANGUAGE: bash
CODE:
```
pnpm www:dev
```

--------------------------------

TITLE: Install Context Menu component using shadcn/ui CLI
DESCRIPTION: This command adds the Context Menu component to your project using the shadcn/ui command-line interface, automating the setup process and integrating it into your component library.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/context-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add context-menu
```

--------------------------------

TITLE: Configure TypeScript paths for TanStack Start
DESCRIPTION: Modifies the `tsconfig.json` file to configure TypeScript path aliases. This setup, specifically mapping `@/` to `./app/*`, helps resolve module imports more efficiently within your TanStack Start project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/tanstack.mdx#_snippet_4

LANGUAGE: json
CODE:
```
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  }
}
```

--------------------------------

TITLE: Install Shadcn UI Slider Component
DESCRIPTION: Provides instructions for installing the Shadcn UI Slider component, either via the command-line interface (CLI) for quick setup or manually by installing its core dependency. The manual method requires copying the component's source code separately.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/slider.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add slider
```

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-slider
```

--------------------------------

TITLE: Manually Install Dropdown Menu Dependencies
DESCRIPTION: Install the @radix-ui/react-dropdown-menu package, a core dependency for manual setup of the Shadcn UI Dropdown Menu component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/dropdown-menu.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-dropdown-menu
```

--------------------------------

TITLE: Install Navigation Menu Component via CLI
DESCRIPTION: Installs the Shadcn UI Navigation Menu component using the command-line interface (CLI). This command leverages `npx shadcn@latest add` to automate the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/navigation-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add navigation-menu
```

--------------------------------

TITLE: Initialize shadcn-ui project
DESCRIPTION: This command initializes a shadcn-ui project using the latest version. It sets up the basic project structure and configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/styleguide.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Install Shadcn UI Toggle Group via CLI
DESCRIPTION: Installs the Toggle Group component into your project using the shadcn/ui command-line interface, automating setup and configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/toggle-group.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add toggle-group
```

--------------------------------

TITLE: Install shadcn/ui Sidebar Component via CLI
DESCRIPTION: Use the shadcn/ui CLI to automatically add the `sidebar.tsx` component to your project. This command streamlines the installation process, handling the component file creation and initial setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/sidebar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add sidebar
```

--------------------------------

TITLE: Initialize shadcn/ui in Next.js Project
DESCRIPTION: Run the `init` command to set up shadcn/ui in a new or existing Next.js project. This command guides you through the initial configuration steps, including choosing between a standard Next.js project or a Monorepo setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/next.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Install Shadcn UI Table Component via CLI
DESCRIPTION: Provides the command-line interface (CLI) command to add the Shadcn UI Table component to your project, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/table.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add table
```

--------------------------------

TITLE: Install Shadcn UI Separator via CLI
DESCRIPTION: Installs the Shadcn UI Separator component using the Shadcn CLI tool, simplifying the setup process by adding the component's files to your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/separator.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add separator
```

--------------------------------

TITLE: Install Input OTP dependency manually via npm
DESCRIPTION: This command installs the `input-otp` package via npm, which is a prerequisite for manual setup of the Input OTP component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/input-otp.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install input-otp
```

--------------------------------

TITLE: Define shadcn/ui Universal Item with Multiple Files and Dependencies (JSON)
DESCRIPTION: This JSON configuration illustrates a universal shadcn/ui registry item named 'my-custom-start-template' that installs multiple files. It also demonstrates how to declare dependencies, in this case 'better-auth'. The item includes two files, one JSON and one Vue, each with its own source path, type, target, and content.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/examples.mdx#_snippet_25

LANGUAGE: json
CODE:
```
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-custom-start-template",
  "type": "registry:item",
  "dependencies": ["better-auth"],
  "files": [
    {
      "path": "/path/to/file-01.json",
      "type": "registry:file",
      "target": "~/file-01.json",
      "content": "..."
    },
    {
      "path": "/path/to/file-02.vue",
      "type": "registry:file",
      "target": "~/pages/file-02.vue",
      "content": "..."
    }
  ]
}
```

--------------------------------

TITLE: Install Shadcn UI Table Component via CLI
DESCRIPTION: Use the Shadcn UI CLI to quickly add the table component to your project. This command handles the necessary file creation and configuration, streamlining the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/table.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add table
```

--------------------------------

TITLE: Initialize shadcn/ui in TanStack Start project
DESCRIPTION: This command runs the `shadcn` CLI initialization process. It sets up the `components.json` file in the project root and configures CSS variables within the application's stylesheet for `shadcn/ui` components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/tanstack.mdx#_snippet_5

LANGUAGE: bash
CODE:
```
npx shadcn@canary init
```

--------------------------------

TITLE: Install Tooltip component using shadcn CLI
DESCRIPTION: This command uses the shadcn CLI to automatically add the Tooltip component and its dependencies to your project, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/tooltip.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add tooltip
```

--------------------------------

TITLE: Install Shadcn UI Alert Component via CLI
DESCRIPTION: Use the shadcn/ui CLI to quickly add the Alert component and its dependencies to your project. This command automates the setup process, ensuring all necessary files are integrated.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/alert.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add alert
```

--------------------------------

TITLE: Initialize Remix project and Git repository
DESCRIPTION: After creating a new Remix project, execute `npx remix init` to perform essential initial setup tasks specific to the Remix framework. Subsequently, use standard Git commands to initialize a new version control repository, add all project files, and commit the initial state, establishing a baseline for development.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/test/fixtures/frameworks/remix-indie-stack/README.md#_snippet_1

LANGUAGE: sh
CODE:
```
npx remix init
git init # if you haven't already
git add .
git commit -m "Initialize project"
```

--------------------------------

TITLE: Add shadcn/ui Components to Monorepo Application
DESCRIPTION: This example illustrates how to add shadcn/ui components within a monorepo setup. Users must first navigate into their specific application directory (e.g., `apps/web`) before running `npx shadcn@canary add [COMPONENT]`. The CLI intelligently installs components to the shared `packages/ui` workspace and automatically updates import paths in the application.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/monorepo.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
cd apps/web
```

LANGUAGE: bash
CODE:
```
npx shadcn@canary add [COMPONENT]
```

--------------------------------

TITLE: Install Shadcn UI Label component via CLI
DESCRIPTION: Use the Shadcn UI command-line interface to quickly add the Label component to your project, handling dependencies and setup automatically.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/label.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add label
```

--------------------------------

TITLE: Install Radix UI Hover Card Dependency Manually
DESCRIPTION: Installs the core `@radix-ui/react-hover-card` dependency required for manual setup of the Hover Card component, typically used when not leveraging the Shadcn UI CLI.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/hover-card.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-hover-card
```

--------------------------------

TITLE: Install Shadcn UI Dropdown Menu via CLI
DESCRIPTION: Use the Shadcn UI command-line interface to add the Dropdown Menu component to your project, simplifying setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/dropdown-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add dropdown-menu
```

--------------------------------

TITLE: Install Shadcn UI Card Component via CLI
DESCRIPTION: Installs the Shadcn UI Card component into your project using the `npx shadcn@latest add card` command-line interface. This command automates the setup process for the component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/card.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add card
```

--------------------------------

TITLE: Install Radix UI Select Dependencies Manually
DESCRIPTION: Installs the core `@radix-ui/react-select` dependency, which is required for the manual setup of the Shadcn UI Select component. This step ensures the underlying primitive is available for use.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/select.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-select
```

--------------------------------

TITLE: Start Development Server
DESCRIPTION: Starts the local development server for the shadcn/ui website. This allows you to preview your changes and test your new block in a live environment.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/blocks.mdx#_snippet_3

LANGUAGE: bash
CODE:
```
pnpm www:dev
```

--------------------------------

TITLE: Install Aspect Ratio component via shadcn/ui CLI
DESCRIPTION: This command uses the shadcn/ui CLI to automatically add the Aspect Ratio component and its dependencies to your project, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/aspect-ratio.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add aspect-ratio
```

--------------------------------

TITLE: Install Sonner via shadcn/ui CLI
DESCRIPTION: Use this command to quickly add the Sonner component to your project through the shadcn/ui command-line interface, streamlining the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/sonner.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add sonner
```

--------------------------------

TITLE: Install Shadcn UI Dropdown Menu via CLI
DESCRIPTION: Use the Shadcn UI CLI to quickly add the `dropdown-menu` component to your project. This command automates the setup process, including dependencies and component files.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/dropdown-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add dropdown-menu
```

--------------------------------

TITLE: Install Navigation Menu Dependencies Manually
DESCRIPTION: Installs the core `@radix-ui/react-navigation-menu` dependency required for manual setup of the Navigation Menu component. This step is necessary before copying the component's source code.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/navigation-menu.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-navigation-menu
```

--------------------------------

TITLE: Install Shadcn UI Hover Card via CLI
DESCRIPTION: Installs the Shadcn UI Hover Card component using the `npx shadcn@latest add` command-line interface, which automatically sets up the component in your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/hover-card.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add hover-card
```

--------------------------------

TITLE: Install Shadcn UI Dialog component via CLI
DESCRIPTION: This command uses the Shadcn UI command-line interface to automatically add the Dialog component and its dependencies to your project, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/dialog.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add dialog
```

--------------------------------

TITLE: Install Radix UI Progress dependency via npm
DESCRIPTION: Installs the core Radix UI Progress primitive as a dependency for manual setup of the Shadcn UI Progress component. This is a prerequisite for integrating the component into your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/progress.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-progress
```

--------------------------------

TITLE: Install shadcn/ui Select Component via CLI
DESCRIPTION: Instructions to add the Select component to your project using the shadcn/ui command-line interface.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/select.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add select
```

--------------------------------

TITLE: Install Radix UI Dropdown Menu Core Dependency
DESCRIPTION: Manually install the `@radix-ui/react-dropdown-menu` package, which is the foundational dependency for the Shadcn UI Dropdown Menu component. This step is required for manual setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/dropdown-menu.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-dropdown-menu
```

--------------------------------

TITLE: Install project dependencies
DESCRIPTION: Install all necessary project dependencies using `pnpm install` to ensure your development environment has all required packages for building and running the project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/blocks.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm install
```

--------------------------------

TITLE: Install shadcn/ui Toggle component via CLI
DESCRIPTION: Use the shadcn/ui CLI to automatically add and configure the Toggle component to your project. This command handles necessary file creation and dependency setup.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/toggle.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add toggle
```

--------------------------------

TITLE: Initialize shadcn/ui in Remix
DESCRIPTION: Run the `shadcn` init command to set up the `shadcn/ui` configuration within your Remix project. This command will guide you through configuring `components.json`.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/remix.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Initialize shadcn/ui in a Remix project
DESCRIPTION: Command to run the `shadcn` init CLI, which sets up the project for shadcn/ui components by configuring necessary files and dependencies.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/remix.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Initialize shadcn/ui project
DESCRIPTION: Executes the `shadcn` CLI's `init` command to set up the shadcn/ui configuration for the project. This command interactively prompts the user for various settings, such as the base color and component directory.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/vite.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Example of Multiple Registry Configuration for Diverse Sources
DESCRIPTION: Provides a comprehensive example of configuring multiple registries in `components.json`, combining public (shadcn/ui), private with authentication, and team-specific registries with parameters and environment variable expansion. This setup enables access to various component sources from a single configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/components-json.mdx#_snippet_18

LANGUAGE: json
CODE:
```
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/r/{name}.json",
    "@company-ui": {
      "url": "https://registry.company.com/ui/{name}.json",
      "headers": {
        "Authorization": "Bearer ${COMPANY_TOKEN}"
      }
    },
    "@team": {
      "url": "https://team.company.com/{name}.json",
      "params": {
        "team": "frontend",
        "version": "${REGISTRY_VERSION}"
      }
    }
  }
}
```

--------------------------------

TITLE: Install Shadcn UI Components from Registries
DESCRIPTION: This command demonstrates how to install components from various sources using `npx shadcn@latest add`. It supports installing from specific registries, multiple resources at once, direct URLs, or local files, providing flexibility in component acquisition.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/namespace.mdx#_snippet_10

LANGUAGE: bash
CODE:
```
npx shadcn@latest add @v0/dashboard
```

LANGUAGE: bash
CODE:
```
npx shadcn@latest add @acme/button @lib/utils @ai/prompt
```

LANGUAGE: bash
CODE:
```
npx shadcn@latest add https://registry.example.com/button.json
```

LANGUAGE: bash
CODE:
```
npx shadcn@latest add ./local-registry/button.json
```

--------------------------------

TITLE: Install Shadcn UI Skeleton Component via CLI
DESCRIPTION: Use this command to automatically add the Shadcn UI Skeleton component to your project. This method simplifies setup by handling file creation and configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/skeleton.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add skeleton
```

--------------------------------

TITLE: Install Project Dependencies
DESCRIPTION: Installs all necessary project dependencies using pnpm. This step ensures that all required packages are available for running the development server and building your blocks.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/blocks.mdx#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm install
```

--------------------------------

TITLE: Install Shadcn UI Accordion with CLI
DESCRIPTION: Use the Shadcn UI CLI to quickly add the Accordion component and its dependencies to your project. This command automates the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/accordion.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add accordion
```

--------------------------------

TITLE: Install Shadcn UI Switch Component
DESCRIPTION: Provides instructions for installing the Shadcn UI Switch component using either the CLI or manually by installing its core dependency.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/switch.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add switch
```

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-switch
```

--------------------------------

TITLE: Create a new Remix project
DESCRIPTION: Instructions to initialize a new Remix application using the `create-remix` CLI tool, setting up the basic project structure.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/remix.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-remix@latest my-app
```

--------------------------------

TITLE: Install Carousel component via CLI
DESCRIPTION: Use the shadcn/ui CLI to automatically add the Carousel component and its dependencies to your project, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/carousel.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add carousel
```

--------------------------------

TITLE: Install Radix UI Select Dependency Manually
DESCRIPTION: Install the core @radix-ui/react-select package, a prerequisite for manually setting up the Select component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/select.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @radix-ui/react-select
```

--------------------------------

TITLE: Install Core UI Component Dependencies via npm
DESCRIPTION: This command installs the necessary npm packages for the UI components, including styling utilities like `class-variance-authority`, `clsx`, `tailwind-merge`, icon library `lucide-react`, and animation utilities `tw-animate-css`. These dependencies are crucial for the proper functioning and styling of the components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/manual.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

--------------------------------

TITLE: Initialize shadcn/ui project configuration
DESCRIPTION: Runs the `shadcn` CLI initialization command to set up the project, prompting for configuration details like base color.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/vite.mdx#_snippet_7

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Configure shadcn/ui components.json settings
DESCRIPTION: Example of interactive prompts for configuring `components.json` during the `shadcn/ui` initialization process, allowing selection of style, base color, and CSS variable usage.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/remix.mdx#_snippet_2

LANGUAGE: txt
CODE:
```
Which style would you like to use? › New York
Which color would you like to use as base color? › Zinc
Do you want to use CSS variables for colors? › no / yes
```

--------------------------------

TITLE: Install Shadcn UI Textarea Component via CLI
DESCRIPTION: Use the Shadcn UI command-line interface to quickly add the Textarea component to your project. This command fetches and integrates the component's code and dependencies, simplifying the setup process.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/textarea.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add textarea
```

--------------------------------

TITLE: Configure Tailwind CSS for Registry Paths
DESCRIPTION: This TypeScript snippet updates `tailwind.config.ts` to include the `registry` directory in its `content` array. This configuration ensures that Tailwind CSS correctly scans and processes utility classes used within components located in your registry, preventing style purging issues.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/registry/getting-started.mdx#_snippet_2

LANGUAGE: ts
CODE:
```
// tailwind.config.ts
export default {
  content: ["./registry/**/*.{js,ts,jsx,tsx}"],
}
```

--------------------------------

TITLE: Install Popover component using shadcn CLI
DESCRIPTION: This command adds the Popover component to your project using the shadcn UI command-line interface, automating the setup process and integrating it into your existing UI.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/popover.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add popover
```

--------------------------------

TITLE: Create a new Gatsby project
DESCRIPTION: Initializes a new Gatsby project using the `create-gatsby` command, setting up the basic project structure.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/gatsby.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm init gatsby
```

--------------------------------

TITLE: Install Sonner via shadcn/ui CLI
DESCRIPTION: This command uses the `npx shadcn` utility to automatically add the Sonner component to your project, simplifying the setup process for shadcn/ui users. It handles the necessary file creation and configuration.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/sonner.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add sonner
```

--------------------------------

TITLE: Install Context Menu via CLI (shadcn/ui)
DESCRIPTION: Installs the Context Menu component using the shadcn/ui CLI tool, which automates adding the component and its dependencies to your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/context-menu.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add context-menu
```

--------------------------------

TITLE: Project Directory Structure
DESCRIPTION: Illustrates the directory structure of a typical web application project, showing the organization of app, components, packages, and configuration files.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/styleguide.mdx#_snippet_9

LANGUAGE: txt
CODE:
```
apps
└── web         # Your app goes here.
    ├── app
    │   └── page.tsx
    ├── components
    │   └── login-form.tsx
    ├── components.json
    └── package.json
packages
└── ui          # Your components and dependencies are installed here.
    ├── src
    │   ├── components
    │   │   └── button.tsx
    │   ├── hooks
    │   ├── lib
    │   │   └── utils.ts
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
turbo.json
```

--------------------------------

TITLE: Add a shadcn/ui component to TanStack Start
DESCRIPTION: This command uses the `shadcn` CLI to add a specific component, such as the `Button`, to the project. It integrates the component's code and styles into the project structure, making it ready for use.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/installation/tanstack.mdx#_snippet_6

LANGUAGE: bash
CODE:
```
npx shadcn@canary add button
```

--------------------------------

TITLE: Install Core UI Component Dependencies via npm
DESCRIPTION: This command installs the necessary npm packages for the UI components, including styling utilities like `class-variance-authority`, `clsx`, `tailwind-merge`, icon library `lucide-react`, and animation utilities `tw-animate-css`. These dependencies are crucial for the proper functioning and styling of the components.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/installation/manual.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

--------------------------------

TITLE: Create a new Remix Indie Stack project
DESCRIPTION: Use this command to scaffold a new Remix application pre-configured with the Indie Stack template. It sets up a complete full-stack environment including database, authentication, and deployment configurations, ready for immediate development.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/packages/shadcn/test/fixtures/frameworks/remix-indie-stack/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
npx create-remix@latest --template remix-run/indie-stack
```

--------------------------------

TITLE: Install Alert Dialog component using shadcn CLI
DESCRIPTION: This command adds the Alert Dialog component to your shadcn/ui project using the command-line interface. It automates the setup process, including copying necessary files and configuring imports.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/alert-dialog.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add alert-dialog
```

--------------------------------

TITLE: Install Calendar Component via CLI
DESCRIPTION: Installs the Calendar component into your project using the shadcn/ui command-line interface.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/calendar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add calendar
```

--------------------------------

TITLE: Install Resizable component using shadcn/ui CLI
DESCRIPTION: Installs the Resizable component and its dependencies using the shadcn/ui command-line interface. This is the recommended and simplest method for integrating the component into your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/resizable.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add resizable
```

--------------------------------

TITLE: Initialize shadcn/ui project
DESCRIPTION: This command creates a `components.json` file in your project, which is essential for using the shadcn/ui CLI to add components. It sets up the initial configuration for your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/(root)/components-json.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest init
```

--------------------------------

TITLE: Install Menubar component using Shadcn CLI
DESCRIPTION: Installs the Menubar component into your project using the Shadcn UI command-line interface.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/www/content/docs/components/menubar.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add menubar
```

--------------------------------

TITLE: Install Shadcn UI Aspect Ratio component via CLI
DESCRIPTION: Installs the Shadcn UI Aspect Ratio component using the `npx shadcn@latest add` command, which automatically adds the component to your project.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/aspect-ratio.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add aspect-ratio
```

--------------------------------

TITLE: Install Shadcn UI Input component via CLI
DESCRIPTION: Installs the Input component into your project using the Shadcn UI command-line interface. This command fetches and adds the necessary files for the Input component.

SOURCE: https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/components/input.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx shadcn@latest add input
```