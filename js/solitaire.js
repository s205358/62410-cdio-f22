const RED = 'RED';
const BLACK = 'BLACK';

/**
 * Determine space for value given interval boundaries
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} value 
 * @param {*} boundaries 
 * @returns space
 */
function determineSpace(value, boundaries) {
  if (value <= boundaries[0]) {
    return 1;
  }
  for (let i = 1; i < boundaries.length; i++) {
    // Lower and upper boundaries of interval
    if (value > boundaries[i - 1] && value <= boundaries[i]) {
      return i + 1;
    }
  }
  if (value > boundaries[boundaries.length - 1]) {
    return boundaries.length + 1;
  }
}

/**
 * Find positions of cards
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} cardObjects 
 * @returns 
 */
function findPositions(cardObjects) {
  // Determine location
  let xVals = cardObjects.map((cardObj) => {
    return cardObj.corners.topLeft.x
  })

  let maxX = Math.max(...xVals)

  let yVals = cardObjects.map((cardObj) => {
    return cardObj.corners.topLeft.y
  })

  let minY = Math.min(...yVals)

  let mostRightCard = cardObjects.find((cardObj) => {
    return cardObj.corners.topLeft.x == maxX;
  });

  let assumedWidth = mostRightCard.size.width;
  let assumedHeight = assumedWidth * 8.5 / 5.5

  let rowBoundaries = [minY + assumedHeight]

  // Set boundaries down the middle of cards
  let maxXWithOffset = maxX + assumedWidth / 3;
  let asummedSpacing = assumedWidth * 0.25;

  let colBoundaries = [];
  for (let i = 1; i <= 6; i++) {
    let boundary = maxXWithOffset - (assumedWidth + asummedSpacing) * i;
    colBoundaries.push(boundary);
  }
  colBoundaries.reverse();

  return cardObjects.map((cardObj) => {
    return {
      ...cardObj,
      space: {
        row: determineSpace(cardObj.corners.topLeft.y, rowBoundaries),
        col: determineSpace(cardObj.corners.topLeft.x, colBoundaries)
      }
    }
  })
}

/**
 * Maps card objects to game
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} cardObjects 
 * @returns game
 */
function getGameFromCardObjects(cardObjects) {
  return {
    stockPile: cardObjects.filter((cardObj) => {
      return cardObj.space.col == 1 && cardObj.space.row == 1;
    }),
    wastePile: cardObjects.filter((cardObj) => {
      return cardObj.space.col == 2 && cardObj.space.row == 1;
    }),
    foundationPiles: [
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 4 && cardObj.space.row == 1;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 5 && cardObj.space.row == 1;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 6 && cardObj.space.row == 1;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 7 && cardObj.space.row == 1;
      }),
    ],
    tableauPiles: [
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 1 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 2 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 3 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 4 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 5 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 6 && cardObj.space.row == 2;
      }),
      cardObjects.filter((cardObj) => {
        return cardObj.space.col == 7 && cardObj.space.row == 2;
      }),
    ],
  }
}

/**
 * Find change from last state
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} currentGame 
 * @param {*} previousGame 
 * @returns updated game 
 */
