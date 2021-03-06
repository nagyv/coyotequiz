'use strict';

var SummaryComponent = React.createClass({
    displayName: "SummaryComponent",

    mixins: [Backbone.React.Component.mixin],
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h2",
                null,
                "Összegzés"
            ),
            React.createElement(
                "dl",
                null,
                React.createElement(
                    "dt",
                    null,
                    "Eltöltött idő"
                ),
                React.createElement(
                    "dd",
                    null,
                    this.props.time_spent
                ),
                React.createElement(
                    "dt",
                    null,
                    "Kérdések száma"
                ),
                React.createElement(
                    "dd",
                    null,
                    this.state.model.questions.length
                ),
                React.createElement(
                    "dt",
                    null,
                    "Válaszok száma"
                ),
                React.createElement(
                    "dd",
                    null,
                    this.props.num_answers
                )
            ),
            React.createElement(
                "a",
                { className: "btn btn-success", href: "index.html" },
                "Kvíz lista"
            )
        );
    }
});

var QuizComponent = React.createClass({
    displayName: "QuizComponent",

    mixins: [Backbone.React.Component.mixin],
    availableBtnClasses: ['hvr-grow', 'hvr-shrink', 'hvr-pulse', 'hvr-pulse-grow', 'hvr-pulse-shrink', 'hvr-push', 'hvr-pop', 'hvr-bounce-in', 'hvr-bounce-out', 'hvr-rotate', 'hvr-sink', 'hvr-bob'],
    getInitialState: function () {
        return {
            current: 0,
            num_answers: 0,
            started: Date.now(),
            finished: false
        };
    },
    getQuestion: function () {
        return this.state.model.questions[this.state.current];
    },
    handleClick: function (event) {
        if (event.target.dataset.goto == -1) {
            let finished = Date.now();
            this.setState({
                num_answers: ++this.state.num_answers,
                time_spent: finished - this.state.started,
                finished: true
            });
        } else {
            this.setState({
                'current': event.target.dataset.goto,
                num_answers: ++this.state.num_answers
            });
        }
    },
    createAnswer: function (answer) {
        let hoverClass = _.sample(this.availableBtnClasses);
        return React.createElement(
            "a",
            { className: "col-xs-6 btn btn-primary " + hoverClass, "data-goto": answer.goto, onClick: this.handleClick },
            answer.text
        );
    },
    createQuestion: function () {
        let currentQuestion = this.getQuestion();
        let asset;
        if (this.props.model.getImagePath(this.state.current)) {
            let imagePath = this.props.model.getImagePath(this.state.current);
            asset = React.createElement("img", { className: "img-responsive center-block", src: "file://" + imagePath });
        } else if (this.props.model.getVideoPath(this.state.current)) {
            let assetPath = this.props.model.getVideoPath(this.state.current);
            asset = React.createElement(ReactPlayer, { width: "", controls: true, playing: true, url: "file://" + assetPath });
        } else {
            asset = '';
        }

        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { id: "question" },
                React.createElement(
                    "h2",
                    { className: "qtext" },
                    currentQuestion.question
                ),
                asset
            ),
            React.createElement(
                "div",
                { className: "row" },
                currentQuestion.answers.map(this.createAnswer)
            )
        );
    },
    createSummary: function () {
        return React.createElement(SummaryComponent, { model: this.props.model, time_spent: this.state.time_spent, num_answers: this.state.num_answers });
    },
    render: function () {
        let mainContent;
        if (this.state.finished) {
            mainContent = this.createSummary();
        } else {
            mainContent = this.createQuestion();
        }

        return React.createElement(
            "div",
            { className: "container" },
            React.createElement(
                "h1",
                null,
                this.state.model.name
            ),
            mainContent
        );
    }
});

function renderQuiz(quiz) {
    ReactDOM.render(React.createElement(QuizComponent, { model: quiz }), document.body);
}