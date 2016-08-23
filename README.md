# ProjX Portal

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

Must include `server/config.js` and `auth-server/config.php` (not included in repo) to work.

## specs
- splash page has full-page logo
