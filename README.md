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
    "mongoUri":"mongodb://localhost:27017/projx",
    "loginUrl": "localhost:5000/api/user/login",
    "scriptsUsername":"vfazel",
    "scriptsPath":"/projx",
    "authSecret":"insert_some_secret_here",
    "cookieSecret":"insert_secret_here",
    "appsOpen":true,
    "cycle": "Spring 2018",
    "development": true,
    "devEmail": "agolla@mit.edu",
    "devName": "Anurag Golla",
    "upcomingEventName": "PROJXPO 2019", 
    "upcomingEventDate": "May 18, 2019 19:00:00",
    "projxTeam": {
        "Rachel Groberman": "rachelgr@mit.edu",
        "Anton Cao": "antoncao@mit.edu",
        "Anurag Golla": "agolla@mit.edu"
    }
}
```

5. for rapid development start: `$ gulp`, and if you encounter any difficulties with authentication follow "Bypass Certificate Authentication" below.

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


## Bypass Certificate Authentication

1. install local mongodb: `https://docs.mongodb.com/manual/installation/`

2. open terminal and run: `$ mongod`

3. open another terminal and run: `$ mongo`

4. In the mongo shell, create database "projx": `> use projx`

5. In projx database create "users" collection: `> db.createCollection("users")`

6. Create your own user profile with an email address and full name: `>  db.users.insert({"email":"YOUR_EMAIL_HERE","name":"YOUR_NAME_HERE","isAdmin":true})`. Shutdown mongodb with `> exit`. 

7. Update `devEmail` and `devName` in `config.json` accordingly to the projile you created in step 6. 

8. Change `mongoUri` in `config.json` from `"data"` to `"mongodb://localhost:27017/projx"`. 

9. For development start, run `$ mongod` in one terminal and `$ gulp` in another terminal in the directory of the projx folder.