function findChangeInGame(currentGame, previousGame) {
  // Update game to account for previousious state
  let updatedGame = previousGame ?? currentGame;

  // Look for changes in waste pile
  // Grab the waste pile's currentent and previousious state
  let currentWastePile = currentGame.wastePile;
  let previousWastePile = previousGame.wastePile;

  // Grab the currentent and previousious waste pile's top most card
  let currentTopWasteCard = currentWastePile[currentWastePile.length - 1];
  let previousTopWasteCard = previousWastePile[previousWastePile.length - 1];

  if (
    currentTopWasteCard?.suit?.short !== previousTopWasteCard?.suit?.short ||
    currentTopWasteCard?.rank?.short !== previousTopWasteCard?.rank?.short
  ) {
    console.log(`Waste pile change`);
    if (currentWastePile.length == 0) {
      // If currentent pile empty, updated pile is empty
      updatedGame.wastePile = [];
    } else {
      // Otherwise a card was moved to the pile
      updatedGame.wastePile.pop();
      updatedGame.wastePile.push(currentTopWasteCard);
    }
  }

  // Look for changes in stock pile
  // Grab the stock pile's currentent and previousious state
  let currentStockPile = currentGame.stockPile;
  let previousStockPile = previousGame.stockPile;

  // Grab the currentent and previousious stock pile's top most card
  let currentTopStockCard = currentStockPile[currentStockPile.length - 1];
  let previousTopStockCard = previousStockPile[previousStockPile.length - 1];

  if (
    currentTopStockCard?.suit?.short !== previousTopStockCard?.suit?.short ||
    currentTopStockCard?.rank?.short !== previousTopStockCard?.rank?.short
  ) {
    console.log(`Stock pile change`);
    // If currentent pile empty, updated pile is empty
    if (currentStockPile.length == 0) {
      updatedGame.stockPile = [];
    } else {
      // Otherwise a card was moved from the pile 
      // Does not account for us knowing what's in the pile...
      updatedGame.stockPile.pop();
      updatedGame.stockPile.push(currentTopStockCard);
    }
  }

  // Look for changes in tableau piles
  // For us to update accoridng to "run", we must  know before what was moved and where to at the same time, do this after.
  let runPile = [];
  let runToPile = -1;
  for (let i = 0; i < currentGame.tableauPiles.length; i++) {
    // Grab the relevant pile's currentent and previousious state
    const currentPile = currentGame.tableauPiles[i];
    const previousPile = previousGame.tableauPiles[i];

    // Grab the currentent and previousious pile's top most card
    const currentTopCard = currentPile[currentPile.length - 1];
    const previousTopCard = previousPile[previousPile.length - 1];

    // Grab the previousious pile's bottom most card
    // const previousBottomCard = previousPile[0];

    // There is always a change in rank? and/or suit? of top most card in pile, 
    // When there is a change in a pile, as no two cards have the same rank? and suit?.
    if (
      currentTopCard?.suit?.short !== previousTopCard?.suit?.short ||
      currentTopCard?.rank?.short !== previousTopCard?.rank?.short
    ) {
      console.log(`Tableau pile change in pile: ${i + 1}`);
      if (!previousTopCard) {
        // No card before, means we moved one or more cards to here
        if (currentTopCard?.rank?.short == 13) {
          console.log(`Layed down single card`);
          // If top most card is now a king, we must have layed down just a single card, i.e. a king.
          updatedGame.tableauPiles[i].push(currentTopCard);
        } else {
          console.log(`Layed down run of cards`);
          // Otherwise we must have have layed down a "run" of cards.
          runToPile = i;
        }
      } else if (!currentTopCard) {
        // No card now, mean we moved one or more cards from here

        // Either way, there is no longer any cards in the pile
        updatedGame.tableauPiles[i] = [];

        // For the pile to be empty now, we must have known all cards in the pile
        // I.e., the amount of cards in the previousious pile determines how many cards were moved.
        if (previousPile.length == 1) {
          console.log(`Taken up single card`);
          // If there was only one card, we must have have taken just a single card, i.e. that card.
          // We do nothing.
        } else {
          console.log(`Taken up run of cards`);
          // Otherwise we must have taken a "run" of cards.
          runPile = previousPile;
        }
      } else {
        // Handle other situations where cards are involved before and after

        // Find change in rank?
        let rankChange = (previousTopCard?.rank?.short ?? 0) - (currentTopCard?.rank?.short ?? 0);

        // We can look at which pile is longer to determine whether or nor a card was moved to or from here.
        if (currentTopCard.size.aspectRatio < previousTopCard.size.aspectRatio) {
          // Current pile is longer, i.e. card was moved to here
          if (Math.abs(rankChange) == 1) {
            console.log(`Layed down single card`);
            // If there was only one jump in rank?, we must have layed down a single card
            updatedGame.tableauPiles[i].push(currentTopCard);
          } else {
            console.log(`Layed down run of cards`);
            // Otherwsie, we must have layed down a "run" of cards
            runToPile = i;
          }
        } else {
          // Previous pile is longer, i.e. card was moved from here

          // If currentent top most card was *not* in previousious pile, we must have flipped a card
          let wasInPile = previousPile.find((card) => {
            return (
              card?.rank?.short === currentTopCard?.rank?.short &&
              card?.suit?.short === currentTopCard?.suit?.short
            );
          })
          if (wasInPile) {
            // No flip, i.e. we proceed as usual
            if (Math.abs(rankChange) == 1) {
              console.log(`Taken up single card`);
              // If there was only one jump in rank?, we must have taken a single card
              updatedGame.tableauPiles[i].pop()
            } else {
              console.log(`Taken up run of cards`);
              // Otherwsie, we must have taken a "run" of cards
              runToPile = updatedGame.tableauPiles[i]
                .splice(previousPile.length - Math.abs(rankChange), 0);
            }
          } else {
            console.log('Flipped card');
            // A flip, i.e. we proceed as follows
            if (previousPile.length == 1) {
              console.log(`Taken up single card`);
              // If there was only one card, we must have have taken just a single card, i.e. that card.
              updatedGame.tableauPiles[i].pop();
            } else {
              console.log(`Taken up run of cards`);
              // Otherwise we must have taken a "run" of cards.
              updatedGame.tableauPiles[i] = [];
              runPile = previousPile;
            }
            // Set flipped card;
            updatedGame.tableauPiles[i].push(currentTopCard);
          }
        }
      }
    }
  }

  // Handle run after checking tableau piles, as a run consts of multiple cards and can only appear within the tableau piles.
  // We must know what cards are moved before updating the location to where they are moved.
  if (runPile.length > 0 && runToPile > 0) {
    updatedGame.tableauPiles[runToPile].push(...runPile);
    // Make sure dimensions for updated game per top card is updated
    let updatedTopCard = currentGame.tableauPiles[runToPile][currentGame.tableauPiles[runToPile].length - 1];
    updatedGame.tableauPiles[runToPile].pop();
    updatedGame.tableauPiles[runToPile].push(updatedTopCard);
  }

  // Look for changes in foundation piles
  for (let i = 0; i < currentGame.foundationPiles.length; i++) {
    // Grab the relevant pile's currentent and previousious state
    const currentPile = currentGame.foundationPiles[i];
    const previousPile = previousGame.foundationPiles[i];

    // Grab the currentent and previousious pile's top most card
    const currentTopCard = currentPile[currentPile.length - 1];
    const previousTopCard = previousPile[previousPile.length - 1];

    // Grab the previousious pile's bottom most card
    // const previousBottomCard = prePile[0];

    // There is always a change in rank? and/or suit? of top most card in pile, 
    // When there is a change in a pile, as no two cards have the same rank? and suit?.
    if (
      // currentTopCard?.suit?.short !== previousTopCard?.suit?.short || // Assume no change in suit?
      currentTopCard?.rank?.short !== previousTopCard?.rank?.short
    ) {
      console.log(`Foundation pile change in pile: ${i + 1}`);
      if (!previousTopCard) {
        console.log(`Layed down single card`);
        // No card before, means we moved one card to here
        // We must have layed down just a single card.
        updatedGame.foundationPiles[i].push(currentTopCard);
      } else if (!currentTopCard) {
        console.log(`Taken up single card`);
        // No card now, mean we moved one card from here
        // There is no longer any cards in the pile
        updatedGame.foundationPiles[i] = [];
        // There was only one card, we must have have taken just a single card, i.e. that card.
        // We do nothing.
      } else {
        // Handle other situations where cards are involved before and after

        // Find change in rank?
        let rankChange = (previousTopCard?.rank?.short ?? 0) - (currentTopCard?.rank?.short ?? 0);

        // Only a single card may be moved to and from here and change is at most 1.
        if (rankChange < 0) {
          console.log(`Layed down single card`);
          // Card was moved to here
          // There is only one jump in rank?, we must have layed down a single card.
          updatedGame.foundationPiles[i].push(currentTopCard);
        } else {
          console.log(`Taken up single card`);
          // Card was moved from here
          // There is only one jump in rank?, we must have have taken just a single card.
          updatedGame.foundationPiles[i].pop();
        }
      }
    }
  }

  return updatedGame
}

