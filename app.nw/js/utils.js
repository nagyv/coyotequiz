'use strict';
var fs = require('fs');
var uuid = require('uuid');
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

function writeQuiz(uid, data, cb) {
    if(!uid) {
        uid = uuid.v1();
        let err = fs.mkdirSync(quiz_repo + '/' + uid);
        if(err) {
            alert("Could not save quiz. Please report this!");
            cb(err);
            return;
        }
    }

    let base_dir = quiz_repo + '/' +  uid;
    fs.writeFile(base_dir + '/quiz.json', JSON.stringify(data), function(err) {
        if (err) throw err;
        // TODO: move the images
        cb(err);
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