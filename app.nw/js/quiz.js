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
    loadQuiz(getQueryVariable('id'));
}

setup(startUp);

//var baseDir = 'images';
//function showPage(pagenum) {
//	$("#page").slideUp("slow", function(){
//		var page = $("#page" + pagenum + "_fields");
//		$("#pageTitle").text(pagenum + ". oldal");
//		$("#questionText").text(page.find("input.question").val());
//		$("#question").attr("src", baseDir + "/" + page.find('input[type="file"]').val());
//		$("#answers").empty();
//		page.find("input.answer").each(function(i){
//			var current = this;
//			$("#answers").append('<li><button type="button" id="answer_' + i + '">' + this.value + '</button></li>');
//			$("#answer_" + i).click(function(){showPage($("#" + current.id + "_goto").val())});
//		});
//		$("#page").slideDown("slow");
//	});
//};
//function generateForm(pages){
//	$("#questionsDiv").empty();
//	var pages = Number(pages);
//	for(var i=1; i<=pages; i++) {
//		generateFieldSet(i, pages);
//	};
//	$("#page1_file").focus();
//};
//function generateFieldSet(page, pages) {
//	var baseSet = '<fieldset id="pageX_fields" >' +
//		'<legend>X. oldal</legend>' +
//		'<div class="ctrlHolder multiField">' +
//		'<label for="pageX_file" class="blockLabel">Kép</label>' +
//		'<input type="file" id="pageX_file" name="pageX_file" class="fileUpload" />' +
//		'<label for="pageX_question" class="blockLabel">Kérdés</label>' +
//		'<input type="text" id="pageX_questions" name="pageX_question" class="question textInput" />' +
//		'</div>' +
//		'<div class="ctrlHolder multiField">' +
//		'<label for="pageX_q1" class="blockLabel">Első válasz</label>' +
//		'<input type="text" id="pageX_q1" name="pageX_q1" class="answer textInput" />' +
//		'<label for="pageX_q1_goto" class="blockLabel">Érkezik</label>' +
//		'<select id="pageX_q1_goto">' +
//		'</select>' +
//		'</div>' +
//		'<div class="ctrlHolder multiField">' +
//		'<label for="pageX_q2" class="blockLabel">Második válasz</label>' +
//		'<input type="text" id="pageX_q2" name="pageX_q2" class="answer textInput" />' +
//		'<label for="pageX_q2_goto" class="blockLabel">Érkezik</label>' +
//		'<select id="pageX_q2_goto">' +
//		'</select>' +
//		'</div>' +
//		'<div class="ctrlHolder multiField">' +
//		'<label for="pageX_q3" class="blockLabel">Harmadik válasz</label>' +
//		'<input type="text" id="pageX_q3" name="pageX_q3" class="answer textInput" />' +
//		'<label for="pageX_q3_goto" class="blockLabel">Érkezik</label>' +
//		'<select id="pageX_q3_goto">' +
//		'</select>' +
//		'</div>' +
//	'</fieldset>';
//	$("#questionsDiv").append(baseSet.replace(/X/g, page));
//	for(var i=1; i<=pages; i++) {
//		if (i != page) {
//	  	$("select#page" + page + "_q1_goto").append('<option value="' + i + '">' + i + '. oldal</option>')
//			$("select#page" + page + "_q2_goto").append('<option value="' + i + '">' + i + '. oldal</option>')
//			$("select#page" + page + "_q3_goto").append('<option value="' + i + '">' + i + '. oldal</option>')
//	  };
//	};
//};
//$(document).ready(function(){
//	$("#pagenumForm").submit(function(e){
//		e.preventDefault();
//		generateForm($("#pagenum").val());
//		$("#questions").show();
//	});
//	$("#questions").submit(function(e){
//		e.preventDefault();
//		$("#form").slideUp("slow", showPage(1));
//		});
//	$("#reset").click(function(){
//		$("#page").slideUp("slow", function(){
//			$("#form").slideDown("slow");
//		});
//	});
//	$('#pagenum').focus();
//});