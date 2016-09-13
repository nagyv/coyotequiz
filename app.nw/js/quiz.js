'use strict';

function getImagePath(file) {
    return quiz_repo + '/' + id + '/quiz.json';
}

function startUp() {
    loadQuiz(getQueryVariable('id'), renderQuiz);
}

setup(startUp);
