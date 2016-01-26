'use strict';

function loadQuiz(id) {
    let quiz_json = quiz_repo + '/' +  id + '/quiz.json';
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
          renderQuiz(new Quiz(quiz))
        });
    });
}

function getImagePath(file) {
    return quiz_repo + '/' + id + '/quiz.json';
}

function startUp() {
    let currentId = getQueryVariable('id');
    if (currentId) loadQuiz(currentId);
    else renderQuiz()
}

setup(startUp);