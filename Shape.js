class Shape{
    constructor(){
        this.matrix = this.getRandomMatrix()
        this.position = {x: 3, y:0}
        this.dropCounter = 0
    }
    getRandomMatrix(){
        let shapeList =   [
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
            [
                [0,2,0],
                [0,2,0],
                [2,2,0]
            ],
            [
                [0,3,0],
                [0,3,0],
                [0,3,3]
            ],
            [
                [4,4],
                [4,4]
            ],
            [
                [0,5,5],
                [5,5,0],
                [0,0,0]
            ],
            [
                [6,6,0],
                [0,6,6],
                [0,0,0]
            ],
            [
                [7,7,7],
                [0,7,0],
                [0,0,0]
            ]
        ]
        return shapeList[Math.random()*shapeList.length|0]
    }
    draw(){
        this.matrix.forEach((row, y) => {
            row.forEach((number, x)=>{
                if(number !== 0){
                    context.fillStyle = colors[number]
                    context.fillRect(x+this.position.x, y+this.position.y, 1, 1)
                }
            })
        })
    }
    drop(){
        this.position.y++
        this.dropCounter = 0
        if(isCollide(boardMatrix, this)){
            this.position.y--
            mergeShapeMatrixToBoardMatrix(this)
            handleBoardSweep()
            this.resetShape()
        }
    }
    place(){
        this.dropCounter = 0
        while(!isCollide(boardMatrix, this)){
            this.position.y++
        }
        this.position.y--
        mergeShapeMatrixToBoardMatrix(this)
        handleBoardSweep()
        this.resetShape()
    }
    resetShape(){
        this.matrix = this.getRandomMatrix()
        this.position = {x: 3, y:0}
        this.dropCounter = 0
        if(isCollide(boardMatrix, this)){
            boardMatrix.forEach(row=>row.fill(0))
            if(score > recordPoint){
                recordPoint = score
                record.innerHTML =  "Record: " +  recordPoint
                uploadCookie("record", {point: score})
            }
            score = 0
            text.innerHTML = score
        }
    }
    move(horizontal){
        this.position.x+=horizontal
        if(isCollide(boardMatrix, this))
            this.position.x-=horizontal
        
    }
    rotate(){
        rotateMatrix(this.matrix, 1)
        if(isCollide(boardMatrix, this)){
            rotateMatrix(this.matrix, -1)
        }
    }
}