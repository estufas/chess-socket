angular.module('ChessCtrls', [])
.controller('ChessMultplyPlayer', ['$scope', function($scope) {
	var game;
	$scope.initGame = function() {
	  var board,
	  statusEl = $('#status'),
	  fenEl = $('#fen'),
	  pgnEl = $('#pgn');

	  game = new Chess()

			// do not pick up pieces if the game is over
			// only pick up pieces for the side to move
			var onDragStart = function(source, piece, position, orientation) {
			  if (game.game_over() === true ||
			      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
			      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
			    return false;
			  }
			};

			var onDrop = function(source, target) {
			  // see if the move is legal
			  var move = game.move({
			    from: source,
			    to: target,
			    promotion: 'q' // NOTE: always promote to a queen for example simplicity
			  });

			  // illegal move
			  if (move === null) return 'snapback';
			  
			  // handleMove(source, target);
			  updateStatus();
			};

			// update the board position after the piece snap 
			// for castling, en passant, pawn promotion
			var onSnapEnd = function() {
			  board.position(game.fen())
			  console.log(cfg.position);
			};

			var updateStatus = function() {
			  var status = '';

			  var moveColor = 'White';
			  if (game.turn() === 'b') {
			    moveColor = 'Black';
			  }

			  // checkmate?
			  if (game.in_checkmate() === true) {
			    status = 'Game over, ' + moveColor + ' is in checkmate.';
			  }

			  // draw?
			  else if (game.in_draw() === true) {
			    status = 'Game over, drawn position';
			  }

			  // game still on
			  else {
			    status = moveColor + ' to move';

			    // check?
			    if (game.in_check() === true) {
			      status += ', ' + moveColor + ' is in check';
			    }
			  }

			  statusEl.html(status);
			  fenEl.html(game.fen());
			  pgnEl.html(game.pgn());
			};

			var cfg = {
			  draggable: true,
			  position: 'start',
			  onDragStart: onDragStart,
			  onDrop: handleMove,
			  onSnapEnd: onSnapEnd
			};

			board = ChessBoard('board1', cfg);
			game = new Chess();
			// console.log(cfg);
			// updateStatus();
		  // console.log(source);
	}
		  var socket = io();
			console.log(socket);

		  var handleMove = function(source, target) {
		  	console.log("DOING NOTHING");
		    var move = game.move({from: source, to: target});
		    socket.emit('move', move);
		    // console.log("wyatt can you see me?")
			}
		  socket.on('move', function (msg) {
		    game.move(msg);
		    board.position(game.fen()); // fen is the board layout
			});

}])


