window.onload = () ->
  dice_model = new Vue(
    el: '#table-dice'

    data:
      num: 1
      sides: 20
      modifier: 0
      results: []
      selected_history: -1
      history: []

    methods:
      roll: () ->
        if !validate(dice_model.num, dice_model.sides, dice_model.modifier)
          return
        dice_model.results = []
        n = dice_model.num
        while n > 0
          dice_model.results.push(new_result(roll_die(dice_model.sides)))
          n--
        dice_model.history.unshift(new_history(dice_model.sides, dice_model.num, dice_model.modifier, dice_model.results))
        dice_model.selected_history = 0
        $('#history-list').scrollTop(0)
      
      select_history: (idx) ->
        item = dice_model.history[idx]
        dice_model.sides = item.sides
        dice_model.num = item.num
        dice_model.modifier = item.modifier
        dice_model.results = item.results
        dice_model.selected_history = idx

      clear_history: () ->
        dice_model.results = []
        dice_model.result_string = ''
        dice_model.selected_history = -1
        dice_model.history = []
  )

  roll_die = (max) ->
    return Math.floor(Math.random() * max + 1)

  new_result = (num) ->
    return {num: num}

  new_history = (sides, num, modifier, results) ->
    return {sides: sides, num: num, modifier: modifier, results: results, total: get_sum(results, modifier)}
  
  get_sum = (list, modifier) ->
    ret = 0
    for value in list
      ret += value.num
    return ret + (modifier * 1)

  validate = (num, sides, modifier) ->
    ret = true

    if isNaN(sides) || sides < 1
      ret = false
      console.error(sides + " is not a valid number of sides!")
    if isNaN(num) || num < 1
      ret = false
      console.error(num + " is not a valid number of dice!")
    if isNaN(modifier)
      ret = false
      console.error(modifier + " is not a valid modifier!")
    if num > 100
      ret = false
      console.error("For your browser's sake, this site allows a maximum of 100 dice to be thrown at a time.")

    return ret