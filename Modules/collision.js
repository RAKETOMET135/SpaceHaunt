function isIntersection(positionA, sizeA, positionB, sizeB){
    return positionA[0] < positionB[0] + sizeB[0] &&
           positionA[0] + sizeA[0] > positionB[0] &&
           positionA[1] < positionB[1] + sizeB[1] &&
           positionA[1] + sizeA[1] > positionB[1]
}

export { isIntersection }