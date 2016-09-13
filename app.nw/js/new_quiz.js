'use strict';

function startUp() {
    let currentId = getQueryVariable('id');
    if (currentId) loadQuiz(currentId, renderQuiz);
    else renderQuiz()
}

setup(startUp);