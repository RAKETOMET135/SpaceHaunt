function distance(a, b){
    const xAxisDiff = Math.abs(a[0] - b[0])
    const yAxisDiff = Math.abs(a[1] - b[1])

    return Math.sqrt(Math.pow(xAxisDiff, 2) + Math.pow(yAxisDiff, 2))
}

function getNumberFromPixelString(pixelString){
    const number = pixelString.slice(0, pixelString.length - 2)

    return parseInt(number)
}

function getPositionFromStyle(element){
    const computedStyle = window.getComputedStyle(element)

    const x = getNumberFromPixelString(computedStyle.left)
    const y = getNumberFromPixelString(computedStyle.top)

    return [x, y]
}

function getSizeFromStyle(element){
    const computedStyle = window.getComputedStyle(element)

    const x = getNumberFromPixelString(computedStyle.width)
    const y = getNumberFromPixelString(computedStyle.height)

    return [x, y]
}

export { distance, getNumberFromPixelString, getPositionFromStyle, getSizeFromStyle }