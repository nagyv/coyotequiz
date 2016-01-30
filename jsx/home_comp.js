'use strict';

var HomeComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    let href = "quiz.html?id=" + entry.id;
    return <li key={entry.id}><a href={href}>{entry.name}</a> <a href={"new.html?id=" + entry.id}><span className="glyphicon glyphicon-pencil"></span></a></li>;
  },
  render: function () {
    return <div className="container">
        <h1 >Sakál kvíz</h1>
        <ul>{this.state.collection.map(this.createEntry)}</ul>
        <a className="btn btn-default" href="new.html">
            <span className="glyphicon glyphicon-plus"></span> Új kvíz</a>
        </div>;
  }
});

ReactDOM.render(<HomeComponent collection={Quizzes} />, document.body);