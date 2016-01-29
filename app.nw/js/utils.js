'use strict';
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
const quiz_repo = 'quizzes';

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
    fs.exists(quiz_repo, function(exists) {
        console.log(exists ? 'quizzes dir exists' : 'quizzes dir does not exist');
        if(!exists) {
            fs.mkdir(quiz_repo, function(err) {
                if(err) {
					alert("Nem tudtam létrehozni a kvíz könyvtárat");
                } else {
					ready(callback);
				}
            })
        } else {
            ready(callback);
        }
    });
}

function loadQuiz(id, cb) {
    let quiz_json = path.join(quiz_repo, id, 'quiz.json');
    fs.access(quiz_json, fs.R_OK, function(err) {
        if(err) {
            console.log('No quiz.json exists', quiz_json);
            return;
        };
        fs.readFile(quiz_json, 'utf8', function (err, data) {
          if (err) throw err;
          let quiz = _.extend({
            "id": id,
          }, JSON.parse(data))
          cb(new Quiz(quiz))
        });
    });
}

function writeQuiz(uid, data, cb) {
    if(!uid) {
        uid = uuid.v1();
        let err = fs.mkdirSync(path.join(quiz_repo, uid));
        if(err) {
            alert("Could not save quiz. Please report this!");
            cb(err);
            return;
        }
    }

    let base_dir = path.join(quiz_repo, uid);

    // collect and move images
    // TODO: this should be done in sync
    data.questions = _.map(data.questions, function(question){
        if(question.image) {
			let exists = fs.existsSync(path.join(base_dir, path.basename(question.image)))
			if(!exists) {
				let filename = uuid.v1() + '.' + question.image.split('.')[1];
				fs.createReadStream(question.image).pipe(fs.createWriteStream(path.join(base_dir, filename)));
				question.image = filename;
			} else {
				let filename = question.image.split(path.sep).splice(-1)[0];
				question.image = filename;
			}
        }
        return question;
    });

    fs.writeFile(path.join(base_dir, 'quiz.json'), JSON.stringify(data), function(err) {
        if (err) throw err;
        cb(err);
    });
}

var Quiz = Backbone.Model.extend({
    getImagePath: function(question) {
        if(!this.get('questions')[question].image) return false;
        return fs.realpathSync(path.join(quiz_repo, this.id, this.get('questions')[question].image));
    }
});
var Quizzes = new (Backbone.Collection.extend({
    model: Quiz
}))()