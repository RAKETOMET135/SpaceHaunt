import { getRandomNumber } from "./random_number.js"
import { getPositionFromStyle, getNumberFromPixelString, getSizeFromStyle } from "./distance.js"
import { distance } from "./distance.js"
import { play } from "./menu.js"

const gameWorld = document.querySelector("#game-world")

let rooms = []
let lastRoomDirection = ""
let firstRoomDirection = ""
let currentPlayerPosition = null

function createRoom(isStartRoom, insertAtStart){
    const room = document.createElement("div")
    const roomStyle = room.style

    room.classList = ["room-floor"]

    const roomWidth = 500
    const roomHeight = 500

    roomStyle.width = roomWidth + "px"
    roomStyle.height = roomHeight + "px"

    if (isStartRoom){
        roomStyle.left = (960 - roomWidth/2).toString() + "px"
        roomStyle.top = (540 - roomHeight/2).toString() + "px"
    }
    else{
        if (!insertAtStart){
            const lastRoom = rooms[rooms.length - 1]
            const computedLastRoomStyle = window.getComputedStyle(lastRoom)
            const lastRoomPosition = getPositionFromStyle(lastRoom)
    
            let randomNumber = getRandomNumber(0, 3)
            let x
            let y
    
            if (lastRoomDirection === "up" && randomNumber === 2) randomNumber = 0
            if (lastRoomDirection === "dwon" && randomNumber === 1) randomNumber = 0
    
            if (randomNumber === 0){
                x = lastRoomPosition[0] + getNumberFromPixelString(computedLastRoomStyle.width)
                //y = lastRoomPosition[1] + getNumberFromPixelString(computedLastRoomStyle.height) / 2 - getNumberFromPixelString(roomStyle.height) / 2
                y = lastRoomPosition[1]
                lastRoomDirection = "forward"
            }
            else if (randomNumber === 1){
                x = lastRoomPosition[0]
                y = lastRoomPosition[1] - getNumberFromPixelString(roomStyle.height) / 2
                lastRoomDirection = "up"
            }
            else if (randomNumber === 2){
                x = lastRoomPosition[0]
                y = lastRoomPosition[1] + getNumberFromPixelString(computedLastRoomStyle.height)
                lastRoomDirection = "down"
            }
    
            if (currentPlayerPosition){
                if (distance(currentPlayerPosition, [x, y]) < 1000){
                    room.remove()
                    
                    return
                }
            } 
    
            roomStyle.left = x + "px"
            roomStyle.top = y + "px"
        }
        else{
            const firstRoom = rooms[0]
            const computedFirstRoomStyle = window.getComputedStyle(firstRoom)
            const firstRoomPosition = getPositionFromStyle(firstRoom)
    
            let randomNumber = getRandomNumber(0, 3)
            let x
            let y
    
            if (firstRoomDirection === "up" && randomNumber === 2) randomNumber = 0
            if (firstRoomDirection === "dwon" && randomNumber === 1) randomNumber = 0
    
            if (randomNumber === 0){
                x = firstRoomPosition[0] - roomWidth
                //y = lastRoomPosition[1] + getNumberFromPixelString(computedLastRoomStyle.height) / 2 - getNumberFromPixelString(roomStyle.height) / 2
                y = firstRoomPosition[1]
                firstRoomDirection = "forward"
            }
            else if (randomNumber === 1){
                x = firstRoomPosition[0]
                y = firstRoomPosition[1] - getNumberFromPixelString(roomStyle.height) / 2
                firstRoomDirection = "up"
            }
            else if (randomNumber === 2){
                x = firstRoomPosition[0]
                y = firstRoomPosition[1] + getNumberFromPixelString(computedFirstRoomStyle.height)
                firstRoomDirection = "down"
            }
    
            if (currentPlayerPosition){
                if (distance(currentPlayerPosition, [x, y]) < 1000){
                    room.remove()
                    
                    return
                }
            } 
    
            roomStyle.left = x + "px"
            roomStyle.top = y + "px"
        }
    }

    document.body.append(room)

    if (!insertAtStart){
        rooms.push(room)
    }
    else{
        rooms.unshift(room)
    }
}

function checkRooms(playerPosition){
    rooms.forEach(room => {
        const roomPosition = getPositionFromStyle(room)
        const roomSize = getSizeFromStyle(room)

        if (roomPosition[0] + roomSize[0] < -1000){
            room.remove()
        }

    })

    const lastRoom = rooms[rooms.length -1]
    const lastRoomPosition = getPositionFromStyle(lastRoom)

    const firstRoom = rooms[0]
    const firstRoomPosition = getPositionFromStyle(firstRoom)

    if (distance(playerPosition, lastRoomPosition) < 4000){
        createRoom(false, false)
    }

    if (distance(playerPosition, firstRoomPosition) < 4000){
        createRoom(false, true)
    }

    currentPlayerPosition = playerPosition
}

function generateWorld(){
    createRoom(true, false)

    for (let i = 0; i < 30; i++){
        createRoom(false, false)
    }
}

function getGeneratedRooms(){
    return rooms
}

export { generateWorld, getGeneratedRooms, checkRooms }