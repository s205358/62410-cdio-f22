/**
 * Tests performance of game
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 */
const cards = [
  { suit: { short: 'C' }, rank: { short: 1 } },
  { suit: { short: 'C' }, rank: { short: 2 } },
  { suit: { short: 'C' }, rank: { short: 3 } },
  { suit: { short: 'C' }, rank: { short: 4 } },
  { suit: { short: 'C' }, rank: { short: 5 } },
  { suit: { short: 'C' }, rank: { short: 6 } },
  { suit: { short: 'C' }, rank: { short: 7 } },
  { suit: { short: 'C' }, rank: { short: 8 } },
  { suit: { short: 'C' }, rank: { short: 9 } },
  { suit: { short: 'C' }, rank: { short: 10 } },
  { suit: { short: 'C' }, rank: { short: 11 } },
  { suit: { short: 'C' }, rank: { short: 12 } },
  { suit: { short: 'C' }, rank: { short: 13 } },
  { suit: { short: 'D' }, rank: { short: 1 } },
  { suit: { short: 'D' }, rank: { short: 2 } },
  { suit: { short: 'D' }, rank: { short: 3 } },
  { suit: { short: 'D' }, rank: { short: 4 } },
  { suit: { short: 'D' }, rank: { short: 5 } },
  { suit: { short: 'D' }, rank: { short: 6 } },
  { suit: { short: 'D' }, rank: { short: 7 } },
  { suit: { short: 'D' }, rank: { short: 8 } },
  { suit: { short: 'D' }, rank: { short: 9 } },
  { suit: { short: 'D' }, rank: { short: 10 } },
  { suit: { short: 'D' }, rank: { short: 11 } },
  { suit: { short: 'D' }, rank: { short: 12 } },
  { suit: { short: 'D' }, rank: { short: 13 } },
  { suit: { short: 'H' }, rank: { short: 1 } },
  { suit: { short: 'H' }, rank: { short: 2 } },
  { suit: { short: 'H' }, rank: { short: 3 } },
  { suit: { short: 'H' }, rank: { short: 4 } },
  { suit: { short: 'H' }, rank: { short: 5 } },
  { suit: { short: 'H' }, rank: { short: 6 } },
  { suit: { short: 'H' }, rank: { short: 7 } },
  { suit: { short: 'H' }, rank: { short: 8 } },
  { suit: { short: 'H' }, rank: { short: 9 } },
  { suit: { short: 'H' }, rank: { short: 10 } },
  { suit: { short: 'H' }, rank: { short: 11 } },
  { suit: { short: 'H' }, rank: { short: 12 } },
  { suit: { short: 'H' }, rank: { short: 13 } },
  { suit: { short: 'S' }, rank: { short: 1 } },
  { suit: { short: 'S' }, rank: { short: 2 } },
  { suit: { short: 'S' }, rank: { short: 3 } },
  { suit: { short: 'S' }, rank: { short: 4 } },
  { suit: { short: 'S' }, rank: { short: 5 } },
  { suit: { short: 'S' }, rank: { short: 6 } },
  { suit: { short: 'S' }, rank: { short: 7 } },
  { suit: { short: 'S' }, rank: { short: 8 } },
  { suit: { short: 'S' }, rank: { short: 9 } },
  { suit: { short: 'S' }, rank: { short: 10 } },
  { suit: { short: 'S' }, rank: { short: 11 } },
  { suit: { short: 'S' }, rank: { short: 12 } },
  { suit: { short: 'S' }, rank: { short: 13 } },
];

function formatCards(cards) {
  return cards.map((card) => {
    return {
      suit: {
        short: renameSuit(card.slice(0, 1))
      },
      rank: {
        short: parseInt(card.slice(1))
      }
    }
  })
}

function reformatCards(cards) {
  return cards.map((card) => {
    return `${danishSuit(card.suit.short)}${card.rank.short}`
  })
}

function renameSuit(suit) {
  if (suit === 'R') {
    return 'D'
  } else if (suit === 'K') {
    return 'C'
  } else {
    return suit
  }
}

