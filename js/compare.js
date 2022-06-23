/**
 * Comparison Images
 */
let rankLabels = [
  {
    long: 'Ace',
    fileName: 'ace',
    short: 1,
    image: 'A'
  },
  {
    long: 'Two',
    fileName: 'two',
    short: 2,
    image: 2
  },
  {
    long: 'Three',
    fileName: 'three',
    short: 3,
    image: 3
  },
  {
    long: 'Four',
    fileName: 'four',
    short: 4,
    image: 4
  },
  {
    long: 'Five',
    fileName: 'five',
    short: 5,
    image: 5
  },
  {
    long: 'Six',
    fileName: 'six',
    short: 6,
    image: 6
  },
  {
    long: 'Seven',
    fileName: 'seven',
    short: 7,
    image: 7
  },
  {
    long: 'Eight',
    fileName: 'eight',
    short: 8,
    image: 8
  },
  {
    long: 'Nine',
    fileName: 'nine',
    short: 9,
    image: 9
  },
  {
    long: 'Ten',
    fileName: 'ten_one',
    short: 10,
    image: 10
  },
  {
    long: 'Ten',
    fileName: 'ten_zero',
    short: 10,
    image: 10
  },
  {
    long: 'Jack',
    fileName: 'jack',
    short: 11,
    image: 'J'
  },
  {
    long: 'Queen',
    fileName: 'queen',
    short: 12,
    image: 'Q'
  },
  {
    long: 'King',
    fileName: 'king',
    short: 13,
    image: 'K'
  },
  {
    long: 'Ace',
    fileName: 'red_ace',
    short: 1,
    image: 'A'
  },
  {
    long: 'Two',
    fileName: 'red_two',
    short: 2,
    image: 2
  },
  {
    long: 'Three',
    fileName: 'red_three',
    short: 3,
    image: 3
  },
  {
    long: 'Four',
    fileName: 'red_four',
    short: 4,
    image: 4
  },
  {
    long: 'Five',
    fileName: 'red_five',
    short: 5,
    image: 5
  },
  {
    long: 'Six',
    fileName: 'red_six',
    short: 6,
    image: 6
  },
  {
    long: 'Seven',
    fileName: 'red_seven',
    short: 7,
    image: 7
  },
  {
    long: 'Eight',
    fileName: 'red_eight',
    short: 8,
    image: 8
  },
  {
    long: 'Nine',
    fileName: 'red_nine',
    short: 9,
    image: 9
  },
  {
    long: 'Ten',
    fileName: 'red_ten_one',
    short: 10,
    image: 10
  },
  {
    long: 'Ten',
    fileName: 'red_ten_zero',
    short: 10,
    image: 10
  },
  {
    long: 'Jack',
    fileName: 'red_jack',
    short: 11,
    image: 'J'
  },
  {
    long: 'Queen',
    fileName: 'red_queen',
    short: 12,
    image: 'Q'
  },
  {
    long: 'King',
    fileName: 'red_king',
    short: 13,
    image: 'K'
  },
]
let suitLabels = [
  {
    long: 'Clubs',
    fileName: 'clubs',
    short: 'C',
    image: 'club'
  },
  {
    long: 'Clubs',
    fileName: 'clubs_alt',
    short: 'C',
    image: 'club'
  },
  {
    long: 'Diamonds',
    fileName: 'diamonds',
    short: 'D',
    image: 'diamond'
  },
  {
    long: 'Hearts',
    fileName: 'hearts',
    short: 'H',
    image: 'heart'
  },
  {
    long: 'Spades',
    fileName: 'spades',
    short: 'S',
    image: 'spade'
  },
  {
    long: 'Spades',
    fileName: 'spades_alt',
    short: 'S',
    image: 'spade'
  }
]
let rankImages = []
let suitImages = []

/**
 * Loads comparison images
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 */
function loadComparisonImages() {
  resetComparisonImages()
  loadImagesFromLabels(rankLabels, rankImages)
  loadImagesFromLabels(suitLabels, suitImages)
}

/**
 * Loads comparison images from labels
 *
 * @author Tobias
 * @email s205358@student.dtu.dk
 *  
 * @param {*} labels 
 * @param {*} images 
 */
function loadImagesFromLabels(labels, images) {
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    let src = cv.imread(label.fileName);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
    let dst = new cv.Mat();
    let dsize = new cv.Size(50, 50);
    // You can try more different parameters
    cv.resize(gray, dst, dsize, 0, 0, cv.INTER_AREA);
    images.push(dst);
  }
}

/**
 * Restes comparison images
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 */
function resetComparisonImages() {
  rankImages = []
  suitImages = []
}
