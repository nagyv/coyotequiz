'use strict';

function listQuizzes() {
    fs.readdir(quiz_repo, function(err, files) {
        files.map(function(file){
            loadQuiz(file, function(model){
                Quizzes.add(model);
            });
        });
    });
}

setup(listQuizzes)