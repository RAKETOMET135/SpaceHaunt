import { play, resetData } from "./Modules/menu.js"
import { generateWorld } from "./Modules/world_generation.js"
import { spawnPlayer, handleUserInput, isPlayer } from "./Modules/player.js"

function keyDown(e){
    if (isPlayer()){
        handleUserInput(e.key, "down")
    }
}

function keyUp(e){
    if (isPlayer()){
        handleUserInput(e.key, "up")
    }
}

function main(){
    const playButton = document.querySelector("#play-button")
    const resetDataButton = document.querySelector("#reset-data-button")

    playButton.addEventListener("click", () => {
        play()
        generateWorld()
        spawnPlayer([850, 500], 400)
    })
    resetDataButton.addEventListener("click", resetData)

    document.body.addEventListener("keydown", keyDown)
    document.body.addEventListener("keyup", keyUp)
}

main()