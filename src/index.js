import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {
  isWinning() {
    return 'square' + (this.props.winning ? ' winning' : ''); 
  }

  render() {
    return  (
      <button className={this.isWinning()} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      winning={this.props.highlights.length && this.props.highlights.includes(i)}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const board = this;
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(board.renderSquare(3 * i + j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      reverseOrder: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }); 
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  reverseOrder() {
    this.setState({
      reverseOrder: !this.state.reverseOrder,
    });
  }

  render() {
    const currentStep = this.state.stepNumber;
    const history     = this.state.history;
    const current     = history[currentStep];
    const winner      = calculateWinner(current.squares);
    let highlights    = [];
    
    const moves = history.map((step, move) => {
      const desc = move ? 
        'Move #' + move :
        'Game start';
      const className = currentStep === move ? 'bold' : '';
      return (
        <li key={move}>
          <a className={className} href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let order;
    if (this.state.reverseOrder) {
      order = 'Ascending';
      moves.reverse();
    } else {
      order = 'Descending';
    }

    let status;
    if (winner) {
      status = 'Winner : ' + winner.name;
      highlights = winner.cases;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            highlights = {highlights}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br/>
          <button onClick={() => this.reverseOrder()}>{order}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {name: squares[a], cases: [a, b, c]};
    }
  }
  return null;
}