'use strict';

function getImagePath(file) {
    return quiz_repo + '/' + id + '/quiz.json';
}

function startUp() {
    let currentId = getQueryVariable('id');
    if (currentId) loadQuiz(currentId, renderQuiz);
    else renderQuiz()
}

setup(startUp);