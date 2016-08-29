# ProjX Portal

## Setup

To build (assuming you have `gulp`):
```
gulp update
```

To deploy certificate authentication server:
```
chmod +x bin/deploy-auth
./bin/deploy-auth [username]
```
Then type `username`'s password on MIT athena server.

For dev:
```
gulp
```

To start:
```
mongod
node bin/www
```

\*\*NOTE\*\*: Must include `server/config.js` and `auth-server/config.php` (not included in repo) to work.


## Style Guide

Generally, be as consistent as possible with existing code. The style guide is just a tool to use to be more consistent.

#### API Endpoints
Endpoints should be documented with the first line having the HTTP method, path, permission level, and description, all space separated. There may be subsequent lines that begin with @param followed by the location of the parameter in the req object and finally a description. Example:
```
/**
 * POST /team/add [team] Add a user to the team
 * @param req.body.projectId - id of project
 * @param req.body.email - email of user to be added
 */
```
