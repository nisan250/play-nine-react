// Code goes here
var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
      arr.pop();
      return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
      var combinationSum = 0;
      for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
      }
      if (n === combinationSum) { return true; }
    }
    return false;
  };
  
  var StarsFrame = React.createClass({
    render: function() {
      var numberOfStars = this.props.numberOfStars;
      // var numberOfStars = this.randomNumber()
      var stars = [];
      for(var i=0; i<numberOfStars; i++) {
        stars.push(<span className="fa fa-star" key={i}></span>);
      }
      return (
        <div id="stars-frame"> 
          <div className="card bg-light">
            <div className="card-body">
            {stars}
            </div>
          </div>
        </div>
        )
    }
  });
  
  var ButtonFrame = React.createClass({
    render: function() {
      var button, correct = this.props.correct;
      // var redraws = this.props.redraws;
      
      switch(correct) {
        case true:
          button = (
            <button className="btn btn-success btn-lg"
                    onClick={this.props.acceptAnswer}>
              <span className="fa fa-check"></span>
            </button>
            );
        break;
        case false:
          button = (
            <button className="btn btn-danger btn-lg">
              <span className="fa fa-times"></span>
            </button>
            );    
        break;
        default:
         var disabled = (this.props.selectedNumbers.length === 0);
          button = (
            <button type="button" className="btn btn-primary btn-lg" disabled={disabled}
                    onClick={this.props.checkAnswer}>
            =</button>
          );  
      }
      
      return (
        <div id="button-frame">
          {button}
          <br /><br />
          <button className="btn btn-warning btn-xs" onClick={this.props.redraw} disabled={this.props.redraws === 0}>
            <span className="fa fa-sync-alt" ></span>
            &nbsp;
            {this.props.redraws}
          </button>
        </div>
        );
    }
  });
  
  var AnswerFrame = React.createClass({
    render: function() {
      var props = this.props;
      var selectedNumbers =  props.selectedNumbers.map(function(i) {
        return (
            <span onClick={props.unselectNumber.bind(null, i)}>{i}</span>
          )
      });   
      return (
        <div id="answer-frame">
          <div className="card bg-light">
            <div className="card-body">
              {selectedNumbers}
            </div>
          </div>
        </div>
        )
    }
  });
  
  var NumbersFrame = React.createClass({
    render: function() {
      var numbers = [], className, selectedNumbers = this.props.selectedNumbers;
      var selectNumber = this.props.selectNumber;
      var usedNumbers = this.props.usedNumbers;    
      
      for(var i=1; i<=9; i++) {
        // console.log((selectedNumbers.indexOf(i));
        className = "number selected-" + (selectedNumbers.indexOf(i)>=0);
        className += " used-" + (usedNumbers.indexOf(i)>=0);
        // console.log('className', className);
        numbers.push(<div className={className} key={i} onClick={selectNumber.bind(null, i)}>{i}</div>);
        
      }
      return (
        <div id="numbers-frame" className="mt-3">
          <div className="card bg-light">
            <div className="card-body" >
              {numbers}
            </div>
          </div>
        </div>
        )
    }
  });
  
  var Doneframe = React.createClass({
    render: function() {
      return (
        <div className="card text-center">
          <h2>{this.props.doneStatus}</h2>
          <button className="btn btn-default" onClick={this.props.resetGame}>Play Again!</button>
        </div>
        )    
    }
  });
  var Game = React.createClass({
    getInitialState: function() {
      return {numberOfStars: this.randomNumber(), 
              selectedNumbers: [],
              correct: null,
              usedNumbers: [],
              redraws: 5,
              doneStatus: null,
      };
    },
    resetGame: function() {
      this.replaceState(this.getInitialState());
    },
    randomNumber: function() {
      return Math.floor(Math.random()*9)+1;
    },
    selectNumber: function(clickedNumber) {
      // console.log(this.state.selectedNumbers, arguments[0]);
      if(this.state.selectedNumbers.indexOf(clickedNumber) < 0) {
        this.setState(
          {
            selectedNumbers: this.state.selectedNumbers.concat(clickedNumber),
            correct: null
          }
          );
      }
    },
    unselectNumber: function(clickedNumber) {
      var selectedNumbers = this.state.selectedNumbers,
          indexOfNumber = selectedNumbers.indexOf(clickedNumber);
      
      selectedNumbers.splice(indexOfNumber, 1);
      this.setState({selectedNumbers: selectedNumbers});
    },
    sumOfSelectedNumbers: function() {
      return this.state.selectedNumbers.reduce(function(p,n) {
        return p+n;
      }, 0)
    },
    checkAnswer: function() {
      var correct = (this.state.numberOfStars === this.sumOfSelectedNumbers());
      this.setState({ correct: correct });
    },
    acceptAnswer: function() {
      var usedNumbers = this.state.usedNumbers.concat(this.state.selectedNumbers);
      this.setState({
        selectedNumbers: [],
        usedNumbers: usedNumbers,
        correct: null,
        numberOfStars: this.randomNumber()
      }, function() {
        this.updateDoneStatus();
      });
    },
    redraw: function() {
      if(this.state.redraws > 0) {
        this.setState({ 
          numberOfStars: this.randomNumber(),
          correct: null,
          selectedNumbers: [],
          redraws: this.state.redraws - 1
        });      
      }
    },
    possibleSolutions: function() {
      var numberOfStars = this.state.numberOfStars,
      possibleNumbers = [],
      usedNumbers = this.state.usedNumbers;
  
      for (var i=1; i<=9; i++) {
        if (usedNumbers.indexOf(i) < 0) {
          possibleNumbers.push(i);
        }
      }
  
      return possibleCombinationSum(possibleNumbers, numberOfStars);
    },
    updateDoneStatus: function() {
      console.log('this.state.redraws', this.state.redraws);
      console.log('this.possibleSolutions()', this.possibleSolutions());
      console.log('this.state.usedNumbers.length', this.state.usedNumbers.length);
      console.log('this.state.usedNumbers', this.state.usedNumbers);
      if(this.state.usedNumbers.length === 9) {
        console.log(1, 'won');
        this.setState({doneStatus: 'You Won'});
        return;
      } 
      if(this.state.redraws === 0 && !this.possibleSolutions()) {
       console.log(1, 'Game Over!');
        this.setState({doneStatus: 'Game Over!'}); 
      }
    },
    render: function() {
      var selectedNumbers = this.state.selectedNumbers;
      var numberOfStars = this.state.numberOfStars;
      var correct = this.state.correct;
      var usedNumbers = this.state.usedNumbers;
      var redraws = this.state.redraws;
      var doneStatus = this.state.doneStatus;
      var bottomFrame;
      // console.log('bottomFrame', bottomFrame);
      if(doneStatus) {
        bottomFrame = <Doneframe doneStatus={doneStatus} resetGame={this.resetGame} />;
      } else {
        bottomFrame =<NumbersFrame selectedNumbers={selectedNumbers} selectNumber={this.selectNumber} usedNumbers={usedNumbers}/>;
      }
      
      return (
        <div id="game">
          <h2>Play Nine</h2>
          <div className="frames-wrapper">
            <StarsFrame  numberOfStars={numberOfStars}/>
            <ButtonFrame selectedNumbers={selectedNumbers} 
                        correct={correct} 
                        checkAnswer={this.checkAnswer} 
                        acceptAnswer={this.acceptAnswer}
                        redraw={this.redraw}
                        redraws={redraws}/>
            <AnswerFrame selectedNumbers={selectedNumbers} unselectNumber={this.unselectNumber}/>
          </div>
          {bottomFrame}
        </div>
        )
    }
  });
  ReactDOM.render(<Game />, document.getElementById('container'));  