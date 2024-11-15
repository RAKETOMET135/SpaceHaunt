function getRandomNumber(minInclusive, maxExclusive){
    const numberRange = Math.abs(minInclusive - maxExclusive)

    let randomNumber = Math.floor(Math.random() * numberRange)

    randomNumber += Math.min(minInclusive, maxExclusive)

    return randomNumber
}

export { getRandomNumber }