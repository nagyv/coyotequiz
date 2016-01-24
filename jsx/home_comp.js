var HomeComponent = React.createClass({
  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return <li key={entry.id}>{entry.name}</li>;
  },
  render: function () {
    return <div>
        <h1>Sakál kvíz</h1>
        <h2>Korábbi kvízek</h2>
        <ul>{this.state.collection.map(this.createEntry)}</ul>
        <a class="btn btn-default" href="new.html">
            <span class="glyphicon glyphicon-plus"></span> Új kvíz</a>
        </div>;
  }
});

ReactDOM.render(<HomeComponent collection={Quizzes} />, document.body);