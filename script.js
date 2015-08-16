(function () {

  // 0 == empty
  // 1 = human
  // 2 = computer

  var cellWidth = 100;
  var piecesOnBoard = 0;
  var humanScore = 0;
  var computerScore = 0;

  function setUpBoard() {
    var area = document.getElementById('gameArea');
    var grid = document.createElement('table');
    grid.id = 'gameGrid';
    area.appendChild(grid);
    board = new Array();
    for( var row = 0; row < 6; row++ ) {
      board[row] = new Array();
      var tr = document.createElement('tr');  
      for( var col = 0; col < 7; col++ ) {
        board[row].push(0);
        var td = document.createElement('td');
        var hole = document.createElement('div');
        hole.className = 'hole';
        td.appendChild(hole);
        tr.appendChild(td);
      }
      grid.appendChild(tr);
    }
    document.getElementById('gameArea').addEventListener('click', boardClick);
    document.getElementById('score').innerHTML = '<strong class="player1">You: ' + humanScore + '</strong>&nbsp;&nbsp;&nbsp; <strong class="player2">Computer: ' + computerScore + '</strong>';
    return board;
  };

  function boardClick(event) {
    event = event || window.event;
    var grid = document.getElementById('gameGrid');
    var rect = grid.getBoundingClientRect();
    var column = event.pageX - rect.left;
    column = Math.floor(column/cellWidth);
    // if it's from a click, it's the human player
    var move = playerMove(1, column);
    // if that move was succesful, let the computer move
    if (move) { playerMove(2); }
  }

  function playerMove(player, column) {
    if (typeof column === 'undefined') { column = Math.floor(Math.random() * 7); }
    var turn = dropPiece(column, player);
    if (turn == 'reset') {
      setTimeout(resetGame, 1000);
      return false;
    }
    else if (turn == 'redo') {
      if (player == 1) {
        alert('That column is full! Try again.');
        return false;
      }
      else if (player == 2) {
        playerMove(2);
      }
    }
    return true;
  };

  function dropPiece(col, player) {
    // check this column starting from bottom
    var row = 5;
    while (row > 0 && board[row][col] != 0) {
      row -= 1;
    }
    // row will equal first empty spot
    // make sure the col isn't full and we don't overwrite another piece
    if (board[row][col] == 0) {
      // return for catching a win
      return placePiece(row, col, player);
    }
    // need to redo move
    else { return 'redo'; }
  };
  
  function placePiece(row, col, player) {
    // set 2d array position with player ID#
    board[row][col] = player;

    var gameArea = document.getElementById('gameArea');
    var disc = document.createElement('div');
    disc.className = 'disc player' + player;
    disc.style.position = "absolute";
    // offset for discs not filling up 100% of the cell
    var posx = (col)*100 + 5;
    var posy = row*100 + 5;
    disc.style.left = (posx) + 'px';
    disc.style.top = (posy) + 'px';
    gameArea.appendChild(disc);

    piecesOnBoard += 1;
    return checkWin(row, col, player);
  };
  
  function checkWin(row, col, player) {
    // check to see if the last most piece placed made a win
    var rows = board.length;
    var cols = board[0].length;
    var won = false;

    // check horizontal
    var count = 0;
    for (var i = 0; i < cols; i++) {
      if (board[row][i] == player) { count++; }
      else { count = 0; }
      if (count == 4) { won = true; }
    }

    // check vertical, check 3 spaces below current row
    // only check vertical if this row is between indexes 0-2
    if (!won) {
      count = 0;
      if (row <= rows-4) {
        for (var i = row; i < row+4; i++) {
          if (board[i][col] == player) { count++; }
          else { count = 0; }
          if (count == 4) { won = true; break; }
        }
      }
    }
    
    // check \
    if (!won) {
      count = 0;
      for (var i = -3; i <= 3; i++) {
        if (col+i >= 0 && col+i < cols && row+i >= 0 && row+i < rows) {
          if (board[row+i][col+i] == player) {
            count++;
          }
        }
        if (count == 4) { won = true; break; }
      }
    }

    // check /
    if (!won) {
      count = 0;
      for (var i = -3; i <= 3; i++) {
        if (col+i >= 0 && col+i < cols && row-i >= 0 && row-i < rows) {
          if (board[row-i][col+i] == player) {
            count++;
          }
        }
        if (count == 4) { won = true; break; }
      }
    }

    if (won == true) {
      if (player == 1) {
        setTimeout(function() { alert('You won!'); }, 100);;
        humanScore += 1;
      }
      else if (player == 2) {
        setTimeout(function() { alert('Computer wins.'); }, 100);;
        computerScore += 1;
      }
      return 'reset';
    }

    // else check to see if all spots are full, end game
    if (piecesOnBoard == 7*6) {
      setTimeout(function() { alert('Game over, draw.'); }, 100);;
      return 'reset';
    }

    // else let the next move continue
    return true;
  };

  function resetGame() {
    // clear the game table
    var grid = document.getElementById("gameArea");
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    // make new game
    piecesOnBoard = 0;
    board = setUpBoard();
  }
    
  var board = setUpBoard();

}());