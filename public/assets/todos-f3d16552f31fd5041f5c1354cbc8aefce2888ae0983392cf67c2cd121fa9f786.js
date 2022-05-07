(function() {
  window.onload = function() {
    var fetch_todos, todo_model;
    todo_model = new Vue({
      el: '#table-todos',
      data: {
        edit_id: 0,
        edit_mode: false,
        new_todo: {
          done: false,
          name: ''
        },
        todos: ''
      },
      methods: {
        validate: function(todo) {
          return todo.name !== '';
        },
        edit: function(todo) {
          if (todo.done) {
            return;
          }
          this.edit_id = todo.id;
          this.edit_mode = true;
          return Vue.nextTick(function() {
            return $("#todo-edit-" + todo.id).focus();
          });
        },
        update: function(todo) {
          if (!this.validate(todo)) {
            return;
          }
          $.ajax({
            method: 'PUT',
            data: {
              todo: todo
            },
            url: '/todos/' + todo.id,
            error: function(res) {}
          });
          return this.edit_mode = false;
        },
        destroy: function(todo) {
          if (!this.validate(todo) || !confirm('Are you sure you want to delete this?\n"' + todo.name + '"')) {
            return;
          }
          $.ajax({
            method: 'DELETE',
            data: {
              todo: todo
            },
            url: '/todos/' + todo.id,
            error: function(res) {}
          });
          this.remove_id(todo.id);
          return this.edit_mode = false;
        },
        create: function() {
          var tmp_new_todo;
          if (!this.validate(this.new_todo)) {
            return;
          }
          $.ajax({
            method: 'POST',
            data: {
              todo: this.new_todo
            },
            url: '/todos/',
            error: function(res) {}
          });
          tmp_new_todo = {
            id: this.tmp_id(),
            name: this.new_todo.name
          };
          this.todos.push(tmp_new_todo);
          this.new_todo.id = 0;
          return this.new_todo.name = '';
        },
        remove_id: function(id) {
          var i, j, len, ref, todo;
          ref = this.todos;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            todo = ref[i];
            if (todo.id === id) {
              this.todos.splice(i, 1);
              return;
            }
          }
        },
        tmp_id: function() {
          var id, j, len, ref, todo;
          id = 0;
          ref = this.todos;
          for (j = 0, len = ref.length; j < len; j++) {
            todo = ref[j];
            if (todo.id > id) {
              id = todo.id;
            }
          }
          return id + 1;
        }
      }
    });
    fetch_todos = function() {
      $("#loading-display").css("display", "block");
      return $.ajax({
        url: '/todos.json',
        success: function(res) {
          $("#loading-display").css("display", "none");
          return todo_model.todos = res;
        }
      });
    };
    return fetch_todos();
  };

}).call(this);
