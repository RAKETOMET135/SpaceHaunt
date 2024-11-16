import { distance, getPositionFromStyle, getSizeFromStyle } from "./distance.js"
import { isIntersection } from "./collision.js"
import { getGeneratedRooms, checkRooms } from "./world_generation.js"
import { play } from "./menu.js"

const gameWorld = document.querySelector("#game-world")

let currentPlayer
let loopInterval
let lastLoopCycleTime = Date.now()

class Player{
    constructor(playerElement, startPosition, playerMovespeed){
        this.playerElement = playerElement
        this.x = startPosition[0]
        this.y = startPosition[1]
        this.vertical = 0
        this.horizontal = 0
        this.movementLocked = false
        this.playerMovespeed = playerMovespeed
    }
}

function createPlayerElement(){
    const playerElement = document.createElement("img")
    
    playerElement.id = "player"

    document.body.append(playerElement)

    return playerElement
}

function removePreviousPlayer(){
    if (currentPlayer.playerElement){
        currentPlayer.playerElement.remove()
    }

    removeInterval(loopInterval)
}

function spawnPlayer(position, playerMovespeed){
    const spawnPositionX = position[0]
    const spawnPositionY = position[1]

    const playerElement = createPlayerElement()
    const playerElementStyle = playerElement.style

    if (currentPlayer){
        removePreviousPlayer()
    }

    currentPlayer = new Player(playerElement, position, playerMovespeed)

    updatePlayer()
    
    loopInterval = setInterval(loop, 1000 / 60)
    
    return playerElement
}

function updatePlayer(){
    const playerElementStyle = currentPlayer.playerElement.style

    playerElementStyle.left = currentPlayer.x + "px"
    playerElementStyle.top = currentPlayer.y + "px"
}

function updateCamera(moveX, moveY, rooms){
    
    rooms.forEach(room => {
        const roomStyle = room.style
        const roomPosition = getPositionFromStyle(room)

        roomStyle.left = (roomPosition[0] - moveX).toString() + "px"
        roomStyle.top = (roomPosition[1] - moveY).toString() + "px"
    })
}

function handleUserInput(userActionKeyString, state){
    if (userActionKeyString === "w"){
        if (state === "down"){
            currentPlayer.vertical = 1
        }
        else{
            if (currentPlayer.vertical === 1){
                currentPlayer.vertical = 0
            }
        }
    }
    else if (userActionKeyString === "s"){
        if (state === "down"){
            currentPlayer.vertical = -1
        }
        else{
            if (currentPlayer.vertical === -1){
                currentPlayer.vertical = 0
            }
        }
    }
    else if (userActionKeyString === "d"){
        if (state === "down"){
            currentPlayer.horizontal = 1
        }
        else{
            if (currentPlayer.horizontal === 1){
                currentPlayer.horizontal = 0
            }
        }
    }
    else if (userActionKeyString === "a"){
        if (state === "down"){
            currentPlayer.horizontal = -1
        }
        else{
            if (currentPlayer.horizontal === -1){
                currentPlayer.horizontal = 0
            }
        }
    }
}

function checkCollision(moveX, moveY, rooms){
    const playerSize = getSizeFromStyle(currentPlayer.playerElement)
    const playerPosition = [currentPlayer.x + moveX, currentPlayer.y + moveY]

    const checkPoints = [
        [[playerPosition[0] + playerSize[0], playerPosition[1] - playerSize[1] / 1.01], "right-top"],
        [[playerPosition[0] + playerSize[0], playerPosition[1] + playerSize[1] / 1.01], "right-bottom"],
        [[playerPosition[0] - playerSize[0], playerPosition[1] - playerSize[1] / 1.01], "left-top"],
        [[playerPosition[0] - playerSize[0], playerPosition[1] + playerSize[1] / 1.01], "left-bottom"],
        [[playerPosition[0] - playerSize[0] / 1.01, playerPosition[1] - playerSize[1]], "top-right"],
        [[playerPosition[0] + playerSize[0] / 1.01, playerPosition[1] - playerSize[1]], "top-left"],
        [[playerPosition[0] - playerSize[0] / 1.01, playerPosition[1] + playerSize[1]], "bottom-right"],
        [[playerPosition[0] + playerSize[0] / 1.01, playerPosition[1] + playerSize[1]], "bottom-left"]
    ]

    let isCheckPoints = [false, false, false, false]

    rooms.forEach(room => {
        const playerCollision = isIntersection(playerPosition, playerSize, getPositionFromStyle(room), getSizeFromStyle(room))

        if (playerCollision){
            for (let i = 0; i < checkPoints.length; i++){
                const point = checkPoints[i]
                const isCollision = isIntersection(point[0], playerSize, getPositionFromStyle(room), getSizeFromStyle(room))
    
                if (isCollision){
                    isCheckPoints[i] = true
                }
            }
        }
    })

    for (let i = 0; i < checkPoints.length; i++){
        const isCheckPoint = isCheckPoints[i]

        if (isCheckPoint) continue

        const point = checkPoints[i]
        const pointName = point[1]
    
        if (pointName === "right-top" && moveX > 0 || pointName === "right-bottom" && moveX > 0) moveX = 0
        if (pointName === "left-top" && moveX < 0 || pointName === "left-bottom" && moveX < 0) moveX = 0

        if (pointName === "top-right" && moveY < 0 || pointName === "top-left" && moveY < 0) moveY = 0
        if (pointName === "bottom-right" && moveY > 0 || pointName === "bottom-left" && moveY > 0) moveY = 0
    }

    return [moveX, moveY]
}

function loop(){
    if (currentPlayer.movementLocked){
        return
    }

    let currentLoopCycle = Date.now()
    let deltaTime = (currentLoopCycle - lastLoopCycleTime) / 1000

    let moveX = currentPlayer.playerMovespeed * currentPlayer.horizontal * deltaTime
    let moveY = -currentPlayer.playerMovespeed * currentPlayer.vertical * deltaTime

    //currentPlayer.x += moveX
    //currentPlayer.y += moveY

    const rooms = getGeneratedRooms()

    const newPosition = checkCollision(moveX, moveY, rooms)
    moveX = newPosition[0]
    moveY = newPosition[1]
    
    updatePlayer()
    updateCamera(moveX, moveY, rooms)
    checkRooms([currentPlayer.x, currentPlayer.y])

    lastLoopCycleTime = currentLoopCycle
}

function isPlayer(){
    if (currentPlayer){
        return true
    }

    return false
}

export { spawnPlayer, handleUserInput, isPlayer }