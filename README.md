# Envirotech Widget

An HTML search widget for the [webservices](https://github.com/GovWizely/webservices) Envirotech endpoint.

For instructions on how to embed this widget into your website, [go here](http://govwizely.github.io/envirotech-widget).

## Developers

You need to have `node` and `npm` installed on your system.

The widget distribution code is built with [BroccoliJS](https://github.com/broccolijs/broccoli). To install Broccoli and all other dependencies:

    npm install -g broccoli-cli
    npm install

You also need to install bower components:

    npm install -g bower
    bower install

Then to serve:

    broccoli serve

You can then view your work on http://localhost:4200/example.html

In order to apply your code changes to the gh-pages demo site, run:

    gulp gh-pages

The command will leave you checked out on the gh-pages branch. You can then push to that branch, or make further code adjustments first before doing so. If you'd like to test you work first, run:

    jekyll serve

(you need to install `jekyll` on your system first), then visit http://localhost:4000
