# zSnout.com in NodeJS

This is the source code for a beta version of [zsnout.com](https://zsnout.com/) made using NodeJS.

# Our Dev Stack

zSnout uses [Fastify](https://fastify.io/) as a back-end framework, [EJS](https://ejs.co/) as an HTML templating library, [TypeScript](https://www.typescriptlang.com/) to catch compile-time errors in JavaScript, [Sass](https://sass-lang.com/) as a CSS extension, and a custom JSX implementation for the front-end.

# Code Editor Setup

When using VSCode, we recommend adding the following into your `files.exclude` settings:

```json
".git": true,
".github": true,
".gitignore": true,
".prettierignore": true,
".prettierrc.json": true,
".vscode": true,
"**/*.js": { "when": "$(basename).ts" },
"***/*.js": { "when": "$(basename).tsx" },
"**/*.css": { "when": "$(basename).scss" },
"**/*.html": { "when": "$(basename).ejs" },
"**/*.js.map": true,
"**/*.css.map": true,
"CODE_OF_CONDUCT.md": true,
"CONTRIBUTING.md": true,
"LICENSE": true,
"node_modules": true,
"package-lock.json": true,
".env-template": true,
"database-template.json": true,
```

This will prevent most unimportant files from showing up (e.g. compiled output & config settings).

# Local Testing

If testing things locally, you may name a file `local_{...}` or put it into a folder named `local`, and it won't be tracked by Git.
