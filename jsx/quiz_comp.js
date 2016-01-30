'use strict';

var SummaryComponent = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    render: function() {
        return <div><h2>Összegzés</h2>
            <dl>
            <dt>Eltöltött idő</dt>
            <dd>{this.props.time_spent}</dd>
            <dt>Kérdések száma</dt>
            <dd>{this.state.model.questions.length}</dd>
            <dt>Válaszok száma</dt>
            <dd>{this.props.num_answers}</dd>
            </dl>
            <a className="btn btn-success" href="index.html">Kvíz lista</a>
            </div>;
    }
});

var QuizComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  availableBtnClasses: ['hvr-grow', 'hvr-shrink', 'hvr-pulse', 'hvr-pulse-grow', 'hvr-pulse-shrink', 'hvr-push',
    'hvr-pop', 'hvr-bounce-in', 'hvr-bounce-out', 'hvr-rotate', 'hvr-sink', 'hvr-bob'],
  getInitialState: function() {
    return {
        current: 0,
        num_answers: 0,
        started: Date.now(),
        finished: false
    };
  },
  getQuestion: function() {
    return this.state.model.questions[this.state.current];
  },
  handleClick: function(event) {
    if(event.target.dataset.goto == -1) {
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
  createAnswer: function(answer) {
    let hoverClass = _.sample(this.availableBtnClasses);
    return <a className={"col-xs-6 btn btn-primary " + hoverClass} data-goto={answer.goto} onClick={this.handleClick}>{answer.text}</a>;
  },
  createQuestion: function() {
    let currentQuestion = this.getQuestion();
    let image;
    if(this.props.model.getImagePath(this.state.current)) {
        let imagePath = this.props.model.getImagePath(this.state.current);
        image = <img className="img-responsive center-block" src={"file://" + imagePath} />;
    } else {
        image = '';
    }

    return <div><div id="question">
            <h2 className="qtext">{currentQuestion.question}</h2>
            {image}
        </div>
        <div className="row">
        {currentQuestion.answers.map(this.createAnswer)}
        </div></div>;
  },
  createSummary: function() {
    return <SummaryComponent model={this.props.model} time_spent={this.state.time_spent} num_answers={this.state.num_answers} />;
  },
  render: function () {
    let mainContent;
    if(this.state.finished) {
        mainContent = this.createSummary();
    } else {
        mainContent = this.createQuestion();
    }

    return <div className="container">
        <h1>{this.state.model.name}</h1>
        {mainContent}
        </div>;
  }
});

function renderQuiz(quiz) {
    ReactDOM.render(<QuizComponent model={quiz} />, document.body);
}