# ProjX Portal

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How To](#how-to)
  - [Setup](#setup)
  - [Running Server](#running-server)
- [Style/Design Guide](#styledesign-guide)
  - [Front End](#front-end)
  - [Session and Authentication](#session-and-authentication)
  - [Server](#server)
    - [Models](#models)
    - [Routes](#routes)
    - [Database](#database)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How To

### Setup

First install `node`, `npm`, `MongoDB`, and `gulp`.

To build:
```
gulp update
```

To deploy certificate authentication server (user any ):
```
chmod +x bin/deploy-auth
./bin/deploy-auth [username]
```
Then type `username`'s password on MIT athena server.

### Running Server

\*\*NOTE\*\*: You must manually include `server/config.js` and `auth-server/config.php` (not included in repo) to run the server.

For dev:
```
gulp
```

To start:
```
mongod
node bin/www
```

## Style/Design Guide

Generally, be as consistent as possible with existing code. The style guide is just a tool to use to be more consistent.

Follow the specifications in `.editorconfig` for code spacing. For comments, prefer full sentences. Block comments should start with `/**` and each line preceded by a `*`.

In general, null is used to signify the absence of something. For example, if a currentUser object is null, that means there is no user logged in. Errors are signified by the appropriate HTTP code or by a non-null first argument in the callback idiom.

### Front End

The Angular app is divided into views, components, and providers. Providers contain commonly used code and can be injected into Angular controllers. Each view or component is contained in a folder with its own HTML, Sass, and JavaScript files. The app is built by concatenating and compiling/minifying all the Sass files and all the JavaScript files, producing `projx.min.css` and `projx.min.js`, respectively.

All the static assets of the site are in the `assets` folder grouped by file type, except third party libraries which are all in `assets/lib`.

All client code is imported into `index.html`, which should be served by the backend for any request other than API calls.

### Session and Authentication

The identity of a logged in user is maintained as a session (accessible at `req.session` on the server and handled behind the scenes via cookies).

Initial authentication of MIT certificates is processed on an MIT server, the protocol for which is detailed [here](https://github.com/vfazel/mit-cert-auth).

Each API call that request data must be authenticated server-side to maintain desired security. This is implemented as middleware that allows a request to go through only if the required permission level conditions are met. There are five different levels of permissions:
- **none** - No conditions. This is used for public data.
- **auth** - The user is logged in.
- **team** - When a projectId is passed as the parameter, the logged in user is in that project's team, or the user is an admin.
- **user** - When a user's email is passed as the parameter, the logged in user matches that user, or the user is an admin.
- **admin** - The user is an admin.

### Server

#### Models

Models should contain only Mongoose schema; keep all actual logic out of models. The only exception is validation: models can have a `validate` method that take a JSON object and assert desired internal properties of the model (e.g. primary contact of project must be on the team).

Fields that are needed for successful code execution should be marked required in the schema; fields that are merely needed for the information to make contextual sense should not be marked required.

#### Routes

Most of the server logic is in the routes, so code is organized according to endpoint path. Common blocks of code can be grouped by category and placed in helper files in the helpers folder.

Routes with the same prefixes are placed in the same files. For example, all routes that begin `/api/user` are placed in `user.js` and mounted at `/api/user` in `app.js`.

Because the front end is a single-page application, by convention all routes that aren't prefixed by `/api` serve `index.html` and all other routes must have prefix `/api`.

API Endpoints should be documented with the first line having the following (all space-separated):
- HTTP method
- path
- permission level (none, auth, team, user, admin)
- description

There may be subsequent lines that begin with `@param` followed by the parameter type in curly braces, the location of the parameter in the `req` object, and finally a description after a dash. Example:
```
/**
 * POST /team/add [team] Add a user to a project's team
 * @param {string} req.body.projectId - id of project
 * @param {string} req.body.email - email of user to be added
 */
```

#### Database

In writing Mongoose queries, use findOne when expecting one result and find in any other case. All query callbacks should begin with `if (err) cb(err);` to propagate errors. It is acceptable for queries with findOne to skip handling documents that don't exist and callback on a null result. A callback function should always handle null results.
