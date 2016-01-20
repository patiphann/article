# Article mean stack basic

## Prerequisite Technologies
### Linux
* *Node.js* - <a href="https://nodejs.org/en/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *MongoDB* - <a href="https://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="https://docs.mongodb.org/manual/">Checkout their manual</a> if you're just starting.

If you're using ubuntu, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.
* *Redis* - <a href="http://redis.io/download">Download</a> and Install Redis.

### Windows
* *Node.js* - <a href="https://nodejs.org/en/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *MongoDB* - Follow the great tutorial from the mongodb site - <a href="https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/">"Install Mongodb On Windows"</a>
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing <a href="http://git-scm.com/download/win">Git for Windows</a>
* *Redis* - <a href="http://redis.io/download">Download</a> and Install Redis.

### OSX
* *Node.js* -  <a href="https://nodejs.org/en/">Download</a> and Install Node.js or use the packages within brew or macports.
* *MongoDB* - Follow the tutorial here - <a href="https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/">Install mongodb on OSX</a>
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.
* *Redis* - <a href="http://redis.io/download">Download</a> and Install Redis.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

### Install project

```bash
$ git clone git://github.com/patiphann/article.git
$ cd article
$ npm install
$ bower install --allow-root
```

### Invoke node with a task manager

To start your application run:
```bash
$ node server
```
Then, open a browser and go to:
```bash
http://localhost:3000
```

### Invoke node with a task manager for test mocha
```bash
$ mocha test
```

### Invoke node with a task manager for developer
```bash
$ gulp
```

#### Installation problems on Windows 8 / 8.1
Some of project dependencies uses [node-gyp](https://github.com/nodejs/node-gyp) with supported Python version 2.7.x. So if you see an error related to node-gyp rebuild follow next steps:

1. install [Python 2.7.x](https://www.python.org/downloads/)
2. install [Microsoft Visual Studio C++ 2012 Express](http://www.microsoft.com/en-us/download/details.aspx?id=34673)
3. Run NPM update

```bash
$ npm update -g
```