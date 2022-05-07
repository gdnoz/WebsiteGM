(function() {
  window.onload = function() {
    var average, dice_model, get_sum, median, new_history, new_result, roll_die, stdev, validate, variance;
    dice_model = new Vue({
      el: '#table-dice',
      data: {
        num: 1,
        sides: 20,
        modifier: 0,
        results: [],
        selected_history: -1,
        history: [],
        stat_min: 1,
        stat_max: 20,
        stat_exp: 11,
        stat_avg: 0.0,
        stat_med: 0.0,
        stat_std: 0.0
      },
      methods: {
        roll: function() {
          var n;
          if (!validate(dice_model.num, dice_model.sides, dice_model.modifier)) {
            return;
          }
          dice_model.results = [];
          n = dice_model.num;
          while (n > 0) {
            dice_model.results.push(new_result(roll_die(dice_model.sides)));
            n--;
          }
          dice_model.update_stats();
          dice_model.history.unshift(new_history(dice_model.sides, dice_model.num, dice_model.modifier, dice_model.results));
          dice_model.selected_history = 0;
          return $('#history-list').scrollTop(0);
        },
        select_history: function(idx) {
          var item;
          item = dice_model.history[idx];
          dice_model.sides = item.sides;
          dice_model.num = item.num;
          dice_model.modifier = item.modifier;
          dice_model.results = item.results;
          dice_model.selected_history = idx;
          dice_model.update_exp();
          return dice_model.update_stats();
        },
        clear_history: function() {
          dice_model.results = [];
          dice_model.result_string = '';
          dice_model.selected_history = -1;
          return dice_model.history = [];
        },
        update_exp: function() {
          if (!validate(dice_model.num, dice_model.sides, dice_model.modifier)) {
            return;
          }
          dice_model.stat_min = (dice_model.num * 1) + (dice_model.modifier * 1);
          dice_model.stat_max = (dice_model.num * 1) * (dice_model.sides * 1) + (dice_model.modifier * 1);
          return dice_model.stat_exp = Math.round((dice_model.stat_max - dice_model.stat_min) / 2 + dice_model.stat_min);
        },
        update_stats: function() {
          dice_model.stat_avg = average(dice_model.results);
          dice_model.stat_med = median(dice_model.results);
          return dice_model.stat_std = stdev(dice_model.results, dice_model.stat_exp, dice_model.sides, dice_model.num);
        }
      }
    });
    average = function(values) {
      var i, len, sum, value;
      sum = 0;
      for (i = 0, len = values.length; i < len; i++) {
        value = values[i];
        sum += value.num;
      }
      return sum / values.length;
    };
    median = function(values) {
      values.sort();
      return values[Math.round(values.length / 2) - 1].num;
    };
    stdev = function(values, exp, sides, num) {
      return 0;
    };
    variance = function(value, exp, sides) {
      return 0;
    };
    roll_die = function(max) {
      return Math.floor(Math.random() * max + 1);
    };
    new_result = function(num) {
      return {
        num: num
      };
    };
    new_history = function(sides, num, modifier, results) {
      return {
        sides: sides,
        num: num,
        modifier: modifier,
        results: results,
        total: get_sum(results, modifier)
      };
    };
    get_sum = function(list, modifier) {
      var i, len, ret, value;
      ret = 0;
      for (i = 0, len = list.length; i < len; i++) {
        value = list[i];
        ret += value.num;
      }
      return ret + (modifier * 1);
    };
    return validate = function(num, sides, modifier) {
      var ret;
      ret = true;
      if (isNaN(sides) || sides < 1) {
        ret = false;
        console.error(sides + " is not a valid number of sides!");
      }
      if (isNaN(num) || num < 1) {
        ret = false;
        console.error(num + " is not a valid number of dice!");
      }
      if (isNaN(modifier)) {
        ret = false;
        console.error(modifier + " is not a valid modifier!");
      }
      if (num > 100) {
        ret = false;
        console.error("For your browser's sake, this site allows a maximum of 100 dice to be thrown at a time.");
      }
      return ret;
    };
  };

}).call(this);
