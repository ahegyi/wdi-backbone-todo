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
    // where to store the data? LocalStorage uses named databases, here it is 'todos'
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

  // our todos we're keeping track of
  var Todos = new TodoList;

  // the generic view for a Todo
  var TodoView = Backbone.View.extend({
    // what tag to attach the Todo model to?
    tagName: 'li',
    // Backbone's default templating engine is similar to ERB
    template: _.template($('#list-item-template').html()),
    events: {
      // equivalent to jQuery's $('.checkbox').on(click, toggleView);
      "click .checkbox": "toggleView"
      // this click .checkbox /may or may not/ be scoped to this template
    },
    toggleView: function () {
      // this is the particular instance of this Backbone.View
      this.model.toggle();
      if (this.model.get("complete")) {
        $('#completed-list').append(this.render().el);
      }
      else {
        $('#todo-list').append(this.render().el);
      }
    },
    render: function () {
      // this.$el is the current element in Backbone ('li' in this case)
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  // the Application view!
  // 'this' is the AppView instance
  var AppView = Backbone.View.extend({
    el: $('#todoapp'),
    events: {
      "submit #todoForm": "addTodo"
    },
    // special named function, this is called when the object is created
    initialize: function () {
      this.input = this.$('#new-todo');
      this.counter = this.$('#counter');
      // now let's listen. Whenever a todo is added to our Todos,
      //  call the function this.appendTodo
      // this.listenTo(Todos, 'add', this.appendTodo);
      // let's use a different function to add fetched todos
      this.listenTo(Todos, 'add', this.appendTodo);
      // and use another function to keep track of changing todos
      // this.listenTo(Todos, 'change:complete', this.arrangeTodo);
      // create another listen for all events
      this.listenTo(Todos, 'all', this.render);
      // create another listener
      this.listenTo(Todos, 'all', this.manageTitles);
      // get all locally stored Todos
      Todos.fetch();
    },
    // function called on Todos 'add' listener
    // appendTodo: function (todo) {
    //   var view = new TodoView({
    //     model: todo
    //   });
    //   // view.render() is the string, calling .el returns an element
    //   //  the rest is a simple append on a jQuery object
    //   this.$('#todo-list').append(view.render().el);
    // },
    manageTitles: function (todo) {
      var completed = Todos.completed().length;
      var incomplete = Todos.incomplete().length;
      if (completed === 0) {
        $('#completed-title').html('');
      }
      else {
        $('#completed-title').html("Completed");
      }
      if (incomplete === 0) {
        $('#todo-title').html('');
      }
      else {
        $('#todo-title').html("Todo");
      }
    },
    appendTodo: function (todo) {
      var view = new TodoView({
        model: todo
      });
      if (todo.get("complete")) {
        this.$('#completed-list').append(view.render().el);
      }
      else {
        this.$('#todo-list').append(view.render().el);
      }
    },
    // arrangeTodo: function (todo) {
    //   this.$('#todo-list').append($('<li>Foo</li>'));
    //   //$(todo).append('#completed-list');
    // },
    addTodo: function (event) {
      event.preventDefault();
      // like Todo.create(:title => "foo") in Rails
      Todos.create({
        title: this.input.val()
      });
      this.input.val('');
    },
    // create a template to keep track of counts
    counterTemplate: _.template($('#counter-template').html()),
    render: function () {
      var completed = Todos.completed().length;
      var incomplete = Todos.incomplete().length;
      this.counter.html(
        this.counterTemplate({
          completed: completed,
          incomplete: incomplete
        })
      );
    }
  });

  var App = new AppView;

});