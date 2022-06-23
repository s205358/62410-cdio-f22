/**
 * Edit Modal
 */
const options = [
  {
    id: 1,
    label: 'Unknown',
    value: {
      suit: null,
      rank: null
    },
    icon: '1F0A0'
  },
  {
    id: 2,
    label: 'Ace of Spades',
    value: {
      suit: 'S',
      rank: 1
    },
    icon: '1F0A1'
  },
  {
    id: 3,
    label: 'Two of Spades',
    value: {
      suit: 'S',
      rank: 2
    },
    icon: '1F0A2'
  },
  {
    id: 4,
    label: 'Three of Spades',
    value: {
      suit: 'S',
      rank: 3
    },
    icon: '1F0A3'
  },
  {
    id: 5,
    label: 'Four of Spades',
    value: {
      suit: 'S',
      rank: 4
    },
    icon: '1F0A4'
  },
  {
    id: 6,
    label: 'Five of Spades',
    value: {
      suit: 'S',
      rank: 5
    },
    icon: '1F0A5'
  },
  {
    id: 7,
    label: 'Six of Spades',
    value: {
      suit: 'S',
      rank: 6
    },
    icon: '1F0A6'
  },
  {
    id: 8,
    label: 'Seven of Spades',
    value: {
      suit: 'S',
      rank: 7
    },
    icon: '1F0A7'
  },
  {
    id: 9,
    label: 'Eight of Spades',
    value: {
      suit: 'S',
      rank: 8
    },
    icon: '1F0A8'
  },
  {
    id: 10,
    label: 'Nine of Spades',
    value: {
      suit: 'S',
      rank: 9
    },
    icon: '1F0A9'
  },
  {
    id: 11,
    label: 'Ten of Spades',
    value: {
      suit: 'S',
      rank: 10
    },
    icon: '1F0AA'
  },
  {
    id: 12,
    label: 'Jack of Spades',
    value: {
      suit: 'S',
      rank: 11
    },
    icon: '1F0AB'
  },
  {
    id: 13,
    label: 'Queen of Spades',
    value: {
      suit: 'S',
      rank: 12
    },
    icon: '1F0AD'
  },
  {
    id: 14,
    label: 'King of Spades',
    value: {
      suit: 'S',
      rank: 13
    },
    icon: '1F0AE'
  },
  {
    id: 15,
    label: 'Ace of Hearts',
    value: {
      suit: 'H',
      rank: 1
    },
    icon: '1F0B1'
  },
  {
    id: 16,
    label: 'Two of Hearts',
    value: {
      suit: 'H',
      rank: 2
    },
    icon: '1F0B2'
  },
  {
    id: 17,
    label: 'Three of Hearts',
    value: {
      suit: 'H',
      rank: 3
    },
    icon: '1F0B3'
  },
  {
    id: 18,
    label: 'Four of Hearts',
    value: {
      suit: 'H',
      rank: 4
    },
    icon: '1F0B4'
  },
  {
    id: 19,
    label: 'Five of Hearts',
    value: {
      suit: 'H',
      rank: 5
    },
    icon: '1F0B5'
  },
  {
    id: 20,
    label: 'Six of Hearts',
    value: {
      suit: 'H',
      rank: 6
    },
    icon: '1F0B6'
  },
  {
    id: 21,
    label: 'Seven of Hearts',
    value: {
      suit: 'H',
      rank: 7
    },
    icon: '1F0B7'
  },
  {
    id: 22,
    label: 'Eight of Hearts',
    value: {
      suit: 'H',
      rank: 8
    },
    icon: '1F0B8'
  },
  {
    id: 23,
    label: 'Nine of Hearts',
    value: {
      suit: 'H',
      rank: 9
    },
    icon: '1F0B9'
  },
  {
    id: 24,
    label: 'Ten of Hearts',
    value: {
      suit: 'H',
      rank: 10
    },
    icon: '1F0BA'
  },
  {
    id: 25,
    label: 'Jack of Hearts',
    value: {
      suit: 'H',
      rank: 11
    },
    icon: '1F0BB'
  },
  {
    id: 26,
    label: 'Queen of Hearts',
    value: {
      suit: 'H',
      rank: 12
    },
    icon: '1F0BD'
  },
  {
    id: 27,
    label: 'King of Hearts',
    value: {
      suit: 'H',
      rank: 13
    },
    icon: '1F0BE'
  },
  {
    id: 28,
    label: 'Ace of Diamonds',
    value: {
      suit: 'D',
      rank: 1
    },
    icon: '1F0C1'
  },
  {
    id: 29,
    label: 'Two of Diamonds',
    value: {
      suit: 'D',
      rank: 2
    },
    icon: '1F0C2'
  },
  {
    id: 30,
    label: 'Three of Diamonds',
    value: {
      suit: 'D',
      rank: 3
    },
    icon: '1F0C3'
  },
  {
    id: 31,
    label: 'Four of Diamonds',
    value: {
      suit: 'D',
      rank: 4
    },
    icon: '1F0C4'
  },
  {
    id: 32,
    label: 'Five of Diamonds',
    value: {
      suit: 'D',
      rank: 5
    },
    icon: '1F0C5'
  },
  {
    id: 33,
    label: 'Six of Diamonds',
    value: {
      suit: 'D',
      rank: 6
    },
    icon: '1F0C6'
  },
  {
    id: 34,
    label: 'Seven of Diamonds',
    value: {
      suit: 'D',
      rank: 7
    },
    icon: '1F0C7'
  },
  {
    id: 35,
    label: 'Eight of Diamonds',
    value: {
      suit: 'D',
      rank: 8
    },
    icon: '1F0C8'
  },
  {
    id: 36,
    label: 'Nine of Diamonds',
    value: {
      suit: 'D',
      rank: 9
    },
    icon: '1F0C9'
  },
  {
    id: 37,
    label: 'Ten of Diamonds',
    value: {
      suit: 'D',
      rank: 10
    },
    icon: '1F0CA'
  },
  {
    id: 38,
    label: 'Jack of Diamonds',
    value: {
      suit: 'D',
      rank: 11
    },
    icon: '1F0CB'
  },
  {
    id: 39,
    label: 'Queen of Diamonds',
    value: {
      suit: 'D',
      rank: 12
    },
    icon: '1F0CD'
  },
  {
    id: 40,
    label: 'King of Diamonds',
    value: {
      suit: 'D',
      rank: 13
    },
    icon: '1F0CE'
  },
  {
    id: 41,
    label: 'Ace of Clubs',
    value: {
      suit: 'C',
      rank: 1
    },
    icon: '1F0D1'
  },
  {
    id: 42,
    label: 'Two of Clubs',
    value: {
      suit: 'C',
      rank: 2
    },
    icon: '1F0D2'
  },
  {
    id: 43,
    label: 'Three of Clubs',
    value: {
      suit: 'C',
      rank: 3
    },
    icon: '1F0D3'
  },
  {
    id: 44,
    label: 'Four of Clubs',
    value: {
      suit: 'C',
      rank: 4
    },
    icon: '1F0D4'
  },
  {
    id: 45,
    label: 'Five of Clubs',
    value: {
      suit: 'C',
      rank: 5
    },
    icon: '1F0D5'
  },
  {
    id: 46,
    label: 'Six of Clubs',
    value: {
      suit: 'C',
      rank: 6
    },
    icon: '1F0D6'
  },
  {
    id: 47,
    label: 'Seven of Clubs',
    value: {
      suit: 'C',
      rank: 7
    },
    icon: '1F0D7'
  },
  {
    id: 48,
    label: 'Eight of Clubs',
    value: {
      suit: 'C',
      rank: 8
    },
    icon: '1F0D8'
  },
  {
    id: 49,
    label: 'Nine of Clubs',
    value: {
      suit: 'C',
      rank: 9
    },
    icon: '1F0D9'
  },
  {
    id: 50,
    label: 'Ten of Clubs',
    value: {
      suit: 'C',
      rank: 10
    },
    icon: '1F0DA'
  },
  {
    id: 51,
    label: 'Jack of Clubs',
    value: {
      suit: 'C',
      rank: 11
    },
    icon: '1F0DB'
  },
  {
    id: 52,
    label: 'Queen of Clubs',
    value: {
      suit: 'C',
      rank: 12
    },
    icon: '1F0DD'
  },
  {
    id: 53,
    label: 'King of Clubs',
    value: {
      suit: 'C',
      rank: 13
    },
    icon: '1F0DE'
  },
];