function danishSuit(suit) {
  if (suit === 'D') {
    return 'R'
  } else if (suit === 'C') {
    return 'K'
  } else {
    return suit
  }
}

function reorderCards(cards) {
  let reversedCards = cards.reverse()

  let j = 0;
  let k = 7;
  let tableauPiles = [[], [], [], [], [], [], []]
  for (let i = 0; i < 28; i++) {
    const card = reversedCards[i];
    tableauPiles[j].push(card)
    j++
    if (j == 7) {
      k -= 1
      j -= k
    }
  }

  let stockPile = reversedCards.slice(28)

  console.log(stockPile)

  return [
    ...tableauPiles[0],
    ...tableauPiles[1],
    ...tableauPiles[2],
    ...tableauPiles[3],
    ...tableauPiles[4],
    ...tableauPiles[5],
    ...tableauPiles[6],
    ...stockPile
  ]
}

function reverseorderCards(cards) {
  let rows = [[], [], [], [], [], [], []]
  for (let i = 0; i < 28; i++) {
    const card = cards[i];
    switch (i) {
      case 0:
      case 1:
      case 3:
      case 6:
      case 10:
      case 15:
      case 21:
        rows[0].push(card)
        break;
      case 2:
      case 4:
      case 7:
      case 11:
      case 16:
      case 22:
        rows[1].push(card)
        break;
      case 5:
      case 8:
      case 12:
      case 17:
      case 23:
        rows[2].push(card)
        break;
      case 9:
      case 13:
      case 18:
      case 24:
        rows[3].push(card)
        break;
      case 14:
      case 19:
      case 25:
        rows[4].push(card)
        break;
      case 20:
      case 26:
        rows[5].push(card)
        break;
      default:
        rows[6].push(card)
    }
  }

  let stockPile = cards.slice(28).reverse()

  return [
    ...rows[0],
    ...rows[1],
    ...rows[2],
    ...rows[3],
    ...rows[4],
    ...rows[5],
    ...rows[6],
    ...stockPile
  ].reverse()
}

/**
 * Shuffles the card
 * 
 * @link https://stackoverflow.com/a/2450976
 * 
 * @param {*} cards 
 * @returns shuffled cards
 */
function shuffle(cards) {
  let currentIndex = cards.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
  }

  return cards;
}

function appendFakeAspectRatio(cards) {
  return cards.map((card) => {
    return {
      ...card,
      size: {
        aspectRatio: 0.60
      }
    }
  })
}

function appendKnownInfo(game) {
  let updatedStockPile = game.stockPile.map((updatedStockCard) => {
    return {
      ...updatedStockCard,
      known: false
    }
  })

  let updatedTableauPiles = [];
  for (let i = 0; i < game.tableauPiles.length; i++) {
    const tableauPile = game.tableauPiles[i];
    let updatedTableauPile = []
    for (let j = 0; j < tableauPile.length; j++) {
      const updatedTableauCard = tableauPile[j];
      if (j < tableauPile.length - 1) {
        updatedTableauCard.known = false
      } else {
        updatedTableauCard.known = true
      }

      updatedTableauPile.push(updatedTableauCard)
    }
    updatedTableauPiles.push(updatedTableauPile)
  }

  return {
    ...game,
    stockPile: updatedStockPile,
    tableauPiles: updatedTableauPiles
  }
}

function updateAspectRatio(game) {
  let updatedTableauPiles = [];

  for (let i = 0; i < game.tableauPiles.length; i++) {
    const tableauPile = game.tableauPiles[i];
    let updatedTableauPile = []
    for (let j = 0; j < tableauPile.length; j++) {
      const updatedTableauCard = tableauPile[j];

      updatedTableauCard.size.aspectRatio = 0.6 - 0.035 * j

      updatedTableauPile.push(updatedTableauCard)
    }
    updatedTableauPiles.push(updatedTableauPile)
  }

  return game
}

/**
 * Mocks a solitaire game given cards
 * 
 * @param {*} cards
 * @returns mocked solitaire game
 */
