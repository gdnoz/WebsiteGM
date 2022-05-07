(function() {
  window.onload = function() {
    var check_win, create_table, init, new_cell, num_solutions, remove_random, shuffle, solve, sudoku_model, validate_cell, validate_column, validate_row, validate_section, validate_value;
    sudoku_model = new Vue({
      el: '#table-sudoku',
      data: {
        complete: false,
        busy: false,
        rows: []
      },
      methods: {
        on_cell_changed: function(x, y, num) {
          if (validate_cell(x, y, num) && check_win()) {
            sudoku_model.complete = true;
            return set_notice('Congratulations! Press \'Generate\' to play again.');
          }
        },
        generate: function() {
          var duration, start;
          start = Date.now();
          this.busy = true;
          init();
          create_table();
          this.busy = false;
          duration = Date.now() - start;
          if (duration === 0) {
            duration = '<1';
          }
          return set_notice('Finished game generation in ' + duration + 'ms');
        },
        finish: function() {
          var duration, start;
          start = Date.now();
          this.busy = true;
          solve();
          if (check_win()) {
            sudoku_model.complete = true;
          }
          this.busy = false;
          duration = Date.now() - start;
          if (duration === 0) {
            duration = '<1';
          }
          return set_notice('Completed game in ' + duration + 'ms');
        }
      }
    });
    shuffle = function(array) {
      var cur_index, rnd_index, tmp_value;
      rnd_index = 0;
      tmp_value = '';
      cur_index = array.length;
      while (0 !== cur_index) {
        rnd_index = Math.floor(Math.random() * cur_index);
        cur_index -= 1;
        tmp_value = array[cur_index];
        array[cur_index] = array[rnd_index];
        array[rnd_index] = tmp_value;
      }
      return array;
    };
    new_cell = function(num, valid, autogen) {
      if (num == null) {
        num = '';
      }
      if (valid == null) {
        valid = false;
      }
      if (autogen == null) {
        autogen = false;
      }
      return {
        num: num,
        valid: valid,
        autogen: autogen
      };
    };
    check_win = function() {
      var cell, j, k, len, len1, ref, row;
      ref = sudoku_model.rows;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        for (k = 0, len1 = row.length; k < len1; k++) {
          cell = row[k];
          if (!cell.valid) {
            return false;
          }
        }
      }
      return true;
    };
    validate_value = function(num) {
      return !isNaN(num) && num <= 9 && num >= 1;
    };
    validate_row = function(x, y, num) {
      var cell, i, j, len, ref;
      ref = sudoku_model.rows[y];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        cell = ref[i];
        if (!(i === x || parseInt(cell.num, 10) !== parseInt(num, 10))) {
          return false;
        }
      }
      return true;
    };
    validate_column = function(x, y, num) {
      var i, j, len, ref, row;
      ref = sudoku_model.rows;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        row = ref[i];
        if (!(i === y || parseInt(row[x].num, 10) !== parseInt(num, 10))) {
          return false;
        }
      }
      return true;
    };
    validate_section = function(x, y, num) {
      var j, k, ref, ref1, ref2, ref3, row, x_current, x_from, y_current, y_from;
      x_from = Math.floor(x / 3) * 3;
      y_from = Math.floor(y / 3) * 3;
      for (x_current = j = ref = x_from, ref1 = x_from + 2; ref <= ref1 ? j <= ref1 : j >= ref1; x_current = ref <= ref1 ? ++j : --j) {
        for (y_current = k = ref2 = y_from, ref3 = y_from + 2; ref2 <= ref3 ? k <= ref3 : k >= ref3; y_current = ref2 <= ref3 ? ++k : --k) {
          row = sudoku_model.rows[y_current];
          if (!((x_current === x && y_current === y) || parseInt(row[x_current].num, 10) !== parseInt(num, 10))) {
            return false;
          }
        }
      }
      return true;
    };
    validate_cell = function(x, y, num) {
      var ret;
      ret = true;
      ret = ret && validate_value(num);
      ret = ret && validate_row(x, y, num);
      ret = ret && validate_column(x, y, num);
      ret = ret && validate_section(x, y, num);
      sudoku_model.rows[y][x].valid = ret;
      return ret;
    };
    solve = function(x, y) {
      var cell, j, len, num, ref;
      if (x == null) {
        x = -1;
      }
      if (y == null) {
        y = 0;
      }
      x++;
      if (x > 8) {
        x = 0;
        y++;
        if (y > 8) {
          return true;
        }
      }
      cell = sudoku_model.rows[y][x];
      if (cell.num === '') {
        ref = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (j = 0, len = ref.length; j < len; j++) {
          num = ref[j];
          sudoku_model.rows[y][x].num = num;
          if (validate_cell(x, y, num) && solve(x, y)) {
            sudoku_model.rows[y][x].autogen = true;
            return true;
          }
        }
        sudoku_model.rows[y][x].num = '';
        return false;
      }
      if (!validate_cell(x, y, cell.num)) {
        return false;
      }
      return solve(x, y);
    };
    num_solutions = function(x, y, s) {
      var cell, j, num;
      if (x == null) {
        x = -1;
      }
      if (y == null) {
        y = 0;
      }
      if (s == null) {
        s = 0;
      }
      x++;
      if (x > 8) {
        x = 0;
        y++;
        if (y > 8) {
          return 1;
        }
      }
      cell = sudoku_model.rows[y][x];
      if (cell.num === '') {
        for (num = j = 1; j <= 9; num = ++j) {
          sudoku_model.rows[y][x].num = num;
          if (validate_cell(x, y, num)) {
            s += num_solutions(x, y, s);
          }
        }
        sudoku_model.rows[y][x].num = '';
        return s;
      } else {
        if (!validate_cell(x, y, cell.num)) {
          return 0;
        }
        return num_solutions(x, y, s);
      }
    };
    remove_random = function() {
      var num, random_x, random_y;
      num = '';
      while (num === '' || num_solutions() === 1) {
        random_x = Math.floor(Math.random() * 9);
        random_y = Math.floor(Math.random() * 9);
        num = sudoku_model.rows[random_y][random_x].num;
        sudoku_model.rows[random_y][random_x] = new_cell();
      }
      return sudoku_model.rows[random_y][random_x] = new_cell(num, true, true);
    };
    init = function() {
      var j, results, x, y;
      if (sudoku_model.rows.length > 0) {
        sudoku_model.rows;
      }
      sudoku_model.rows = [];
      results = [];
      for (y = j = 0; j <= 8; y = ++j) {
        sudoku_model.rows[y] = [];
        results.push((function() {
          var k, results1;
          results1 = [];
          for (x = k = 0; k <= 8; x = ++k) {
            results1.push(sudoku_model.rows[y][x] = new_cell());
          }
          return results1;
        })());
      }
      return results;
    };
    create_table = function() {
      sudoku_model.complete = false;
      $("#loading-display").css("display", "block");
      console.log('Generating solution...');
      solve();
      console.log('Randomly removing values...');
      remove_random();
      $("#loading-display").css("display", "none");
      return console.log('Done!');
    };
    init();
    return create_table();
  };

}).call(this);