/**
 * Find all moves
 * 
 * @author Andreas; Jens
 * @email s205338@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} game 
 * @returns moves
 */
function findMoves(game) {
  // Solve game
  let moves = [];

  // Can you draw from stock pile?
  if (game.stockPile.length > 0) {
    // console.log('Stock Pile has cards, can draw from it')
    moves.push({
      type: 'stockToWaste',
      card: game.stockPile[game.stockPile.length - 1],
      from: {
        name: 'stockPile',
        row: 1,
        col: 1
      },
      to: {
        name: 'wastePile',
        row: 1,
        col: 2
      },
      index: game.stockPile.length - 1,
      isRun: false
    })
  }

  // Can use card from waste pile?
  if (game.wastePile.length > 0) {
    // Is stock pile empty?
    if (game.stockPile.length == 0) {
      // console.log('Stock Pile is empty and Waste Pile has cards, can flip Waste Pile to Stock Pile')
      // console.log(game.wastePile.length)

      moves.push({
        type: 'wasteToStock',
        card: game.wastePile, // multiple
        from: {
          name: 'wastePile',
          row: 1,
          col: 2
        },
        to: {
          name: 'stockPile',
          row: 1,
          col: 1
        },
        index: 0,
        isRun: false
      })
    }

    // Grab moveable card
    let wasteCard = game.wastePile[game.wastePile.length - 1];

    // ...to foundation piles?
    for (let i = 0; i < game.foundationPiles.length; i++) {
      const foundationPile = game.foundationPiles[i];

      // Are those checks redudant with isNextInPile methods???
      if (foundationPile.length === 0) {
        // Is empty, only ace can be moved to here
        if (wasteCard?.rank?.short == 1) {
          // console.log('Waste Card is Ace, can move to empty Foundation Pile')
          moves.push({
            type: 'wasteToFoundation',
            card: wasteCard,
            from: {
              name: 'wastePile',
              row: 1,
              col: 2
            },
            to: {
              name: `foundationPile${i + 1}`,
              row: 1,
              col: i + 3
            },
            index: game.wastePile.length - 1,
            isRun: false
          })
        }
      } else {
        const foundationTopCard = foundationPile[foundationPile.length - 1];

        // Can card be moved to foundation pile, is it next in order?
        if (isNextInFoundationPile(wasteCard, foundationTopCard)) {
          // console.log(`Waste Card is next in order, can move to Foundationn Pile ${i + 1}`)
          moves.push({
            type: 'wasteToFoundation',
            card: wasteCard,
            from: {
              name: 'wastePile',
              row: 1,
              col: 2,
            },
            to: {
              name: `foundationPile${i + 1}`,
              row: 1,
              col: i + 3
            },
            index: game.wastePile.length - 1,
            isRun: false
          })
        }
      }
    }

    // ...to tableau piles?
    for (let i = 0; i < game.tableauPiles.length; i++) {
      const tableauPile = game.tableauPiles[i];

      // Are those checks redudant with isNextInPile methods???
      if (tableauPile.length === 0) {
        // Is empty, only a king can be moved to here
        if (wasteCard?.rank?.short == 13) {
          // console.log(`Waste Card is King, can move to empty Tableu Pile ${i + 1}`)
          moves.push({
            type: 'wasteToTableau',
            card: wasteCard,
            from: {
              name: 'wastePile',
              row: 1,
              col: 2
            },
            to: {
              name: `tableauPile${i + 1}`,
              row: 2,
              col: i
            },
            index: game.wastePile.length - 1,
            isRun: false
          })
        }
      } else {
        const tableauTopCard = tableauPile[tableauPile.length - 1];

        // Can card be moved to tableau pile, is it next in order?
        if (isNextInTableauPile(wasteCard, tableauTopCard)) {
          // console.log(`Waste Card is next in order, can move to Tableu Pile ${i + 1}`)
          moves.push({
            type: 'wasteToTableau',
            card: wasteCard,
            from: {
              name: 'wastePile',
              row: 1,
              col: 2
            },
            to: {
              name: `tableauPile${i + 1}`,
              row: 2,
              col: i
            },
            index: game.wastePile.length - 1,
            isRun: false
          })
        }
      }
    }
  }

  // Can use cards from foundation piles?
  for (let i = 0; i < game.foundationPiles.length; i++) {
    const foundationPile = game.foundationPiles[i];

    if (foundationPile.length > 0) {
      // Pile has content and there is something to move

      // Grab moveable card
      const foundationTopCard = foundationPile[foundationPile.length - 1];

      // ...to tableau piles?
      for (let j = 0; j < game.tableauPiles.length; j++) {
        const tableauPile = game.tableauPiles[j];

        // Are those checks redudant with isNextInPile methods???
        if (tableauPile.length === 0) {
          // Is empty, only a king can be moved to here
          if (foundationTopCard?.rank?.short == 13) {
            // console.log(`Foundation Card is King, can move to empty Tableau Pile ${j + 1}`)
            moves.push({
              type: 'foundationToTableau',
              card: foundationTopCard,
              from: {
                name: `foundationPile${i + 1}`,
                row: 1,
                col: i + 3
              },
              to: {
                name: `tableauPile${j + 1}`,
                row: 2,
                col: j
              },
              index: foundationPile.length - 1,
              isRun: false,
            })
          }
        } else {
          const tableauTopCard = tableauPile[tableauPile.length - 1];

          // Can card be moved to tableau pile, is it next in order?
          if (isNextInTableauPile(foundationTopCard, tableauTopCard)) {
            // console.log(`Foundation Card is next in order, can move to Tableau Pile ${j + 1}`)
            moves.push({
              type: 'foundationToTableau',
              card: foundationTopCard,
              from: {
                name: `foundationPile${i + 1}`,
                row: 1,
                col: i + 3
              },
              to: {
                name: `tableauPile${j + 1}`,
                row: 2,
                col: j
              },
              index: foundationPile.length - 1,
              isRun: false,
            })
          }
        }
      }
    }
    // Otherwise pile is empty and there is nothing to move, i.e. do nothing
  }

  // Can use cards from tableau piles?
  for (let i = 0; i < game.tableauPiles.length; i++) {
    const tableauPile = game.tableauPiles[i];

    if (tableauPile.length > 0) {
      // Pile has content and there is something to move

      // Grab moveable card
      const tableauTopCard = tableauPile[tableauPile.length - 1];

      // ...to foundation piles
      for (let j = 0; j < game.foundationPiles.length; j++) {
        const foundationPile = game.foundationPiles[j];

        // Are those checks redudant with isNextInPile methods???
        if (foundationPile.length === 0) {
          // Is empty, only ace can be moved to here
          if (tableauTopCard?.rank?.short == 1) {
            moves.push({
              type: 'tableauToFoundation',
              card: tableauTopCard,
              from: { 
                name: `tableauPile${i + 1}`,
                row: 2,
                col: i
              },
              to: {
                name: `foundationPile${j + 1}`,
                row: 1,
                col: j + 3
              },
              index: tableauPile.length - 1,
              isRun: false,
            })
          }
        } else {
          const foundationTopCard = foundationPile[foundationPile.length - 1];

          // Can card be moved to foundation pile, is it next in order?
          if (isNextInFoundationPile(tableauTopCard, foundationTopCard)) {
            moves.push({
              type: 'tableauToFoundation',
              card: tableauTopCard,
              from: { 
                name: `tableauPile${i + 1}`,
                row: 2,
                col: i
              },
              to: {
                name: `foundationPile${j + 1}`,
                row: 1,
                col: j + 3
              },
              index: tableauPile.length - 1,
              isRun: false,
            })
          }
        }
      }

      // ...to tableau piles
      for (let j = 0; j < tableauPile.length; j++) {
        // Try all cards in pile to check for potential "runs"
        const tableauCard = tableauPile[j];

        // Note: If j is not top card it is a run of cards being moved.

        for (let k = 0; k < game.tableauPiles.length; k++) {
          const otherTableauPile = game.tableauPiles[k];

          // Do not for pile we are within
          if (k === i) {
            continue;
          }

          // Are those checks redudant with isNextInPile methods???
          if (otherTableauPile.length === 0) {
            // Is empty, only ace can be moved to here
            if (tableauCard?.rank?.short == 13) {
              moves.push({
                type: 'tableauToTableau',
                card: tableauCard,
                from: { 
                  name: `tableauPile${i + 1}`,
                  row: 2,
                  col: i
                },
                to: {
                  name: `tableauPile${k + 1}`,
                  row: 2,
                  col: k
                },
                index: j,
                isRun: j !== tableauPile.length - 1
              })
            }
          } else {
            const otherTableauTopCard = otherTableauPile[otherTableauPile.length - 1];

            // Can card be moved to foundation pile, is it next in order?
            if (isNextInTableauPile(tableauCard, otherTableauTopCard)) {
              moves.push({
                type: 'tableauToTableau',
                card: tableauCard,
                from: { 
                  name: `tableauPile${i + 1}`,
                  row: 2,
                  col: i
                },
                to: {
                  name: `tableauPile${k + 1}`,
                  row: 2,
                  col: k
                },
                index: j,
                isRun: j !== tableauPile.length - 1
              })
            }
          }
        }
      }
      // Otherwise pile is empty and there is nothing to move, i.e. do nothing
    }
  }

  return moves
}

