const canvas = document.getElementById("canvas")
const text = document.getElementById("text")
const record = document.getElementById("record")
const countDown = document.getElementById("count-down")
const context = canvas.getContext("2d")
const BACKGROUND_COLOR = 'black'
const GRID_COLOR = 'black'
const CELL = 30
canvas.width = 10 * CELL
canvas.height = 20 * CELL

context.fillStyle = BACKGROUND_COLOR
context.fillRect(0,0,canvas.width,canvas.height)
context.scale(CELL, CELL)

const colors = [
    null,
    'red',
    'blue',
    'yellow',
    'green',
    'purple',
    'pink',
    'violet'
]
var recordObject = getCookieObject('record')
var recordPoint = recordObject? recordObject.point : 0
record.innerHTML =  "Record: " +  recordPoint
var score = 0 
text.innerHTML = score
var boardMatrix = createBoardMatrix()
var shape = new Shape()
shape.draw()

let secondsLeft = 30
countDown.innerHTML = secondsLeft
let dropDelay = 1000
let lastTime = 0
let deltaTime = 0
function gameLoop(time = 0){
    if(secondsLeft === 0){
        gameOver()
    }
    clearScreen()
    deltaTime = time - lastTime
    lastTime = time
    shape.dropCounter += deltaTime
    if(shape.dropCounter >= dropDelay){
        shape.drop()
        secondsLeft --
        countDown.innerHTML = secondsLeft
    }
    shape.draw()
    drawBoardMatrix()
    highLightPoints(shape)
    drawGrid()
    requestAnimationFrame(gameLoop)
}

gameLoop()

document.onkeydown = event =>{
    switch(event.keyCode){
        case 37:
            shape.move(-1)
            break
        case 39:
            shape.move(1)
            break
        case 40:
            shape.drop()
            break
        case 32:
            shape.rotate()
            break
        case 38:
            shape.place()
            break
    }
}
var xList = []
function highLightPoints(shape){
    xList = []
    shape.matrix.forEach(row=>{
        row.forEach((number, x)=>{
            if(number !== 0){
                xList.push(x + shape.position.x)
            }
        })
    })
    
    context.fillStyle = 'white'
    boardMatrix.forEach((row, y)=>{
        row.forEach((number, x)=>{
            if(number !== 0 && xList.includes(x)){
                context.fillRect(x, y, 1, 1) 
            }
        })
    })
}

function drawBoardMatrix(){
    boardMatrix.forEach((row, y)=>{
        row.forEach((number, x)=>{
            if(number !== 0){
                context.fillStyle = colors[number]
                context.fillRect(x, y, 1, 1)
            }
        })
    })
}
function clearScreen(){
    context.fillStyle = BACKGROUND_COLOR
    context.fillRect(0,0,canvas.width,canvas.height)
}
function rotateMatrix(matrix, clockWise){
    for(let y = 0; y< matrix.length;y++){
        for(let x = 0; x< y; x++){
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]
        }
    }
    if(clockWise > 0){
        matrix.forEach(row=>row.reverse())
    }
    else if(clockWise<0){
        matrix.reverse()
    }
} 
function isCollide(boardMatrix, shape){
    for(let y = 0; y<shape.matrix.length; y++ ){
        for(let x = 0; x<shape.matrix[y].length; x++ ){
            if(shape.matrix[y][x] !== 0 && boardMatrix[y+shape.position.y]?.[x+shape.position.x] !==0){
                return true
            }
        }
    }
    return false
}
function createBoardMatrix(){
    // Matrix 20 x 10
    let matrix = []
    for(let i = 0; i< 20; i++){
        matrix.push(new Array(10).fill(0))
    }
    return matrix
}
function mergeShapeMatrixToBoardMatrix(shape){
    shape.matrix.forEach((row,y)=>{
        row.forEach((number,x)=>{
            if(number !== 0)
                boardMatrix[y+shape.position.y][x+shape.position.x] = number
        })
    })
}
function handleBoardSweep(){
    let totalScore = 0
    let rowScore = 10
    outerLoop: for(let y = boardMatrix.length - 1; y>=0; y--){
        for(let x =0; x<boardMatrix[y].length;x++){
            if(boardMatrix[y][x] === 0){
                continue outerLoop
            }
        }
        totalScore += rowScore
        rowScore *= 2
        let removedRow = boardMatrix.splice(y, 1)[0].fill(0)
        boardMatrix.unshift(removedRow)
        y++
    }
    score+=totalScore
    text.innerHTML = score
}
function drawGrid(){
    context.strokeStyle = GRID_COLOR
    for(let i=0;i<21;i++){
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(10, i);
        context.lineWidth = 1/CELL * 2
        context.stroke();
    }
    for(let i=0;i<11;i++){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, 20);
        context.lineWidth = 1/CELL * 2
        context.stroke();
    }
}
function uploadCookie(cookieName, givenObject) {
    var now = new Date()
    now.setMonth(now.getMonth() + 1)
    document.cookie = `${cookieName} = ` + JSON.stringify(givenObject) + "; expires = " + now.toUTCString() + ";";
}
function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getCookieObject(cookieName) {
    //tra ve object tu cookie
    const cookieData = getCookie(cookieName)//string
    if (cookieData) {
        const cookieObject = JSON.parse(cookieData)
        if (cookieObject) {
            return cookieObject
        }
    }
    return null
}
function gameOver(){
    boardMatrix.forEach(row=>row.fill(0))
    if(score > recordPoint){
        recordPoint = score
        record.innerHTML =  "Record: " +  recordPoint
        uploadCookie("record", {point: score})
    }
    score = 0
    text.innerHTML = score
    secondsLeft = 30
    shape.resetShape()
}