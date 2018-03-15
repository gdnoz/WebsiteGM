$(document).on('ready', () ->
  # Define the data model
  todo_model = new Vue(
    el: '#table-todos',
    data:
      edit_id: 0
      edit_mode: false
      new_todo:
        done: false
        name: ''
      todos: ''

    methods:
      validate: (todo) ->
        return todo.name != ''

      edit: (todo) ->
        this.edit_id = todo.id
        this.edit_mode = true
        
      update: (todo) ->
        if this.validate(todo)
          $.ajax(
            method: 'PUT'
            data: 
              todo: todo
            url: '/todos/' + todo.id
            error: (res) ->
              # Todo: Report the error!
          )
          this.edit_mode = false

      destroy: (todo) ->
        if this.validate(todo) && confirm('Are you sure you want to delete this?\n"' + todo.name + '"')
          $.ajax(
            method: 'DELETE'
            data: 
              todo: todo
            url: '/todos/' + todo.id
            success: (res) ->
              fetch_todos()
            error: (res) ->
              # Todo: Report the error!
          )
          this.edit_mode = false

      create: () ->
        if this.validate(this.new_todo)
          $.ajax(
            method: 'POST'
            data: 
              todo: this.new_todo
            url: '/todos/'
            success: (res) ->
              fetch_todos()
            error: (res) ->
              # Todo: Report the error!
          )
          this.new_todo.id = 0
          this.new_todo.name = ''
  )

  # Populate the data model
  fetch_todos = () ->
    $.ajax(
      url: '/todos.json'
      success: (res) ->
        todo_model.todos = res
    )

  fetch_todos()
)