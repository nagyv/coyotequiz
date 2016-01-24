'use strict';

function listQuizzes() {
    fs.readdir(quiz_repo, function(err, files) {
        files.map(function(file) {
            let quiz_json = quiz_repo + '/' +  file + '/quiz.json';
            fs.access(quiz_json, fs.R_OK, function(err) {
                if(err) {
                    console.log('No quiz.json exists', quiz_json);
                    return;
                };
                fs.readFile(quiz_json, 'utf8', function (err, data) {
                  if (err) throw err;
                  let quiz = _.extend({
                    "id": file,
                  }, JSON.parse(data))
                  Quizzes.add(new Quiz(quiz));
                });
            })
        });
    });
}

setup(listQuizzes)