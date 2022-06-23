/**
 * Display Detected Solitaire 
 */

/**
 * Displays solitaire in app
 * 
 * @author Aqib; Kim
 * @email s205342@student.dtu.dk; s205341@student.dtu.dk
 * 
 * @param {*} game 
 */
function displaySolitaire(game) {
  const stockPile = document.getElementById('stock__pile')
  emptyNode(stockPile);
  let stockNode = document.createElement('p')
  if (game.stockPile.length > 0) {
    stockNode.innerText = 'Has cards'
    stockPile.appendChild(stockNode)
  } else {
    stockNode.innerText = 'Is empty'
    stockPile.appendChild(stockNode)
  }

  const wastePile = document.getElementById('waste__pile')
  emptyNode(wastePile)
  if (game.wastePile.length > 0) {
    let card = game.wastePile[game.wastePile.length - 1]
    let wasteNode = getCardImageElement(card)
    wastePile.appendChild(wasteNode)
  }

  for (let i = 0; i < game.foundationPiles.length; i++) {
    const foundationPile = game.foundationPiles[i]
    const pileNode = document.getElementById(`foundation__pile-${i + 1}`)
    emptyNode(pileNode)
    if (foundationPile.length > 0) {
      for (let j = 0; j < foundationPile.length; j++) {
        const foundationCard = foundationPile[j]
        const cardNode = getCardImageElement(foundationCard)
        cardNode.setAttribute('data-row', 2)
        cardNode.setAttribute('data-col', i + 1)
        cardNode.setAttribute('data-suit', foundationCard?.suit?.short)
        cardNode.setAttribute('data-rank', foundationCard?.rank?.short)
        cardNode.setAttribute('data-order', j)
        cardNode.addEventListener('click', onOpenEditModal)
        pileNode.appendChild(cardNode)
      }
    }
  }

  for (let i = 0; i < game.tableauPiles.length; i++) {
    const tableauPile = game.tableauPiles[i]
    const pileNode = document.getElementById(`tableau__pile-${i + 1}`)
    emptyNode(pileNode)
    if (tableauPile.length > 0) {
      for (let j = 0; j < tableauPile.length; j++) {
        const tableauCard = tableauPile[j]
        const cardNode = getCardImageElement(tableauCard)
        cardNode.setAttribute('data-row', 2)
        cardNode.setAttribute('data-col', i + 1)
        cardNode.setAttribute('data-suit', tableauCard?.suit?.short)
        cardNode.setAttribute('data-rank', tableauCard?.rank?.short)
        cardNode.setAttribute('data-order', j)
        cardNode.addEventListener('click', onOpenEditModal)
        pileNode.appendChild(cardNode)
      }
    }
  }
}

/**
 * Removes content of node in DOM
 * 
 * @author Aqib
 * @email s205342@student.dtu.dk
 * 
 * @param {*} node 
 */
function emptyNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Create image element for card
 * 
 * @author Aqib
 * @email s205342@student.dtu.dk
 * 
 * @param {*} card 
 * @returns image node
 */
function getCardImageElement(card) {
  let imgNode = document.createElement('img');
  imgNode.setAttribute('src', `assets/img/cards/200px-Playing_card_${card.suit?.image}_${card.rank?.image}.svg.png`)
  imgNode.setAttribute('alt', `${card.rank?.long} of ${card.suit?.long}`)
  return imgNode;
}

/**
 * Displays all moves in list
 * 
 * @author Aqib
 * @email s205342@student.dtu.dk
 * 
 * @param {*} moves 
 */
function displayMoves(moves) {
  let movesNode = document.getElementById('moves')
  emptyNode(movesNode)
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const moveNode = document.createElement('li')
    if (move.card?.suit && move.card?.rank) {
      moveNode.innerHTML = `${move.card?.suit?.short ?? ''}${move.card?.rank?.short ?? ''} from ${move.from.name} to ${move.to.name}`
    } else {
      moveNode.innerHTML = `from ${move.from.name} to ${move.to.name}`
    }
    movesNode.appendChild(moveNode)
  }
}

/**
 * Displays app to user
 * 
 * @author Aqib
 * @email s205342@student.dtu.dk
 * 
 * @param {*} game 
 * @param {*} moves 
 */
function display(game, moves) {
  displaySolitaire(game)
  displayMoves(moves)
}

/**
 * Get short name of card
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} game 
 */
function getShortName(card) {
  if (!card?.rank?.short || !card?.suit?.short) {
    return '#'
  } 
  return `${card?.suit?.short}${card?.rank?.short}`
}

/**
 * Prints solitaire to console
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} game 
 */
function altPrintSolitaire(game) {
  console.log("Game:")
  console.log(`${getShortName(game.foundationPiles[3][game.foundationPiles[3].length - 1])}\t|\t${game.tableauPiles[6].map((card) => { return getShortName(card) }).join('\t')}`)
  console.log(`${getShortName(game.foundationPiles[2][game.foundationPiles[2].length - 1])}\t|\t${game.tableauPiles[5].map((card) => { return getShortName(card) }).join('\t')}`)
  console.log(`${getShortName(game.foundationPiles[1][game.foundationPiles[1].length - 1])}\t|\t${game.tableauPiles[4].map((card) => { return getShortName(card) }).join('\t')}`)
  console.log(`${getShortName(game.foundationPiles[0][game.foundationPiles[0].length - 1])}\t|\t${game.tableauPiles[3].map((card) => { return getShortName(card)}).join('\t')}`)
  console.log(`\t|\t${game.tableauPiles[2].map((card) => { return getShortName(card) }).join('\t')}`);
  console.log(`${getShortName(game.wastePile[game.wastePile.length - 1])}\t|\t${game.tableauPiles[1].map((card) => { return getShortName(card) }).join('\t')}`)
  console.log(`${game.stockPile.length}\t|\t${game.tableauPiles[0].map((card) => { return getShortName(card) }).join('\t')}`)
}