function mockSolitaire(cards) {
  let game = {
    tableauPiles: [
      cards.slice(0, 1),
      cards.slice(1, 3),
      cards.slice(3, 6),
      cards.slice(6, 10),
      cards.slice(10, 15),
      cards.slice(15, 21),
      cards.slice(21, 28),
    ],
    stockPile: cards.slice(28, 52),
    wastePile: [],
    foundationPiles: [[], [], [], []],
  }

  return game
}

function doMove(game, move) {
  if (move.type === 'stockToWaste') {
    game.stockPile.pop()
    game.wastePile.push(move.card)

    // console.log(`from Stock to Waste | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'wasteToStock') {
    let temp = game.wastePile;
    game.wastePile = []
    game.stockPile = temp.reverse()

    // console.log(`from Waste to Stock | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'wasteToFoundation') {
    game.wastePile.pop()
    game.foundationPiles[move.to.col - 3].push({
      ...move.card,
      known: true
    })

    // console.log(`from Waste to Foundation | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'wasteToTableau') {
    game.wastePile.pop()
    game.tableauPiles[move.to.col].push({
      ...move.card,
      known: true
    })

    // console.log(`from Waste to Tableau | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'foundationToTableau') {
    game.foundationPiles[move.from.col - 3].pop()
    game.tableauPiles[move.to.col].push({
      ...move.card,
      known: true
    })

    // console.log(game.foundationPiles[move.from.col - 3], game.tableauPiles[move.to.col])
  } else if (move.type === 'tableauToTableau') {
    if (move.isRun) {
      let knownFromLength = game.tableauPiles[move.from.col].filter((tableauCard) => { return tableauCard.known === true }).length
      let actualFromLength = game.tableauPiles[move.from.col].length

      let offsetMoveIndex = actualFromLength - knownFromLength + move.index

      // console.log(game.tableauPiles[move.from.col][offsetMoveIndex] === move.card)

      let restPartOfPile = game.tableauPiles[move.from.col].slice(0, offsetMoveIndex /*move.index*/)
      let movingPartOfPile = game.tableauPiles[move.from.col].slice(offsetMoveIndex /*move.index*/)

      // console.log(restPartOfPile.length + movingPartOfPile.length === game.tableauPiles[move.from.col].length)

      // console.log(movingPartOfPile[0] === move.card)

      // Flipped card is known
      if (restPartOfPile[restPartOfPile.length - 1]) {
        restPartOfPile[restPartOfPile.length - 1] = {
          ...restPartOfPile[restPartOfPile.length - 1],
          known: true
        }
      }

      // console.log(game.tableauPiles[move.from.col].length, game.tableauPiles[move.to.col].length);

      game.tableauPiles[move.from.col] = restPartOfPile
      game.tableauPiles[move.to.col].push(...movingPartOfPile)

      // console.log(game.tableauPiles[move.from.col].length, game.tableauPiles[move.to.col].length);
    } else {
      game.tableauPiles[move.from.col].pop()
      game.tableauPiles[move.to.col].push(move.card)

      // Flipped card is known
      if (game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1]) {
        game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1] = {
          ...game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1],
          known: true
        }
      }
    }

    // console.log('From Tableau after move', game.tableauPiles[move.from.col])

    // console.log(game.tableauPiles[move.from.col], game.tableauPiles[move.to.col])
  } else {
    game.tableauPiles[move.from.col].pop()
    game.foundationPiles[move.to.col - 3].push(move.card)

    // console.log(game.tableauPiles[move.from.col], game.foundationPiles[move.to.col - 3])
  }

  // console.log(move.type, move.isRun, countCardsInGame(game))

  return game
}

