'use strict';

var Question = Backbone.Model.extend({});
var Questions = Backbone.Collection.extend({
    model: Question,
    asQuizJSON: function() {
        var cid2idx = _.fromPairs(this.models.map(function(question, idx) {
            return [question.cid, idx];
        }));
        return this.models.map(function(question){
            // create the answers list
            let answers = _.filter([1,2,3,4], function(idx){
                // use only answers with a text
                return question.get('answer' + idx) != '';
            }).map(function(idx){
                // create the answer object
               return {
                    text: question.get('answer' + idx),
                    goto: question.get('goto' + idx) == -1 ? -1 : cid2idx[question.get('goto' + idx)],
                    }
            });
            return {
                question: question.get('text'),
                image: question.get('image'),
                video: question.get('video'),
                answers: answers
                };
        });
    },
    fromQuiz: function(quiz) {
        let questions = quiz.get('questions').map(function(question, idx){
            return new Question({
                'text': question.question,
                'image': quiz.getImagePath(idx),
                'video': quiz.getVideoPath(idx),
                'answer1': question.answers[0] ? question.answers[0].text : '',
                'goto1': question.answers[0] ? question.answers[0].goto : -1,
                'answer2': question.answers[1] ? question.answers[1].text : '',
                'goto2': question.answers[1] ? question.answers[1].goto : -1,
                'answer3': question.answers[2] ? question.answers[2].text : '',
                'goto3': question.answers[2] ? question.answers[2].goto : -1,
                'answer4': question.answers[3] ? question.answers[3].text : '',
                'goto4': question.answers[3] ? question.answers[3].goto : -1,
            });
        })
        // update the goto elements to point to the cid of each question
        var idx2cid = _.fromPairs(questions.map(function(question, idx) {
            return [idx, question.cid]
        }));
        _.each(questions, function(question){
           _.each([1,2,3,4], function(idx){
                if(question.get('goto' + idx) != -1) {
                    question.set('goto' + idx, idx2cid[question.get('goto' + idx)]);
                }
           });
        });
        this.reset(questions);
        return this;
    }
});
var questions = new Questions();

var QuestionComponent = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialState: function() {
        return {
            is_open: this.props.is_open,
            imageData: "file://" + this.props.model.get('image'),
            videoData: "file://" + this.props.model.get('video')
        };
    },
//    remove: function() {
//        questions.remove(this.props.model);
//    },
    updateQuestion: function(event){
        this.wrapper.model.set(event.target.dataset.field, event.target.value);
    },
    previewImage: function(event) {
      if(event) {
          this.wrapper.model.set({
              'image': event.target.value,
              'video': ''
          })
      }
      
    //   let file = event.target.files[0];
      this.setState({
          imageData: "file://" + this.props.model.get('image'),
          videoData: "file://" + this.props.model.get('video')
      });
    },
    previewVideo: function(event) {
        if(event) {
            this.wrapper.model.set({
              'video': event.target.value,
              'image': ''
          })
        }
        this.setState({
          imageData: "file://" + this.props.model.get('image'),
          videoData: "file://" + this.props.model.get('video')
        });
    },
    toggle: function() {
        this.setState({ is_open: !this.state.is_open })
    },
    renderGotos: function(idx, defaultValue) {
        var cid = this.props.model.cid;
        let options = _.clone(this.props.collection.models);
        options.push(new Question({
            id: '-1',
            text: 'Vége'
        }))
        options = options.map(function(question){
            let text = question.get('text');
            let cid = question.id || question.cid;
            return <option value={cid}>{text}</option>;
        });

        return <select data-field={"goto" + idx} value={defaultValue}
            onChange={this.updateQuestion}>{options}</select>
    },
    renderAnswerForm: function(idx) {
        let gotoOptions = this.renderGotos(idx, this.state.model["goto" + idx]);
        let answer = this.state.model["answer" + idx];
        return <div className="form-inline">
                <div className="form-group">
                    <label>Válasz {idx}</label>
                    <input type="text" className="form-control" data-field={"answer" + idx} defaultValue={answer}
                     onChange={this.updateQuestion} />
                </div>
                <div className="form-group">
                    <label>Következő</label>
                    {gotoOptions}
                </div>
            </div>
    },
    render: function() {
        let Collapse = ReactBootstrap.Collapse;
        let videoPartial = '';
        let imagePartial = '';
        if (this.state.model.image) {
            imagePartial = <img className="col-xs-6 center-block" src={this.state.imageData} />;
        }
        if (this.state.model.video) {
            videoPartial = <ReactPlayer width="" url={this.state.videoData} controls={true} />;
        }

        return <div>
            <h3 onClick={this.toggle}>{this.state.model.text ? this.state.model.text : 'Új kérdés'}</h3>
            <Collapse in={this.state.is_open}>
              <div>
                <div className="form-group">
                    <label>Kérdés</label>
                    <input type="text" className="form-control" data-field="text" defaultValue={this.state.model.text}
                     onChange={this.updateQuestion} />
                </div>
                <div className="form-group row">
                    <div className="col-xs-6">
                    <label>Kép</label>
                    <input type="file" className="form-control" data-field="image" accept="image/*" value="" defaultValue={this.state.model.image}
                     onChange={this.previewImage} />
                    <label>Videó</label>
                    <input type="file" className="form-control" data-field="video" accept="video/*" value="" defaultValue={this.state.model.video}
                     onChange={this.previewVideo} />
                     </div>
                     <div className="col-xs-6 center-block">
                     { imagePartial }
                     { videoPartial }
                     </div>                     
                </div>
                {[1,2,3,4].map(this.renderAnswerForm)}
              </div>
            </Collapse>
            </div>;
    }
});

