$(document).ready( function () {
  // model
  var Todo = Backbone.Model.extend({
    // attributes: title, createdAt, complete
    defaults: function () {
      return {
        title: "No title entered.",
        createdAt: new Date,
        complete: false
      };
    },
    // a custom function
    toggle: function () {
      var currentStatus = this.get("complete");
      this.save({ complete: !currentStatus });
    }
  });

  // collection
  var TodoList = Backbone.Collection.extend({
    // what model is this collection made up of?
    model: Todo,
    // where to store the data?
    localStorage: new Backbone.LocalStorage('todos'),
    // write filter functions to get stuff back
    completed: function () {
      // this.filter is an iterator - whatever
      //  comes out true will be returned as an array of Todos
      //  (or an array of whatever model your collection is bound to)
      return this.filter( function (todo) {
        return todo.get("complete");
      });
    },
    incomplete: function () {
      return this.filter( function (todo) {
        return !todo.get("complete");
      });
    }

  });

});