/**
 * Create edit modal with card
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 * 
 * @param {*} card 
 */
function initEditModal(card) {
  const { row, col, selectMenu } = getEditModal();
  row.value = card.getAttribute('data-row');
  col.value = card.getAttribute('data-col');
  order.value = card.getAttribute('data-order')

  let suit = card.getAttribute('data-suit');
  let rank = card.getAttribute('data-rank');
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const element = document.createElement('option');
    element.value = option.id;
    element.innerHTML = `&${option.icon} ${option.label}`;
    // Select current card
    if (option.value.suit == suit && option.value.rank == rank) {
      element.selected = true;
    }
    selectMenu.appendChild(element);
  }
}

/**
 * Resets edit modal
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function resetEditModal() {
  const { row, col } = getEditModal();
  row.value = '';
  col.value = '';
}

/**
 * Opens edit modal
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function onOpenEditModal(event) {
  event.preventDefault();
  const card = event.target;
  initEditModal(card);
  const { editModal } = getEditModal();
  editModal.hidden = false
}

/**
 * Closes edit modal
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function onCloseEditModal() {
  resetEditModal();
  const { editModal } = getEditModal();
  editModal.hidden = true
}

/**
 * Handles save action
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function onSaveEdit() {
  let editedGame = loadLastGame()

  const { row, col, order, selectMenu } = getEditModal()

  let rowVal = parseInt(row.value)
  let colVal = parseInt(col.value) - 1
  let orderVal = parseInt(order.value)
  let optionId = parseInt(selectMenu.value)
  let card = options.find(option => 
    option.id === optionId
  ) 
  let { fileName: _x, ...rank } = rankLabels.find(rankLabel =>
    rankLabel.short === card.value.rank  
  )
  let { fileName: _y, ...suit } = suitLabels.find(suitLabel =>
    suitLabel.short === card.value.suit  
  )

  // TODO: Handle case where no card, or backside facing card
  if (rowVal === 1) {
    if (colVal === 0) {
      // TODO: Handle edit of stock pile (empty or not)
    } else if (colVal === 1) {
      // TODO: Handle edit of waste pile (as below, order always 0 or -1, if none)
    } else {
      let card = editedGame.foundationPiles[colVal][orderVal]
      if (card) {
        editedGame.foundationPiles[colVal][orderVal] = {
          ...card,
          suit,
          rank
        }
      }  
    }
  } else {
    let card = editedGame.tableauPiles[colVal][orderVal]
    if (card) {
      editedGame.tableauPiles[colVal][orderVal] = {
        ...card,
        suit,
        rank
      }
    }  
  }
  
  // Save it
  saveGame(editedGame)

  // Solve it
  const moves = solve(editedGame)
  
  // Display it
  display(editedGame, moves)

  onCloseEditModal();
}

/**
 * Handle cancel action
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function onCancelEdit() {
  onCloseEditModal();
}

/**
 * Grabs edit modal from DOM
 * 
 * @author Rohan; Mohamuud
 * @email s205352@student.dtu.dk; s205333@student.dtu.dk
 */
function getEditModal() {
  const editModal = document.getElementById('edit__modal');
  const row = document.getElementById('row');
  const col = document.getElementById('col');
  const order = document.getElementById('order');
  const selectMenu = document.getElementById('card');
  return { editModal, row, col, order, selectMenu };
}