var NewQuizComponent = React.createClass({
  getInitialState: function() {
    let name = '';
    if(this.props.quiz) {
        name = this.props.quiz.get('name');
        questions = questions.fromQuiz(this.props.quiz);
    }
    return {
        name: name,
        questions: questions,
        open_question: -1
    };
  },
  addQuestion: function(event) {
    this.state.questions.add(new Question({
        text: '',
        image: '',
        video: '',
        answer1: '',
        goto1: -1,
        answer2: '',
        goto2: -1,
        answer3: '',
        goto3: -1,
        answer4: '',
        goto4: -1,
    }));
    this.setState({
        open_question: this.state.questions.length - 1
    });
    event.preventDefault();
    return false;
  },
  updateName: function(event) {
    this.setState({
       'name': event.target.value
    });
  },
  renderQuestions: function(question, idx) {
    return <QuestionComponent key={'q' + idx} model={question}
    is_open={idx === this.state.open_question} collection={this.state.questions} />;
  },
  save: function(event) {
    event.preventDefault();
    writeQuiz(this.props.quiz ? this.props.quiz.id : null, {
        name: this.state.name,
        start: 0,
        questions: this.state.questions.asQuizJSON(),
    }, function(err) {
        window.location = 'index.html';
    });
  },
  render: function () {
    return <div className="container">
        <h1>{this.state.name ? 'Új kvíz: ' + this.state.name : 'Új kvíz'}</h1>
        <form>
            <div className="form-group">
                <label>Cím</label>
                <input type="text" className="form-control" onChange={this.updateName} defaultValue={this.state.name} />
            </div>
            <div id="questions">
                {this.state.questions.map(this.renderQuestions)}
            </div>
            <button className="btn btn-default" onClick={this.addQuestion}><span className="glyphicon glyphicon-plus"></span> Új kérdés</button>
            <button className="btn btn-success" onClick={this.save}><span className="glyphicon glyphicon-floppy-save"></span> Mentés</button>
            <a className="btn btn-warning" href="index.html"><span className="glyphicon glyphicon-home"></span> Kvízlista</a>
        </form>
        <video id="testVideoContainer"></video>
    </div>;
  }
});

function renderQuiz(quiz) {
    if(quiz) {
        ReactDOM.render(<NewQuizComponent questions={questions} quiz={quiz} />, document.body);
    } else {
        ReactDOM.render(<NewQuizComponent questions={questions} />, document.body);
    }
}