/**
 * Find the best moves
 * @link https://web.stanford.edu/~bvr/pubs/solitaire.pdf
 * 
 * @author Andreas; Jens
 * @email s205338@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} moves 
 * @param {*} game 
 * @param {*} score 
 */
function bestMove(moves, game) {
  // Score moves and sort in descending order such first element maximizes the score
  // console.log('Moves', moves)

  let scoredMoves = moves.map((move) => {
    return {
      ...move,
      score: scoreMove(move)
    }
  }).sort((a, b) => {
    return b.score - a.score
  })

  // console.log('Scored Moved', scoredMoves)

  // Take the best score
  let bestScore = scoredMoves[0].score

  // Take moves that has the best score
  let filteredMoves = scoredMoves.filter((scoredMove) => {
    return scoredMove.score === bestScore
  })

  // If multiple moves with best score, there is a tie
  if (filteredMoves.length > 1) {
    // Handle tie
    let prioritizedMoves = filteredMoves.map((filteredMove) => {
      return {
        ...filteredMove,
        priority: prioritzeMove(filteredMove, game)
      }
    })

    // Handle moves that have not been decided because they reveal new ccards and need to be balanced accordingly
    let proritiesToBeDecided = prioritizedMoves.filter((move) => {
      return move.priority == 'TBD'
    })

    if (proritiesToBeDecided.length > 0) {
      let updatedPriorities = prioritizedMoves.filter((move) => {
        return move.priority != 'TBD'
      })

      if (proritiesToBeDecided.length == 1) {
        updatedPriorities.push({
          ...proritiesToBeDecided[0],
          priority: 2
        })
      } else {
        let k = 1

        // console.log('k + 1');
        
        let rankedSubPriorites = proritiesToBeDecided.sort((a, b) => {
          return b.card.size.aspectRatio - a.card.size.aspectRatio
        }).map((move) => {
          return {
            ...move,
            priority: 1 + k++
          }
        })
        
        // console.log(rankedSubPriorites)

        updatedPriorities.push(...rankedSubPriorites)
      }

      prioritizedMoves = updatedPriorities;
    }
    
    prioritizedMoves.sort((a, b) => {
      return b.priority - a.priority
    })

    // console.log('Prioritized Moves', prioritizedMoves)

    let highestPriority = prioritizedMoves[0].priority;

    let refilteredMoves = prioritizedMoves.filter((prioritizedMove) => {
      return prioritizedMove.priority === highestPriority
    })

    if (refilteredMoves.length > 1) {
      // Pick at random
      return refilteredMoves[Math.floor(Math.random() * refilteredMoves.length)];
    } else {
      return refilteredMoves[0]
    }
  } else {
    return filteredMoves[0]
  }
}

