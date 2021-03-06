'use strict';
const Fs = require('fs');
const Path = require('path');
const Uuid = require('uuid');
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
    Fs.exists(quiz_repo, function(exists) {
        console.log(exists ? 'quizzes dir exists' : 'quizzes dir does not exist');
        if(!exists) {
            Fs.mkdir(quiz_repo, function(err) {
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
    let quiz_json = Path.join(quiz_repo, id, 'quiz.json');
    Fs.access(quiz_json, Fs.R_OK, function(err) {
        if(err) {
            console.log('No quiz.json exists', quiz_json);
            return;
        };
        Fs.readFile(quiz_json, 'utf8', function (err, data) {
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
        uid = Uuid.v1();
        let err = Fs.mkdirSync(Path.join(quiz_repo, uid));
        if(err) {
            alert("Could not save quiz. Please report this!");
            cb(err);
            return;
        }
    }

    let base_dir = Path.join(quiz_repo, uid);

    // collect and move images
    // TODO: this should be done in sync
    const writeAsset = function(base_dir, asset) {
        let exists = Fs.existsSync(Path.join(base_dir, Path.basename(asset)))
        if(asset.indexOf(base_dir) !== -1) {
            return asset.split(Path.sep).splice(-1)[0];
        } else {
            let filename = Uuid.v1() + '.' + asset.split('.')[1];
            Fs.createReadStream(asset).pipe(Fs.createWriteStream(Path.join(base_dir, filename)));
            return filename;    
        }
    } 

    data.questions = _.map(data.questions, function(question){
        console.log(base_dir, question.image);
        if(question.image) {
			question.image = writeAsset(base_dir, question.image);
        } 
        else if (question.video) {
            question.video = writeAsset(base_dir, question.video);
        }
        return question;
    });

    Fs.writeFile(Path.join(base_dir, 'quiz.json'), JSON.stringify(data), function(err) {
        if (err) throw err;
        cb(err);
    });
}

var Quiz = Backbone.Model.extend({
    getAssetPath: function(asset, question) {
        if(!this.get('questions')[question][asset]) return false;
        return Fs.realpathSync(Path.join(quiz_repo, this.id, this.get('questions')[question][asset]));
    },
    getImagePath: function(question) {
        return this.getAssetPath('image', question);
    },
    getVideoPath: function(question) {
        return this.getAssetPath('video', question);
    }
});
var Quizzes = new (Backbone.Collection.extend({
    model: Quiz
}))()