function modifiedDoMove(game, move) {
  if (move.type === 'stockToWaste') {
    let index = game.stockPile.length - 3

    let remainingPartOfPile = game.stockPile.slice(0, index)
    let movingPartOfPile = game.stockPile.slice(index).reverse()

    // console.log(index, remainingPartOfPile, movingPartOfPile)

    game.stockPile = remainingPartOfPile
    game.wastePile.push(...movingPartOfPile)

    // console.log(`from Stock to Waste | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'wasteToStock') {
    let tempWaste = game.wastePile;
    let tempStock = game.stockPile;

    if (!tempWaste.length < 3) {
      game.wastePile = []
      game.stockPile = tempWaste.reverse()
      game.stockPile.push(...tempStock)

      // console.log(`from Waste to Stock | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
    } else {
      // console.log('illegal move')
    }
  } else if (move.type === 'wasteToFoundation') {
    game.wastePile.pop()
    game.foundationPiles[move.to.col - 3].push({
      ...move.card,
      known: true
    })

    // console.log(`from Waste to Foundation | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'wasteToTableau') {
    game.wastePile.pop()
    game.tableauPiles[move.to.col].push({
      ...move.card,
      known: true
    })

    // console.log(`from Waste to Tableau | Stock: ${game.stockPile.length} | Waste: ${game.wastePile.length}`)
  } else if (move.type === 'foundationToTableau') {
    game.foundationPiles[move.from.col - 3].pop()
    game.tableauPiles[move.to.col].push({
      ...move.card,
      known: true
    })
  } else if (move.type === 'tableauToTableau') {
    if (move.isRun) {
      let knownFromLength = game.tableauPiles[move.from.col].filter((tableauCard) => { return tableauCard.known === true }).length
      let actualFromLength = game.tableauPiles[move.from.col].length

      let offsetMoveIndex = actualFromLength - knownFromLength + move.index

      let restPartOfPile = game.tableauPiles[move.from.col].slice(0, offsetMoveIndex /*move.index*/)
      let movingPartOfPile = game.tableauPiles[move.from.col].slice(offsetMoveIndex /*move.index*/)

      // Flipped card is known
      if (restPartOfPile[restPartOfPile.length - 1]) {
        restPartOfPile[restPartOfPile.length - 1] = {
          ...restPartOfPile[restPartOfPile.length - 1],
          known: true
        }
      }

      game.tableauPiles[move.from.col] = restPartOfPile
      game.tableauPiles[move.to.col].push(...movingPartOfPile)
    } else {
      game.tableauPiles[move.from.col].pop()
      game.tableauPiles[move.to.col].push(move.card)

      // Flipped card is known
      if (game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1]) {
        game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1] = {
          ...game.tableauPiles[move.from.col][game.tableauPiles[move.from.col].length - 1],
          known: true
        }
      }
    }
  } else {
    game.tableauPiles[move.from.col].pop()
    game.foundationPiles[move.to.col - 3].push(move.card)
  }

  return game
}

function trySolve(game) {
  let tries = 0;
  let won = false;

  do {
    let gameWithAspectRatios = updateAspectRatio(game)
    let knownGame = getKnown(gameWithAspectRatios)
    let moves = findMoves(knownGame)

    if (moves.length > 0) {
      let move = bestMove(moves, knownGame)
      // altPrintSolitaire(knownGame)
      // console.log('Best Move', move)

      game = doMove(game, move)
    }

    won = hasWon(game)

    tries++
  } while (tries < 250 && !won)

  // if (won) console.log("won")

  return game
}

function modifiedTrySolve(game) {
  let tries = 0;
  let won = false;

  let bestMoves = []

  do {
    let gameWithAspectRatios = updateAspectRatio(game)
    let knownGame = modifiedGetKnown(gameWithAspectRatios)
    let moves = findMoves(knownGame)

    if (moves.length > 0) {
      let move = bestMove(moves, knownGame)

      bestMoves.push(formatMove(move))
      // altPrintSolitaire(knownGame)
      // console.log('Best Move', move)

      game = modifiedDoMove(game, move)
    }

    won = hasWon(game)

    tries++
  } while (tries < 250 && !won)

  if (won) console.log("won")

  return {
    solvedGame: game,
    bestMoves
  }
}

function getKnown(game) {
  return {
    ...game,
    stockPile: game.stockPile[game.stockPile.length - 1] ?
      [game.stockPile[game.stockPile.length - 1]] : [],
    wastePile: game.wastePile[game.wastePile.length - 1] ?
      [game.wastePile[game.wastePile.length - 1]] : [],
    tableauPiles: game.tableauPiles.map((tableauPile) => {
      return tableauPile.filter((tableauCard) => {
        return tableauCard.known === true
      })
    })
  }
}