/**
 * Check if game is won
 * 
 * @author Andreas; Jens
 * @email s205338@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} game 
 * @returns boolean
 */
function hasWon(game) {
  if (
    game.foundationPiles[0].length == 13 &&
    game.foundationPiles[1].length == 13 &&
    game.foundationPiles[2].length == 13 &&
    game.foundationPiles[3].length == 13
  ) {
    return true
  }
  return false
}

/**
 * Score move
 * 
 * @author Andreas; Jens
 * @email s205338@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} move 
 * @returns score
 */
function scoreMove(move) {  
  if (move.card.rank?.short === 'K' && !hasNextQueenCard(game, move.card)) {
    return 0
  }

  if (move.type === 'wasteToFoundation' || move.type === 'tableauToFoundation') {
    return 5
  } else if (move.type === 'wasteToTableau') {
    return 5
  } else if (move.type === 'foundationToTableau') {
    return -10
  } else {
    return 0
  }
}

/**
 * Priorizes move
 * 
 * @author Andreas; Jens
 * @email s205338@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} move 
 * @param {*} game 
 * @returns priority
 */
function prioritzeMove(move, game) {
  let priority;

  if (move.type === 'tableauToTableau') {
    if (revealsNewCard(game, move)) {
      // console.log('Should reveal new card')
      priority = 'TBD'
    } /*else {
      // TODO: Remove again...
      // Trying this strat
      priority = -1;
    }*/

    if (emptiesTableauPile(move, game) && hasKingInNonEmptyPile(game, move.card)) { // should maybe add if king avaiable conditioon...
      // console.log('Empties stack')
      priority = 1
    }
  }
  
  if (move.type === 'wasteToTableau') {
    if (move.card.rank?.short !== 'K') {
      priority = 1;
    } else {
      if (hasNextQueenCard(game, move.card)) {
        priority = 1;
      } else {
        priority = -1;
      }
    } 
  } 
  
  if (!priority) {
    priority = 0;
  }

  return priority
}

