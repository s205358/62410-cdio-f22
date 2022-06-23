/**
 * Inits game (expects image of cards to be shown in canvas)
 * 
 * @returns game
 */
function init() {
  // Load image
  let image = cv.imread('canvas');

  let processedImage = processImage(image)

  let cards = detectCardObjects(processedImage)

  let cardObjects = grabObjectsFromImage(cards, image)

  let cardObjectsWithValues = appendCardValues(cardObjects)

  let cardObjectsWithValuesAndPositions = findPositions(cardObjectsWithValues)

  let game = getGameFromCardObjects(cardObjectsWithValuesAndPositions)

  let previousGame = loadLastGame()

  console.log(game);

  if (previousGame) {
    game = findChangeInGame(game, previousGame)
  }

  console.log(game);

  return game
}

/**
 * Solves game by finding best move
 * 
 * @param {*} game 
 * @returns best move
 */
function solve(game) { 
  let moves = findMoves(game)
  let move = bestMove(moves, game)
  console.log(move)
  return [move]
}