function modifiedGetKnown(game) {
  return {
    ...game,
    stockPile: game.stockPile.length >= 3 ?
      [game.stockPile[game.stockPile.length - 1]] : [],
    wastePile: game.wastePile[game.wastePile.length - 1] ?
      [game.wastePile[game.wastePile.length - 1]] : [],
    tableauPiles: game.tableauPiles.map((tableauPile) => {
      return tableauPile.filter((tableauCard) => {
        return tableauCard.known === true
      })
    })
  }
}

function testSolver() {
  for (let k = 0; k < 30; k++) {
    let won = 0;
    for (let i = 0; i < 10000; i++) {
      let shuffledCards = shuffle(appendFakeAspectRatio(cards));
      let mockedGame = appendKnownInfo(mockSolitaire(shuffledCards));
      let solvedGame = trySolve(mockedGame)
      if (hasWon(solvedGame)) won++
      // altPrintSolitaire(solvedGame)
    }
    console.log(won)
  }
}

function modifiedTestSolver() {
  const games = [
    ['S10', 'R3', 'K1', 'K9', 'H3', 'R12', 'H2', 'K12', 'K6', 'H5', 'S3', 'R4', 'S8', 'R7', 'K2', 'H4', 'S11', 'K10', 'S7', 'H9', 'K8', 'S6', 'K11', 'R5', 'K4', 'S12', 'H7', 'S2', 'H1', 'H6', 'R2', 'S5', 'R11', 'R13', 'H10', 'H13', 'K5', 'K13', 'R8', 'K7', 'R10', 'R1', 'S13', 'R6', 'R9', 'S4', 'S9', 'H12', 'K3', 'H8', 'S1', 'H11'],
  ];

  console.log(reverseorderCards(reorderCards(games[0])))

  let won = 0;
  for (let i = 0; i < games.length; i++) {
    let cards = games[i];
    let actualCards = appendFakeAspectRatio(reorderCards(formatCards(cards)))
    let mockedGame = appendKnownInfo(mockSolitaire(actualCards));

    altPrintSolitaire(mockedGame)

    let { solvedGame, bestMoves } = modifiedTrySolve(mockedGame)
    if (hasWon(solvedGame)) won++

    altPrintSolitaire(solvedGame)

    console.log(bestMoves)
  }

  console.log(won)

  // let won = 0;
  // for (let i = 0; i < 10000; i++) {
  //   let shuffledCards = shuffle(appendFakeAspectRatio(cards));
  //   let mockedGame = appendKnownInfo(mockSolitaire(shuffledCards));    
  //   let { solvedGame, bestMoves } = modifiedTrySolve(mockedGame)
  //   if (hasWon(solvedGame)) {
  //     won++
  //     // altPrintSolitaire(mockedGame)
  //     // altPrintSolitaire(solvedGame)
  //     console.log(reverseorderCards(reformatCards(shuffledCards)).join(','))
  //     console.log(bestMoves.join(','))
  //   } 
  // }

  // console.log(won)
}

function countCardsInGame(game) {
  return game.stockPile.length + game.wastePile.length + game.foundationPiles.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.length;
  }, 0) + game.tableauPiles.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.length;
  }, 0)
}

function formatMove(move) {
  /*
    Types:
    'stockToWaste',
    'wasteToStock',
    'wasteToFoundation',
    'wasteToTableau',
    'foundationToTableau',
    'tableauToTableau',
    'tableauToFoundation'
  */
  if (move.type === 'stockToWaste') {
    return 'T'
  } else if (move.type === 'wasteToStock') {
    return 'S'
  } else if (move.type === 'wasteToFoundation' || move.type === 'tableauToFoundation') {
    return `${danishSuit(move.card.suit.short)}${move.card.rank.short}-F`
  } else {
    return `${danishSuit(move.card.suit.short)}${move.card.rank.short}-${move.to.col + 1}`
  }
}