/** -------------------------------------------------------- */
/**
 * Helper functions
 * 
 * @author Tobias; Kim; Andreas; Jens
 * @email s205358@student.dtu.dk;  s205341@student.dtu.dk; s205338@student.dtu.dk; s205343@student.dtu.dk
 */
/** -------------------------------------------------------- */

/**
 * Checks if move empties a pile
 * @param {*} move 
 * @param {*} game 
 * @returns true or false
 */
function emptiesTableauPile(move, game) {
  if (
    game.tableauPiles[move.from.col][0].rank?.short === move.card.rank?.short && 
    game.tableauPiles[move.from.col][0].suit?.short === move.card.suit?.short
  ) {
    return true
  }
  return false
}

/**
 * Checks if game has king in non-empty pile
 * 
 * @param {*} game 
 * @param {*} card 
 * @returns true or false
 */
function hasKingInNonEmptyPile(game, card = null) {
  game.stockPile.forEach(stockCard => {
    // Card takes the new role as tableau card and stock card as the card we wish to move
    if (isKing(stockCard) && hasCardsBelow(stockCard)) {
      return true
    }
  })

  game.wastePile.forEach(wasteCard => {
    // Card takes the new role as tableau card and waste card as the card we wish to move
    if (isKing(wasteCard) && hasCardsBelow(wasteCard)) {
      return true
    }
  })

  game.tableauPiles.forEach(tableauPile => {
    tableauPile.forEach(tableauCard => {
      // Card takes the new role as tableau card and tableau card as the card we wish to move
      if (isKing(tableauCard) && !isSameCard(card, tableauCard) && hasCardsBelow(tableauCard)) {
        return true
      }
    });
  });
}

