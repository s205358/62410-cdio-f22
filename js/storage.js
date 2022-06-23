/**
 * Handles storage
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */

/**
 * Save game to history
 * 
 * @param {*} game 
 */
function saveGame(game) {
  console.log('Saving game...')
  let gameHistory = loadGame()
  if (!gameHistory) {
    gameHistory = []
  }
  gameHistory.push(game)
  window.localStorage.setItem('game-history', JSON.stringify(gameHistory))
}

/**
 * Loads game history
 * 
 * @returns 
 */
function loadGame() {
  console.log('Loading game...')
  let gameHistory = JSON.parse(window.localStorage.getItem('game-history'));
  return gameHistory;
}

/**
 * Loads last game from history
 * 
 * @returns game
 */
function loadLastGame() {
  console.log('Loading last game...')
  let gameHistory = loadGame()
  if (!gameHistory) {
    return null
  }
  return gameHistory[gameHistory.length - 1]
}

/**
 * Undos last move
 */
function undoLastMove() {
  console.log('Undoing last move...')
  let gameHistory = loadGame()
  gameHistory.pop();
  window.localStorage.setItem('game-history', JSON.stringify(gameHistory))
}

/**
 * Resets game
 */
function resetGame() {
  window.localStorage.removeItem('game-history')
}