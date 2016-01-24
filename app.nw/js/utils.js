'use strict';
var fs = require('fs');
const quiz_repo = '../quizzes';

function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
}

function setup(callback) {
    fs.access(quiz_repo, fs.R_OK | fs.W_OK, function(err) {
        console.log(err ? 'quizzes dir does not exist' : 'quizzes dir exists');
        if(err) {
            fs.mkdir(quiz_repo, function(err) {
                if(err) {
                    alert('Could not create quiz repository. Quitting.');
                    nw.App.quit();
                } else {
                    ready(callback());
                }
            })
        } else {
            ready(callback());
        }
    });
}

var Quiz = Backbone.Model.extend({});
var Quizzes = new (Backbone.Collection.extend({
    model: Quiz
}))()