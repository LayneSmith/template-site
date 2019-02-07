# Gulp 4 build template for web projects
This is my current starting point for static html projects.

## Features
* `src` to `dist` pattern
* `browsersync` for live previews
* `*.html` copied to `dist`
* `imagemin` image optimization
* `broswerify` `babelify` `uglify` and `sourcemap` all `*.js` files.
* `sass` `autoprefixer` `cssnano` `sourcemap` all `*.css` files.
* Watches all `.html` `.scss` `.js` `images/*.*` files

## Prerequisites
Install these first, if you haven't already.
* Node
* NPM
* Gulp

## Installing
* `git clone` this repo
* `git init` to start your own repo
* Make sure your `.gitignore` file is accurate
* `git add .` to add all files
* `git commit -m "Initial commit"` to get it started
* Go to GitHub and create a new repo, follow the instructions.
* In Terminal, navigate to your project directory and run `npm install`
* Run `gulp` to spin up the development server and monitor changes

## Using
Running `gulp` will initiate the process and start watching and updating the previews.

Running `gulp publish` will remove all comments and logs and create fresh copies of `dist` files. 
