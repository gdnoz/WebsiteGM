window.onload = () ->
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
        if todo.done
          return
        this.edit_id = todo.id
        this.edit_mode = true
        Vue.nextTick( () ->
          $("#todo-edit-"+todo.id).focus()
        )
        
      update: (todo) ->
        if !this.validate(todo)
          return
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
        if !this.validate(todo) || !confirm('Are you sure you want to delete this?\n"' + todo.name + '"')
          return
        $.ajax(
          method: 'DELETE'
          data: 
            todo: todo
          url: '/todos/' + todo.id
          error: (res) ->
            # Todo: Report the error!
        )
        this.remove_id(todo.id)
        this.edit_mode = false

      create: () ->
        if !this.validate(this.new_todo)
          return
        $.ajax(
          method: 'POST'
          data: 
            todo: this.new_todo
          url: '/todos/'
          error: (res) ->
            # Todo: Report the error!
        )
        tmp_new_todo = { id: this.tmp_id(), name: this.new_todo.name }
        this.todos.push(tmp_new_todo)

        this.new_todo.id = 0
        this.new_todo.name = ''

      remove_id: (id) ->
        for todo, i in this.todos
          if todo.id == id
            this.todos.splice i, 1
            return

      tmp_id: () ->
        id = 0
        for todo in this.todos
          if todo.id > id
            id = todo.id
        return id+1
  )

  # Populate the data model
  fetch_todos = () ->
    $("#loading-display").css("display", "block")
    $.ajax(
      url: '/todos.json'
      success: (res) ->
        $("#loading-display").css("display", "none")
        todo_model.todos = res
    )

  fetch_todos()