/**
 * Checks if game has king
 * 
 * @param {*} game 
 * @param {*} card 
 * @returns true or false
 */
function hasKing(game, card = null) {
  game.stockPile.forEach(stockCard => {
    // Card takes the new role as tableau card and stock card as the card we wish to move
    if (isKing(stockCard)) {
      return true
    }
  })

  game.wastePile.forEach(wasteCard => {
    // Card takes the new role as tableau card and waste card as the card we wish to move
    if (isKing(wasteCard)) {
      return true
    }
  })

  game.tableauPiles.forEach(tableauPile => {
    tableauPile.forEach(tableauCard => {
      // Card takes the new role as tableau card and tableau card as the card we wish to move
      if (isKing(tableauCard) && !isSameCard(card, tableauCard)) {
        return true
      }
    });
  });
}

/**
 * Checks if card is king
 * 
 * @param {*} card 
 * @returns true or false
 */
function isKing(card) {
  if (card.rank?.short === 'K') {
    return true
  }
  return false
}

/**
 * Checks if king has next queen in game
 *  
 * @param {*} game 
 * @param {*} card 
 * @returns true or false
 */
function hasNextQueenCard(game, card) {
  game.stockPile.forEach(stockCard => {
    // Card takes the new role as tableau card and stock card as the card we wish to move
    if (isNextQueen(stockCard, card)) {
      return true
    }
  })

  game.wastePile.forEach(wasteCard => {
    // Card takes the new role as tableau card and waste card as the card we wish to move
    if (isNextQueen(wasteCard, card)) {
      return true
    }
  })

  game.tableauPiles.forEach(tableauPile => {
    tableauPile.forEach(tableauCard => {
      // Card takes the new role as tableau card and tableau card as the card we wish to move
      let hasSelf = tableauPile.find((tableauCard) => {
        return isSameCard(card, tableauCard)
      })

      if (isNextQueen(tableauCard, card) && !hasSelf) {
        return true
      }
    });
  });
}

/**
 * Check if card is a kings next queen
 * 
 * @param {*} card 
 * @param {*} king 
 * @returns true or false
 */
function isNextQueen(card, king) {
  if (card.rank?.short === 'Q' && isColorDifferent(card, king)) {
    return true
  }
  return false
}

/**
 * Whether or not the move reveals a card needed in one of the foundation piles.
 * 
 * @param {*} card 
 * @param {*} pile 
 */
function revealsNeededCard(game, card) {
   let foundationCards = getFoundationCards(game)

  for (let i = 0; i < foundationCards.length; i++) {
    const foundationCard = foundationCards[i];
    
    if (isNextInFoundationPile(card, foundationCard)) {
      return card
    }
  }

  return false
}

/**
 * Whether or not the move revelas a new and previously unknown card to the game.
 * 
 * @param {*} card 
 * @param {*} pile 
 */
function revealsNewCard(game, move) {
  let card = move.card
  let bottomTableauCard = getTableauPiles(game)[move.from.col][0]

  // console.log('Moving Card', card, 'Should be same as', bottomTableauCard)

  if (isSameCard(card, bottomTableauCard) && hasCardsBelow(bottomTableauCard)) {
    // console.log('Reveals somethings new')
    return card
  }
  
  return false
}

