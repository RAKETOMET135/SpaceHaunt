import { getRandomNumber } from "./random_number.js"
import { getPositionFromStyle, getNumberFromPixelString } from "./distance.js"

const gameWorld = document.querySelector("#game-world")

let rooms = []

function createRoom(isStartRoom){
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
        const lastRoom = rooms[rooms.length - 1]
        const computedLastRoomStyle = window.getComputedStyle(lastRoom)
        const lastRoomPosition = getPositionFromStyle(lastRoom)

        let randomNumber = getRandomNumber(0, 3)
        let x
        let y

        if (randomNumber === 0){
            x = lastRoomPosition[0] + getNumberFromPixelString(computedLastRoomStyle.width)
            y = lastRoomPosition[1] + getNumberFromPixelString(computedLastRoomStyle.height) / 2 - getNumberFromPixelString(roomStyle.height) / 2
        }
        else if (randomNumber === 1){
            x = lastRoomPosition[0]
            y = lastRoomPosition[1] - getNumberFromPixelString(roomStyle.height) / 2
        }
        else if (randomNumber === 2){
            x = lastRoomPosition[0]
            y = lastRoomPosition[1] + getNumberFromPixelString(computedLastRoomStyle.height)
        }

        roomStyle.left = x + "px"
        roomStyle.top = y + "px"
    }

    document.body.append(room)

    rooms.push(room)
}

function generateWorld(){
    createRoom(true)

    for (let i = 0; i < 50; i++){
        createRoom(false)
    }
}

function getGeneratedRooms(){
    return rooms
}

export { generateWorld, getGeneratedRooms }