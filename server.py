from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import chess
import chess.engine

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# Initialize the chess board and engine
board = chess.Board()
engine = chess.engine.SimpleEngine.popen_uci("path/to/stockfish")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('move')
def handle_move(data):
    move = data['move']
    
    # Make the move on the board
    if move in [m.uci() for m in board.legal_moves]:
        board.push_uci(move)
        emit('update_board', {'fen': board.fen()}, broadcast=True)
        
        # Let the bot make a move
        if not board.is_game_over():
            result = engine.play(board, chess.engine.Limit(time=2.0))
            bot_move = result.move.uci()
            board.push_uci(bot_move)
            emit('update_board', {'fen': board.fen()}, broadcast=True)
    else:
        emit('illegal_move', {'message': 'Illegal move!'})

if __name__ == '__main__':
    socketio.run(app, debug=True)
