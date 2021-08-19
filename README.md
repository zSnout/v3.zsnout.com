This is source code for a NodeJS version of zSnout.com. zSnout hopes to upgrade our systems to use this, as we are currently running on PHP.

## Directories

- [db](/db): This is where all of the database magic happens. For example, if a route needs user information, they can use `user.js`.

- [layouts](/layouts): This is where all EJS layouts are put. A layout can be requested by a view via the `layout` function.

- [mail](/mail): This is where all mail interactions happen, such as verification emails.

- [public](/public): This is the project's static directory. Anything put here can directly be accessed via the site.

- [routes](/routes): This is where routes are defined. They are then `require`d by the main server file when initialized.

- [views](/views): This is where all EJS views are put. A view can be requested to be sent as a response by a route.

## Files

- [bcrypt.js](/bcrypt.js): This is a short file to make the `bcryptjs` API easier to work with.

- [layout.ejs](/layout.ejs): The index layout. All views get passed through this before being sent as a response.

- [server.js](/server.js): The main server file, and what is run in `npm run start`.
