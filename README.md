# ProjX Portal

To build (assuming you have `gulp`):
```
gulp update
```

## Certificate Authentication Server Deployment
```
chmod +x bin/deploy-auth
./bin/deploy-auth [username]
```
Then type `username`'s password on MIT athena server.

## ProjX Website Deployment

1. Clone the repo on the machine you want to use: 
    * `$ git clone https://github.com/techx/projx-web.git` via https, or
    * `$ git clone git@github.com:techx/projx-web.git` via ssh.

2. Make sure to have `npm` and `node` installed. If `gulp` is not already installed, you can do so globally with:
    * `$ npm install -g gulp` and locally without the `-g` flag. 

3. run `$ npm install` to install all the necesary dependencies.

4. create a file called `config.json`. this file will store a bunch of settings, and will end up looking something like this:
```JSON
{
    "mongoUri":"data", // may be more complex if db is actually secure.
    "loginUrl": "http://projx.mit.edu/api/user/login",
    "scriptsUsername":"vfazel",
    "scriptsPath":"/projx",
    "authSecret":"insert_some_secret_here",
    "cookieSecret":"insert_secret_here",
    "appsOpen":true, // tell whether or not the apps are open or not.
    "cycle": "Spring 2018"
}
```

5. for rapid development start: `$ gulp`

6. for production start: 
    ```
    $ mongod
    $ node bin/www
    ```

## Opening and closing apps:
go into the `config.json` and change the following: 
`"appsOpen":<if you want to have apps be closed or not>`
You can also change the current cycle in the portal with `"cycle"`, however it will not change the cycle that is on the splash page. you will have to change those mentions yourself.

after you have changed everything, restart the node app:
use `$ ps aux` to locate the node process, terminate it, then restart it with `$ node bin/www`



Must include `config.js` and `auth-server/config.php` (not included in repo) to work.