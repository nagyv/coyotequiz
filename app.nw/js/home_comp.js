'use strict';

var HomeComponent = React.createClass({
  displayName: "HomeComponent",

  mixins: [Backbone.React.Component.mixin],
  createEntry: function (entry) {
    let href = "quiz.html?id=" + entry.id;
    return React.createElement(
      "li",
      { key: entry.id },
      React.createElement(
        "a",
        { href: href },
        entry.name
      ),
      " ",
      React.createElement(
        "a",
        { href: "new.html?id=" + entry.id },
        React.createElement("span", { className: "glyphicon glyphicon-pencil" })
      )
    );
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "container" },
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
        { className: "btn btn-default", href: "new.html" },
        React.createElement("span", { className: "glyphicon glyphicon-plus" }),
        " Új kvíz"
      )
    );
  }
});

ReactDOM.render(React.createElement(HomeComponent, { collection: Quizzes }), document.body);