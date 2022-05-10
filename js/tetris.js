//TODO Increase speed at certain scores
//TODO Add area with current score and high score

document.addEventListener('DOMContentLoaded', () => {
    const width = 10
    let nextRandom = 0
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let timerId
    let score = 0
    let isGameOver = false
    let speed = 1000
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    const lTetromino = [
        [0, width, width*2, width*2+1],
        [0, width, 1, 2],
        [0, 1, width+1, width*2+1],
        [2, width+2, width+1, width]
    ]
    
    const zTetromino = [
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1],
        [1, 2, width, width+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [width, width+1, width+2, 1],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, 
        oTetromino, iTetromino]

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][0];
    let currentRotation = 0;
    let currentPosition = 4;

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //When user clicks 'Restart'
    function clearBoard() {
        squares.forEach(index => {
            if(index.classList.contains('tetromino taken')){
                index.classList.remove('tetromino taken')
            }
            if(index.classList.contains('tetromino')){
                index.removeAttribute('class')
            }
            index.removeAttribute('style')
        })
    }

    //assign functions to keyCodes
    document.addEventListener('keydown', function(e){
        if(!isGameOver){ //ignore controls if game is over
            switch (e.key) {
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    rotate();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    moveDown();
                    break;
            }
        }
    })

    //move down function
    function moveDown () {
        undraw();
        currentPosition += width;
        draw();
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }

        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }

        draw()
    }

///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }

    function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }



    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            //if current rotation is 4, go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }


    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //the tetrominos without rotations
    const upNextTetrominoes = [
        [0, displayWidth, displayWidth*2, displayWidth*2+1],
        [1, 2, displayWidth, displayWidth+1],
        [displayWidth, displayWidth+1, displayWidth+2, 1],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],
    ]

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (startBtn.innerHTML != 'Restart'){
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            } else {
                draw()
                timerId = setInterval(moveDown, speed)
                nextRandom = Math.floor(Math.random()*theTetrominoes.length);
                displayShape()
            }
        } else {
            startBtn.innerHTML = 'Start/Pause'
            score = 0
            scoreDisplay.innerHTML = score
            clearBoard()
            timerId = setInterval(moveDown, speed)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape()

        }
        isGameOver = false
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                if (score % 50 == 0){
                    increaseSpeed()
                    timerId = setInterval(moveDown, speed)
                }
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function increaseSpeed() {
        speed -= 500
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'Game Over'
            startBtn.innerHTML = 'Restart'
            clearInterval(timerId)
            timerId = null
            isGameOver = true
        }
    }

    


})