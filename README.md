# ProjX Portal

## Getting Set Up

### Requirements

0. Install (if not already):
    * [mongodb](https://docs.mongodb.com/manual/installation/) (Community Edition)
    * [node](https://nodejs.org/en/)
    * [git](https://git-scm.com/downloads)

### MongoDB

1. In a terminal, run

```
$ mongod
```

If you get permissions errors, you may need to use `$ sudo mongod`. If the command is not recognized, you will need to add the Mongo bin folder to your path, using this: https://stackoverflow.com/a/41507803.
You probably also need to create the `/data/db` folder. If you're on a Mac, you may need to create the folder elsewhere and specify the new path, e.g. using `$ mongod --dbpath=/Users/user/data/db` instead.


2. In another terminal, run

```
$ mongo
```

This should give you a shell prompt.

3. In the mongo shell, create the "projx" database.

```
> use projx
```

4. Create the "users" collection in the "projx" database.

```
> db.createCollection("users")
```

5. Create your own user profile with an email address and full name:

```
>  db.users.insert({ "email": "youremail@mit.edu", "name": "Your Name", "isAdmin": true })
```

6. Leave the mongo shell. But leave `mongod` running!

```
> exit
```

### Node

1. Clone the repo.

```
$ git clone https://github.com/techx/projx-web.git
$ cd projx-web
```

2. Make sure you have `npm` installed (it should come with node).
   Install all the necessary dependencies.

```
$ npm install
```

3. Install gulp.

```
$ npm install -g gulp
```

4. Create a file called `config.json`.
   (Note: If you are on Windows make sure your file extensions are correct.)
   This file is not committed and stores instance-specific settings.
   Copy and paste the following into that file, and change "devEmail" and "devName".

```JSON
{
    "devEmail": "youremail@mit.edu",
    "devName": "Your Name",
    "mongoUri": "mongodb://localhost:27017/projx",
    "loginUrl": "localhost:5000/api/user/login",
    "scriptsUsername": "vfazel",
    "scriptsPath": "/projx",
    "authSecret": "insert_some_secret_here",
    "cookieSecret": "insert_secret_here",
    "appsOpen": true,
    "openDate": "February 6, 2021",
    "deadline": "11:59pm Sunday, February 23",
    "resumeLink": "url_to_submit_resumes",
    "cycle": "Spring 2021",
    "development": true,
    "resumeSecretKey": "blah"
}
```

[Possibly deprecated]
~~Note: `resumeSecretKey` should match `PORTAL_SECRET` in the ProjX resume upload app.~~

5. For local development, just use gulp.
   (Make sure `mongod` is still running in a different terminal.)

```
$ gulp
```

### Production

The website is hosted on an AWS box. To access the box, see TechX DevOps Wiki instructions. Note that if you are not on MIT Wifi, you will need to connect to the MIT VPN via the Cisco client.

The production system uses the `forever` package to monitor the process.

```
$ node bin/www
```
or
```
$ forever start bin/www
```
and
```
$ forever list
$ forever stop [index]
```

## Opening and Closing Apps

1. In `config.json`, change the following parameters:
    * `appsOpen` - this is a Boolean (`true` or `false`)
    * `openDate` - the date applications open(ed)
    * `deadline` - the date applications are due
    * `resumeLink` - Dropbox link for submitting applications
    * `cycle` - name of the application cycle

Each application cycle, you will need to update `appsOpen` twice
and each of the other parameters once.

2. After you have changed everything, you need to restart the node app.
   Locate the node process and terminate it.

```
$ ps aux | grep projx
$ kill <PROCESS_ID>
```

3. If the monitoring system doesn't automatically restart it, then restart with
   `$ node bin/www`.

## Note on gulp 3 and node 12

**tl;dr**
You need to checkout the upstream version of `npm-shrinkwrap.json` each time
you want to rerun `npm install`.

This project uses gulp v3, which has been causing issues with newer versions
of node. The `npm-shrinkwrap.json` file used here as a workaround to be able
to use both together, per the fix from
[Tim Kamanin](https://timonweb.com/javascript/how-to-fix-referenceerror-primordials-is-not-defined-error/)
(referenced in this [answer on SO](https://stackoverflow.com/a/60921145)).

As intended, `npm-shrinkwrap.json` is modified when `npm install` is run.
Unfortunately for us, rerunning `npm install` afterwards, even with the same
`npm-shrinkwrap.json` (or even changing it to a `package-lock.json`), somehow
installs the wrong set of package versions once again, and we get issues with
gulp yet again.

So in case you really need to `npm install` multiple times, the current
workaround is to *not* commit changes to `npm-shrinkwrap.json` after the
initial commit, and to replace its contents with [this](npm-shrinkwrap.json)
each time before you need to `npm install` again.

(The long-term fix, probably, in case someone wants to work on it, would be
to update gulp from v3 to v4. This in itself doesn't take long at all.
But you would just need to make sure that everything on the AWS boxes is
also up to date and working correctly with a new setup.)
