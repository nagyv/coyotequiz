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

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
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

var Quiz = Backbone.Model.extend({
    getImagePath: function(question) {
        if(!this.get('questions')[question].image) return false;
        return quiz_repo + '/' + this.id + '/' + this.get('questions')[question].image;
    }
});
var Quizzes = new (Backbone.Collection.extend({
    model: Quiz
}))()