var HomeComponent = React.createClass({
  displayName: "HomeComponent",

  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    return React.createElement(
      "li",
      { key: entry.id },
      entry.name
    );
  },
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "Sakál kvíz"
      ),
      React.createElement(
        "h2",
        null,
        "Korábbi kvízek"
      ),
      React.createElement(
        "ul",
        null,
        this.state.collection.map(this.createEntry)
      ),
      React.createElement(
        "a",
        { "class": "btn btn-default", href: "new.html" },
        React.createElement("span", { "class": "glyphicon glyphicon-plus" }),
        " Új kvíz"
      )
    );
  }
});

ReactDOM.render(React.createElement(HomeComponent, { collection: Quizzes }), document.body);