/**
 * Gets moves of a specific type in a set of mixed moves
 * 
 * @param {*} moves 
 * @param {*} type 
 * @returns moves of type
 */
function getMovesOfType(moves, type) {
  return moves.filter((move) => {
    return move.type === type
  })
}

/**
 * Checks whether there exists a move of a spercifc type in a set of mixed moves
 * 
 * @param {*} moves 
 * @param {*} type 
 * @returns true or false
 */
function hasMoveOfType(moves, type) {
  return moves.some((move) => {
    return move.type === type
  })
}

/**
 * Gets the color of a upfacing card
 * 
 * @param {*} card 
 * @returns color of card
 */
function getColor(card) {
  if (card?.suit?.short == 'C' || card?.suit?.short == 'S') {
    return BLACK;
  } else if (card?.suit?.short == 'D' || card?.suit?.short == 'H') {
    return RED;
  } else {
    throw new Error('Card has no color');
  }
}

/**
 * Checks whether or not the color of two cards is different
 * @see getColor
 * 
 * @param {*} card1 
 * @param {*} card2 
 * @returns true or false
 */
function isColorDifferent(card1, card2) {
  try {
    let color1 = getColor(card1);
    let color2 = getColor(card2);
    return color1 !== color2;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Finds the rank of the next card in a tableau pile order given the top card in that pile
 * 
 * @param {*} card 
 * @returns rank of next card
 */
function nextRankInTableauOrder(card) {
  let next;

  if (!card) {
    next = 13;
  } else {
    next = card?.rank?.short - 1;
  }
  return next;
}

/**
 * Checks if card is next in a tableau pile order given that card and the top card in that pile
 * 
 * @param {*} card 
 * @param {*} tableauCard 
 * @returns true or false
 */
function isNextInTableauPile(card, tableauCard) {
  if (
    isColorDifferent(card, tableauCard) &&
    card?.rank?.short === nextRankInTableauOrder(tableauCard)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Finds the rank of the next card in a foundation pile order given the top card in that pile
 * 
 * @param {*} card 
 * @returns rank of next card
 */
function nextRankInFoundationOrder(card) {
  let next;

  if (!card) {
    next = 1;
  } else {
    next = card?.rank?.short + 1;
  }
  return next;
}

/**
 * Checks if card is next in a foundation pile order given that card and the top card in that pile
 * 
 * @param {*} card 
 * @param {*} foundationCard 
 * @returns true or false
 */
function isNextInFoundationPile(card, foundationCard) {
  if (
    (
      card?.suit?.short === foundationCard?.suit?.short ||
      1 === nextRankInFoundationOrder(foundationCard)
    ) &&
    card?.rank?.short === nextRankInFoundationOrder(foundationCard)
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Grabs tableau pile from game
 * 
 * @param {*} game 
 * @returns tableau piles
 */
function getTableauPiles(game) {
  return game.tableauPiles.map((tableauPile) => {
    return tableauPile
  })
} 

/**
 * Grabs top cards in foundation piles
 * 
 * @param {*} game 
 * @returns top foundation cards
 */
function getFoundationCards(game) {
  return game.foundationPiles.map((foundationPile) => {
    return foundationPile[foundationPile - 1]
  })
} 

/**
 * Checks if two cards are the same
 * 
 * @param {*} cardA 
 * @param {*} cardB 
 * @returns true or false
 */
function isSameCard(cardA, cardB) {
  if (
    cardA?.rank?.short === cardB?.rank?.short &&
    cardB?.suit?.short === cardB?.suit?.short 
  ) {
    return true
  }
  return false
}

/**
 * Checks if card has card below it
 * 
 * @param {*} card 
 * @returns true or false
 */
function hasCardsBelow(card) {
  if (card.size.aspectRatio < 0.57) {
    // console.log('Has card below')
    return true
  }
  return false
}

/**
 * Gets cards of a specific collor
 * 
 * @param {*} cards 
 * @param {*} color 
 * @returns cards of color
 */
function getCardsOfColor(cards, color) {
  return cards.filter((card) => {
    return getColor(card) === color
  })
}

/**
 * Find the lowest foundation rank that is next in order
 * 
 * @param {*} cards 
 * @returns rank
 */
function nextLowestFoundationRank(cards) {
  let nextRanks = cards.map((card) => {
    return nextRankInFoundationOrder(card)
  }).sort()

  if (nextRanks.length === 0) {
    return null
  }
  
  return nextRanks[0]
}