# zSnout.com in NodeJS

This is the source code for a beta version of zsnout.com written using NodeJS.

# Directory Structure

- [.github](/.github): This contains all of the GitHub configuration files.
- [client](/client): This is where all client-side files live. These may be templates or static files.
- [layouts](/layouts): This directory contains all EJS layouts used in templating.
- [routes](/routes): This is where all of the server-side routes are stored.
- [server](/server): This directory has all of the core server-side files.

# How to Download zSnout

1. Install NodeJS on your computer. We recommend using [NVM](https://github.com/nvm-sh/nvm) to allow you to use multiple Node versions at once, but it is not required. Make sure the Node version matches the [package.json](package.json).
2. Install Git on your computer. This is a command-line tool which comes with most operating systems (Linux and MacOS), but is not included with Windows. Windows users will need to install this separately.
3. `cd` into the directory where you want to put zSnout. This will be the parent folder for a seperate folder containing the repository. You can do this by running `cd {FOLDER}`.
4. Clone the repository using `git`. You can do this by running `git clone https://github.com/zsnout/zsnout.com.git`. If you wish to name the repo folder something other than `zsnout.com`, append it the the command: `git clone https://github.com/zsnout/zsnout.com.git {FOLDER}`.
5. Copy the `.env_template` file as `.env` file. This file is a template for `.env`, as we do not keep the original on GitHub for security reasons. Then, change `ROOT` to be a path pointing to the repo directory WITHOUT A TRAILING SLASH. Additionally, change `HOME` to `http://localhost:3000` if it is not that already.
6. Copy the `database_template.json` file as `database.json`. This is a template for the database, as we do not keep the original on GitHub for security reasons.
7. `cd` into the repo and run `npm start`. When using NVM, this may require `nvm exec 16 npm start`.
8. A custom terminal for the Node process should appear. This allows you to execute any JavaScript you want in the context of the program. You may learn more about this in the [Terminal](#built-in-terminal) section of the README.
