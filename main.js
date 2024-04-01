
/* game variables

var correctPos;
var timeLeft;
var incorrectPos;
var answerButtons;
var currentScore = 0;
var highScore = 0;
var questionsLeft = 42;
var questionToAsk = Math.floor(Math.random() * 42);
var playingGame = false;
var easierFlag = false;
var playSound = true;
var answerArray = [];
var questionArray = [];
var displayedAnswerArray =[];
var hideDiv = document.getElementById("answerButtonPos");
var soundButton;
var previousHighScore = 0;
var quitButton;
var currentQuestion;
var rndNum3;
var correctAnswer;
var hiScoreCookie;
var partScoreCookie;
var getNumber;
var setHiScore;
var scoreDisplay;
var answerOne;
var answerTwo;
var answerThree;
var timerRunning;
var timerMusic;
var questionToRemove;
var startButton;
var alreadyPicked = false;

// game sounds. royalty free. credit in readme. //

const correctAnswerSound = new Audio("assets/sounds/correct.wav");
const incorrectAnswerSound = new Audio("assets/sounds/incorrect.wav");
const standardButtonClickSound = new Audio("assets/sounds/click.wav");
const simplifyButtonSound = new Audio("assets/sounds/easy.wav");
const countdownSound = new Audio("assets/sounds/timer.wav");
const newHighScoreSound = new Audio("assets/sounds/clapping.wav");
const endGameSound = new Audio("assets/sounds/fail.wav");
const crowdBooingSound = new Audio("assets/sounds/booing.wav");

// event listener function, handles all relevant button presses //

function buttonPressed(event){
  var button = event.target;
  var buttonPressed = button.innerText;
  event.preventDefault();
  answerButtons = document.getElementsByClassName("answerButton");
  if (buttonPressed === "START") {
    newHighScoreSound.pause();
    newHighScoreSound.currentTime = 0;
    crowdBooingSound.pause();
    crowdBooingSound.currentTime = 0;
    if (playSound) {
      standardButtonClickSound.play();
    }
    if (playingGame === false) {
      hideDiv.style.visibility = "visible";
      playingGame = true;
      startQuitDisplayed();
      setTimer();
      questionToAsk = Math.floor(Math.random() * questionsLeft);
      setTimeout(askQuestion, 1000);
    }
  } else if (buttonPressed === "SIMPLIFY") {
      if (playingGame && !easierFlag) {
        if (playSound) {
          simplifyButtonSound.play();
        }
      easierFlag = true;
      simplifyAnswers();
      }
    } else if (buttonPressed === "QUIT") {
      if (playingGame === true) {
      playingGame = false;
      currentScore = 0;
      if (highScore > previousHighScore) {
        highScore = previousHighScore;
        if (highScore < 10) {
          document.getElementById("highScore").innerHTML = "Best 0"+highScore;
        } else {
          document.getElementById("highScore").innerHTML = "Best "+highScore;
        }
      }
      countdownSound.pause();
      countdownSound.currentTime = 0;
      crowdBooingSound.pause();
      crowdBooingSound.currentTime = 0;
      newHighScoreSound.pause();
      newHighScoreSound.currentTime = 0;
      if (playSound) {
        endGameSound.play();
      }
      playingGame = false;
      timeLeft = 0;
      startButton.innerHTML = "";
      quitButton.innerHTML = "";
      setTimeout(endGame, 1500);
    }
  } else if (!alreadyPicked) {
    for (i=0; i<3; i++) {
      if (buttonPressed === answerButtons[i].innerText) {
        if (correctPos === i && playingGame && !alreadyPicked) {
          incorrectPos = -1;
          if (playSound) {
            correctAnswerSound.play();
          }
          highlightAnswers();
          quitButton.innerHTML = "";
          alreadyPicked = true;
          setTimeout(contGame, 1500);
        } else if (correctPos !== i && answerArray[i] !== "" && playingGame) {
          incorrectPos = i;
          if (playSound) {
            incorrectAnswerSound.play();
          }
          highlightAnswers();
          playingGame = false;
          quitButton.innerHTML = "";
          alreadyPicked = true;
          setTimeout(endGame, 1500);
        }
      }
    }
  }
}

// asks a question and randomises the answers positions //

function askQuestion() {
  correctPos = 0;
  easierFlag = false;
  alreadyPicked = false;
  if (questionsLeft > 0) {
    currentQuestion = document.getElementById("currentQuestion");
    currentQuestion.innerHTML = questionArray[questionToAsk].question;
    answerArray = [];
    for (i = 0; i < 3; i++) {
      rndNum3 = Math.floor(Math.random() * 3);
      if (answerArray[rndNum3] === undefined) {
        answerArray[rndNum3] = questionArray[questionToAsk].answers[i];
      } else {
        i--;
      }
    }
    correctAnswer = questionArray[questionToAsk].answers[0];
    displayAnswers();
    questionArray.splice(questionToAsk, 1);
    questionsLeft --;
    easierFlag = false;
    quitButton.innerHTML = "QUIT";
  } else {
    endGame();
   }
}

// check for high score cookie //

function checkCookie() {
  hiScoreCookie = document.cookie;
  if (hiScoreCookie === "") {
    alert("This site uses a cookie to store your high score. Please click OK to accept this cookie and play the quiz or close the browser tab to exit without setting a cookie.");
    document.cookie = "highScore=0; expires=Sat, 23 Nov 3000 12:00:00 UTC";
    highScore = 0;
  } else {
    partScoreCookie = document.cookie.split("=");
    setHiScore = partScoreCookie[1];
    getNumber = parseInt(setHiScore);
    highScore = getNumber;
    previousHighScore = highScore;
    if (highScore < 10) {
      document.getElementById("highScore").innerHTML = "Best 0"+highScore;
    } else {
      document.getElementById("highScore").innerHTML = "Best "+highScore;
    }
  }
}

// displays score, high score, sets the timer and asks a question //

function contGame() {
  if (easierFlag) {
    currentScore ++;
  } else {
    currentScore +=2;
  }
  if (currentScore > highScore) {
    highScore = currentScore;
    if (highScore < 10) {
      document.getElementById("highScore").innerHTML = "Best 0"+highScore;
    } else {
      document.getElementById("highScore").innerHTML = "Best "+highScore;
    }
  }
  scoreDisplay = document.getElementById("currentScore");
  if (currentScore < 10) {
    scoreDisplay.innerHTML = "Score 0" + currentScore;
  } else {
    scoreDisplay.innerHTML = "Score "+currentScore;
  }
  questionToAsk = Math.floor(Math.random() * questionsLeft);
  setTimer();
  setTimeout(askQuestion, 1000);
}

// create question array //

function createQuestionArray() {
  questionArray = [];
  fetch("./assets/questions.json")
  .then((res) => {
    return res.json();
  }).then ((jsonQuestions) => {
    questionArray = jsonQuestions;
  })
  .catch((err) => {
    console.error(err);
  });
}

// display answers //

function displayAnswers() {
  answerOne = document.getElementById("answerOne");
  answerTwo = document.getElementById("answerTwo");
  answerThree = document.getElementById("answerThree");
  answerOne.innerHTML = answerArray[0];
  answerTwo.innerHTML = answerArray[1];
  answerThree.innerHTML = answerArray[2];
  for (i=0; i < 3; i++) {
    if (answerArray[i] === correctAnswer) {
      correctPos = i;
    }
  }
}

// what happens at the end of a game //

function endGame() {
  quitButton.innerHTML = "";
  clearInterval(timerRunning);
  setInitialScreen();
  if (currentScore === 0) {
    document.getElementById("currentQuestion").innerHTML = "You got none right. Prepare to be taken to Shada for the rest of eternity. Or try again. It's up to you.";
    if (playSound) {
    crowdBooingSound.play();
    }
  } else if (currentScore === highScore && highScore !== 84) {
    if (playSound) {
      previousHighScore = highScore;
      newHighScoreSound.play();
    }
    if (highScore < 10) {
      document.getElementById("currentQuestion").innerHTML = "Congratulations! You have a high score of 0" + currentScore + ". Play again to see if you can beat it.";
    } else {
      document.getElementById("currentQuestion").innerHTML = "Congratulations! You have a high score of " + currentScore + ". Play again to see if you can beat it.";
    } 
    document.cookie = "highScore="+highScore+"; expires=Sat, 23 Nov 3000 12:00:00 UTC";
  } else if (currentScore === highScore && highScore === 84) {
    if (playSound) {
      previousHighScore = highScore;
      newHighScoreSound.play();
    }
    document.cookie = "highScore="+highScore+"; expires=Sat, 23 Nov 3000 12:00:00 UTC";
    document.getElementById("currentQuestion").innerHTML = "Wow! You scored 84, the maximum possible. Do you have access to the Matrix? You legend of Gallifrey. Press START to play again.";
  } else if (currentScore <10) {
    document.getElementById("currentQuestion").innerHTML = "You scored 0"+currentScore+". You probably need to reverse the polarity of the neutron flow, or at least have another go.";
  } else if (currentScore >=10) {
    document.getElementById("currentQuestion").innerHTML = "You scored "+currentScore+". Well done, worthy of a reward. Would you like a jelly baby? Press START to play again.";
  }
  easierFlag = false;
  playingGame = false;
  alreadyPicked = false;
  timeLeft = 0;
  questionsLeft = 42;
  questionToAsk = Math.floor(Math.random() * 42);
  currentScore = 0;
  answerArray = [];
  createQuestionArray();
  setTimeout(startQuitDisplayed, 2500);
}

// highlight correct(in green)  and incorrect(in red) answers //

function highlightAnswers() {
  countdownSound.pause();
  countdownSound.currentTime = 0;
  displayedAnswerArray = document.getElementsByClassName("answerStyle");
  if (incorrectPos === -1) {
    clearInterval(timerRunning);
    displayedAnswerArray[correctPos].style.backgroundColor = "green";
    displayedAnswerArray[correctPos].style.color = "white";
    setTimeout (resetAnswerColour, 1000);
  } else {
    clearInterval(timerRunning);
    displayedAnswerArray[correctPos].style.backgroundColor = "green";
    displayedAnswerArray[correctPos].style.color = "white";
    if (incorrectPos !== -1) {
    displayedAnswerArray[incorrectPos].style.backgroundColor = "red";
    displayedAnswerArray[incorrectPos].style.color = "white";
    setTimeout (resetAnswerColour, 2500);
    }
  }
}

// main game section //

function mainGameSection() {
  var rulesModal = document.getElementById("rulesModal");
  var rulesBtn = document.getElementById("buttonRules");
  var rulesSpan = document.getElementsByClassName("close")[0];
  createQuestionArray();
  rulesBtn.onclick = function() {
    if (!playingGame) {
      if (playSound) {
      standardButtonClickSound.play();
      }
    
    
      rulesModal.style.display = "block";
    }
    rulesSpan.onclick = function() {
      rulesModal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target === rulesModal) {
        rulesModal.style.display = "none";
      }
    }
  }
}

// reset answer colours //

function resetAnswerColour() {
  displayedAnswerArray[correctPos].style.backgroundColor = "white";
  displayedAnswerArray[correctPos].style.color = "black";
    if (incorrectPos !== -1) {
      displayedAnswerArray[incorrectPos].style.backgroundColor ="white";
      displayedAnswerArray[incorrectPos].style.color = "black";
    }
  } 

// how the pregame screen looks //

function setInitialScreen() {
  document.getElementById("currentQuestion").innerHTML = "Press Start to play or Rules for how to play the quiz.";
  document.getElementById("answerOne").innerHTML = "";
  document.getElementById("answerTwo").innerHTML = "";
  document.getElementById("answerThree").innerHTML = "";
  document.getElementById("countdownTimer").innerHTML = "00";
  document.getElementById("currentScore").innerHTML = "Score 00";
  hideDiv.style.visibility = "hidden";
}

// set the 30 second timer function //

function setTimer() {
  timerMusic = setTimeout(timerSound, 1000);
  timeLeft = 30;
  timerRunning = setInterval(timer, 1000);
}

// remove one incorrect answer //

function simplifyAnswers() {
  questionToRemove = Math.floor(Math.random() * 2);
  while (questionToRemove === correctPos) {
    questionToRemove = Math.floor(Math.random() * 2);
  }
  for (i = 0; i < 3; i++) {
    if (answerArray[i] !== correctAnswer && i === questionToRemove) {
      answerArray[i] = "";
  }
}
  displayAnswers();
}

// switch between start/quit being shown on their buttons //

function startQuitDisplayed() {
  startButton = document.getElementById("buttonStart");
  quitButton = document.getElementById("buttonQuit");
  if (playingGame) {
    startButton.innerHTML = "";
    quitButton.innerHTML = "QUIT";
  } else {
    startButton.innerHTML = "START";
    quitButton.innerHTML = "";
  }
}

// the actual timer function //

function timer() {
  if (timeLeft < 0) {
    countdownSound.pause();
    countdownSound.currentTime = 0;
    if (playSound) {
      endGameSound.play();
    }
    document.getElementById("countdownTimer").innerHTML = "00";
    endGame();
  } else if (timeLeft >= 10) {
    document.getElementById("countdownTimer").innerHTML = timeLeft;
  } else {
    document.getElementById("countdownTimer").innerHTML = "0" + timeLeft;
    quitButton.innerHTML = "";
  }
  timeLeft --;
}

// play the countdown sound //

function timerSound() {
  if (playSound && playingGame) {
  countdownSound.play();
  }
}

// toggle sound on/off //

function toggleSound() {
  soundButton = document.getElementById("buttonSound");
  if (playSound) {
    playSound = false;
    soundButton.innerHTML = '<i class="fa fa-volume-off" aria-hidden="true">';
    countdownSound.pause();
    crowdBooingSound.pause();
    newHighScoreSound.pause();
  } else {
    playSound = true;
    soundButton.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
    if (playingGame) {
    countdownSound.play();
    }
  }
}

// sets the event listeners for all buttons and starts the game //

document.querySelectorAll("button").forEach((b)=>b.addEventListener("click", buttonPressed));
setTimeout(checkCookie, 500);
hideDiv.style.visibility = "hidden";
mainGameSection(); */

// NEW JS CODE //

function buttonVolume() {
  console.log("volume button clicked");
}

function buttonStart() {
  console.log("start button clicked");
}

function buttonQuit() {
  console.log("quit button clicked");
}

function buttonRules() {
  console.log("rules button clicked");
}

function buttonAnswerA() {
  console.log("answer button a clicked");
}

function buttonAnswerB() {
  console.log("answer button b clicked");
}

function buttonAnswerC() {
  console.log("answer button c clicked");
}

function buttonSimplify() {
  console.log("simplify button clicked");
}