window.onload = () ->
  # Define the data model
  sudoku_model = new Vue(
    el: '#table-sudoku',
    data:
      complete: false
      busy: false
      rows: []
    methods:
      on_cell_changed: (x, y, num) ->
        # TODO: Better handling
        if validate_cell(x, y, num) && check_win()
          sudoku_model.complete = true
          alert ('YOU WIN!')
      
      generate: () ->
        this.busy = true
        init()
        create_table()
        this.busy = false

      finish: () ->
        this.busy = true
        solve()
        if check_win()
          sudoku_model.complete = true
        this.busy = false
  )

  shuffle = (array) ->
    rnd_index = 0
    tmp_value = ''
    cur_index = array.length
    while 0 != cur_index
      rnd_index = Math.floor(Math.random() * cur_index);
      cur_index -= 1;
      tmp_value = array[cur_index]
      array[cur_index] = array[rnd_index]
      array[rnd_index] = tmp_value
    return array

  new_cell = (num = '', valid = false, autogen = false) ->
    return {num: num, valid: valid, autogen: autogen}

  check_win = () ->
    for row in sudoku_model.rows
      for cell in row
        return false unless cell.valid
    return true

  validate_value = (num) ->
    return !isNaN(num) && num <= 9 && num >= 1

  validate_row = (x, y, num) ->
    for cell, i in sudoku_model.rows[y]
      return false unless i == x || parseInt(cell.num, 10) != parseInt(num, 10)
    return true

  validate_column = (x, y, num) ->
    for row, i in sudoku_model.rows
      return false unless i == y || parseInt(row[x].num, 10) != parseInt(num, 10)
    return true

  validate_section = (x, y, num) ->
    x_from = Math.floor(x/3)*3
    y_from = Math.floor(y/3)*3
    for x_current in [x_from..x_from+2]
      for y_current in [y_from..y_from+2]
        row = sudoku_model.rows[y_current]
        return false unless (x_current == x && y_current == y) || parseInt(row[x_current].num, 10) != parseInt(num, 10)
    return true

  validate_cell = (x, y, num) ->
    ret = true;
    # Validate cell value
    ret = ret && validate_value(num)
    # Validate uniqueness in row
    ret = ret && validate_row(x, y, num)
    # Validate uniqueness in column
    ret = ret && validate_column(x, y, num)
    # Validate uniqueness in section
    ret = ret && validate_section(x, y, num)
    sudoku_model.rows[y][x].valid = ret
    return ret

  # Simple backtracking solver algorithm
  solve = (x = -1, y = 0) ->
    x++

    if x > 8 # End of row
      x = 0
      y++
      return true if y > 8 # End of grid

    cell = sudoku_model.rows[y][x]

    if cell.num == ''
      for num in shuffle([1..9])
        sudoku_model.rows[y][x].num = num
        if validate_cell(x, y, num) && solve(x, y)
          sudoku_model.rows[y][x].autogen = true
          return true
      sudoku_model.rows[y][x].num = ''
      return false
    return false unless validate_cell(x, y, cell.num)
    return solve(x, y)

  # Returns number of valid solutions
  num_solutions = (x = -1, y = 0, s = 0) ->
    x++

    if x > 8 # End of row
      x = 0
      y++
      return 1 if y > 8 # End of grid

    cell = sudoku_model.rows[y][x]

    if cell.num == ''
      for num in [1..9]
        sudoku_model.rows[y][x].num = num
        s += num_solutions(x, y, s) if validate_cell(x, y, num)
      sudoku_model.rows[y][x].num = ''
      return s
    else
      return 0 unless validate_cell(x, y, cell.num)
      return num_solutions(x, y, s);

  remove_random = () ->
    num = ''
    while num == '' || num_solutions() == 1
      random_x = Math.floor(Math.random() * 9)
      random_y = Math.floor(Math.random() * 9)
      num = sudoku_model.rows[random_y][random_x].num
      sudoku_model.rows[random_y][random_x] = new_cell()
    sudoku_model.rows[random_y][random_x] = new_cell(num, true, true)

  init = () ->
    if sudoku_model.rows.length > 0
      sudoku_model.rows

    sudoku_model.rows = []
    for y in [0..8]
      sudoku_model.rows[y] = []
      for x in [0..8]
        sudoku_model.rows[y][x] = new_cell()

  create_table = () ->
    sudoku_model.complete = false
    $("#loading-display").css("display", "block")
    console.log('Generating solution...')
    solve()
    console.log('Randomly removing values...')
    remove_random()
    $("#loading-display").css("display", "none")
    console.log('Done!')

  init()
  create_table()