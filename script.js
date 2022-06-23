// https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos

let bob = 'Bob';

const root = document.getElementById('root');
const status = document.getElementById('status')
root.hidden = true;

let rankLabels = [
  { name: 'Ace', fileName: 'ace', shortName: 1, imageName: 'A' },
  { name: 'Two', fileName: 'two', shortName: 2, imageName: 2 },
  { name: 'Three', fileName: 'three', shortName: 3, imageName: 3 },
  { name: 'Four', fileName: 'four', shortName: 4, imageName: 4 },
  { name: 'Five', fileName: 'five', shortName: 5, imageName: 5 },
  { name: 'Six', fileName: 'six', shortName: 6, imageName: 6 },
  { name: 'Seven', fileName: 'seven', shortName: 7, imageName: 7 },
  { name: 'Eight', fileName: 'eight', shortName: 8, imageName: 8 },
  { name: 'Nine', fileName: 'nine', shortName: 9, imageName: 9 },
  { name: 'Ten', fileName: 'ten_one', shortName: 10, imageName: 10 },
  { name: 'Ten', fileName: 'ten_zero', shortName: 10, imageName: 10 },
  { name: 'Jack', fileName: 'jack', shortName: 11, imageName: 'J' },
  { name: 'Queen', fileName: 'queen', shortName: 12, imageName: 'Q' },
  { name: 'King', fileName: 'king', shortName: 13, imageName: 'K' },
  { name: 'Ace', fileName: 'red_ace', shortName: 1, imageName: 'A' },
  { name: 'Two', fileName: 'red_two', shortName: 2, imageName: 2 },
  { name: 'Three', fileName: 'red_three', shortName: 3, imageName: 3 },
  { name: 'Four', fileName: 'red_four', shortName: 4, imageName: 4 },
  { name: 'Five', fileName: 'red_five', shortName: 5, imageName: 5 },
  { name: 'Six', fileName: 'red_six', shortName: 6, imageName: 6 },
  { name: 'Seven', fileName: 'red_seven', shortName: 7, imageName: 7 },
  { name: 'Eight', fileName: 'red_eight', shortName: 8, imageName: 8 },
  { name: 'Nine', fileName: 'red_nine', shortName: 9, imageName: 9 },
  { name: 'Ten', fileName: 'red_ten_one', shortName: 10, imageName: 10 },
  { name: 'Ten', fileName: 'red_ten_zero', shortName: 10, imageName: 10 },
  { name: 'Jack', fileName: 'red_jack', shortName: 11, imageName: 'J' },
  { name: 'Queen', fileName: 'red_queen', shortName: 12, imageName: 'Q' },
  { name: 'King', fileName: 'red_king', shortName: 13, imageName: 'K' },
]
let rankImages = []

let suitLabels = [
  { name: 'Clubs', fileName: 'clubs', shortName: 'C', imageName: 'club' },
  { name: 'Clubs', fileName: 'clubs_alt', shortName: 'C', imageName: 'club' },
  { name: 'Diamonds', fileName: 'diamonds', shortName: 'D', imageName: 'diamond' },
  { name: 'Hearts', fileName: 'hearts', shortName: 'H', imageName: 'heart' },
  { name: 'Spades', fileName: 'spades', shortName: 'S', imageName: 'spade' },
  { name: 'Spades', fileName: 'spades_alt', shortName: 'S', imageName: 'spade' }
]
let suitImages = []

function onOpenCvReady() {
  console.log('OpenCV loaded');
  status.innerText = 'Ready!';
  root.hidden = false;

  cv['onRuntimeInitialized'] = function () {
    for (let i = 0; i < rankLabels.length; i++) {
      const rankLabel = rankLabels[i];
      let src = cv.imread(rankLabel.fileName);
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
      let dst = new cv.Mat();
      let dsize = new cv.Size(50, 50);
      // You can try more different parameters
      cv.resize(gray, dst, dsize, 0, 0, cv.INTER_AREA);
      rankImages.push(dst);
    }

    for (let i = 0; i < suitLabels.length; i++) {
      const suitLabel = suitLabels[i];
      let src = cv.imread(suitLabel.fileName);
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
      let dst = new cv.Mat();
      let dsize = new cv.Size(50, 50);
      // You can try more different parameters
      cv.resize(gray, dst, dsize, 0, 0, cv.INTER_AREA);
      suitImages.push(dst);
    }
  }
}

const upload = document.getElementById('upload');
const image = document.getElementById('image');
const button = document.getElementById('button');

upload.onchange = function () {
  image.src = URL.createObjectURL(event.target.files[0]);
};

image.onload = function () {
  let img = cv.imread(image);
  cv.imshow('canvas', img);
  img.delete();
};

button.onclick = function () {
  this.disabled = true;
  document.body.classList.add('loading');

  // Load image
  let img = cv.imread('canvas');

  // Process image
  let gray = new cv.Mat();
  cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

  // https://docs.opencv.org/3.4/dd/d6a/tutorial_js_filtering.html
  let blur = new cv.Mat();
  let kSize = new cv.Size(5, 5);
  cv.GaussianBlur(gray, blur, kSize, 0, 0);

  // https://docs.opencv.org/3.4/d7/dd0/tutorial_js_thresholding.html
  let thresh = new cv.Mat();
  let threshLvl = 255 - 80; // Should probably be more dynamic!
  cv.threshold(blur, thresh, threshLvl, 255, cv.THRESH_BINARY);

  // https://docs.opencv.org/3.4/d5/daa/tutorial_js_contours_begin.html
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  let u0 = (img.cols) / 2.0
  let v0 = (img.rows) / 2.0

  const cardsInImage = [];

  // Find cards
  // https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
  // https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
  let poly = new cv.MatVector();
  for (let i = 0; i < contours.size(); i++) {
    let tmp = new cv.Mat();
    let cnt = contours.get(i);

    let area = cv.contourArea(cnt);
    let perimeter = cv.arcLength(cnt, true);
    let epsilon = 0.03 * perimeter; // Changed from 1% to 3% for better results.
    cv.approxPolyDP(cnt, tmp, epsilon, true);

    // Possible Bug: Fix by removing height (number of edges) condition.
    if (!(area > 20000 /* && tmp.size().height == 4 */)) {
      continue;
    }
    poly.push_back(tmp);

    // Get corner points of polygon (is rect)
    let pts = tmp.data32S
    let pt1 = [pts[0], pts[1]];
    let pt2 = [pts[2], pts[3]];
    let pt3 = [pts[4], pts[5]];
    let pt4 = [pts[6], pts[7]];
    let coords = [pt1, pt2, pt3, pt4];

    // Sort from top to bottom
    let sortedCoords = coords.sort((a, b) => {
      return a[1] - b[1]
    });

    // Determine semantic corners
    let topLeft, topRight, bottomLeft, bottomRight;

    if (sortedCoords[0][0] < sortedCoords[1][0]) {
      topLeft = sortedCoords[0];
      topRight = sortedCoords[1];
    } else {
      topLeft = sortedCoords[1];
      topRight = sortedCoords[0];
    }

    if (sortedCoords[2][0] < sortedCoords[3][0]) {
      bottomLeft = sortedCoords[2];
      bottomRight = sortedCoords[3];
    } else {
      bottomLeft = sortedCoords[3];
      bottomRight = sortedCoords[2];
    }

    // Calculate top and bottom width using the euclidian distance between the top and bottom points respectively.
    let topWidth = Math.sqrt(
      Math.pow(topLeft[0] - topRight[0], 2) + Math.pow(topLeft[1] - topRight[1], 2)
    );
    let bottomWidth = Math.sqrt(
      Math.pow(bottomLeft[0] - bottomRight[0], 2) + Math.pow(bottomLeft[1] - bottomRight[1], 2)
    );

    // Use the greatest width of the two
    let maxWidth = Math.max(topWidth, bottomWidth);
    // Alternatively use the mean.
    // let meanWidth = Math.ceil((topWidth + bottomWidth) / 2);

    // Calculate left and right height using the euclidian distance between the left and right points respectively.
    let leftHeight = Math.sqrt(
      Math.pow(topLeft[0] - bottomLeft[0], 2) + Math.pow(topLeft[1] - bottomLeft[1], 2)
    );
    let rightHeight = Math.sqrt(
      Math.pow(topRight[0] - bottomRight[0], 2) + Math.pow(topRight[1] - bottomRight[1], 2)
    );

    // Use the greatest height of the two
    let maxHeight = Math.max(leftHeight, rightHeight);
    // Alternatively use the mean.
    // let meanHeight = Math.ceil((leftHeight + rightHeight) / 2);

    let visibleAspectRatio = maxWidth / maxHeight;

    // Without correct scaling
    let realAspectRatio = visibleAspectRatio;
    let actualWidth = maxWidth;
    let actualHeight = maxHeight;

    /*
    // Respect aspect ratio of card or pile
    // https://www.microsoft.com/en-us/research/publication/whiteboard-scanning-image-enhancement/
    // 3D Vectors
    v1 = [topLeft[0], topLeft[1], 1];
    v2 = [topRight[0], topRight[1], 1];
    v3 = [bottomLeft[0], bottomLeft[1], 1];
    v4 = [bottomRight[0], bottomRight[1], 1];

    // console.log(v1, v2, v3, v4);

    let k2 = dot3d(cross3d(v1, v4), v3) / dot3d(cross3d(v2, v4), v3);
    console.log(dot3d(cross3d(v1, v4), v3) / dot3d(cross3d(v2, v4), v3));
    console.log(dot3d(cross3d(v1, v4), v3), dot3d(cross3d(v2, v4), v3));
    console.log(v3, v3);
    console.log(cross3d(v1, v4), cross3d(v2, v4));
    console.log(v1, v4, v2, v4);
    let k3 = dot3d(cross3d(v1, v4), v2) / dot3d(cross3d(v3, v4), v2);

    let n2 = subtract3d(scale3d(k2, v2), v1);
    let n3 = subtract3d(scale3d(k3, v3), v1);

    let f = Math.sqrt(
      Math.abs((1.0 / (n2[2] * n3[2])) * (
        (n2[0] * n3[0] - (n2[0] * n3[2] + n2[2] * n3[0]) * u0 + n2[2] * n3[2] * u0 * u0) +
        (n2[1] * n3[1] - (n2[1] * n3[2] + n2[2] * n3[1]) * v0 + n2[2] * n3[2] * v0 * v0)
      ))
    )

    let A = [
      [f, 0, u0],
      [0, f, v0],
      [0, 0, 1]
    ];

    let At = transpose3dMat(A)
    let Ati = inverse3dMat(At)
    let Ai = inverse3dMat(A)

    let realAspectRatio = Math.sqrt(
      dot3d(dot3dMatVec(Ai, dot3dMatVec(Ati, n2)), n2) / dot3d(dot3dMatVec(Ai, dot3dMatVec(Ati, n3)), n3)
    );

    let actualWidth, actualHeight;
    if (realAspectRatio < visibleAspectRatio) {
      actualWidth = Math.round(maxWidth);
      actualHeight = Math.round(actualWidth / realAspectRatio);
    } else {
      actualHeight = Math.round(maxHeight);
      actualWidth = Math.round(actualHeight * realAspectRatio);
    }

    // console.log(i, maxWidth, actualWidth, maxHeight, actualHeight)

    // Handle edge cases that are way off
    // If either change, update realAspectRatio
    if (actualWidth < maxHeight * 0.85 || actualWidth > maxWidth * 1.15) {
      actualWidth = maxWidth;
      realAspectRatio = visibleAspectRatio;
    }

    if (actualHeight < maxHeight * 0.85 || actualHeight > maxHeight * 1.15) {
      actualHeight = maxHeight;
      realAspectRatio = visibleAspectRatio;
    }

    console.log(
      `Card: ${i}`,
      `Max Width: ${maxWidth}`,
      `Actual Width: ${actualWidth}`,
      `Max Height: ${maxHeight}`,
      `Actual Height: ${actualHeight}`,
      `Visible Aspect Ratio: ${visibleAspectRatio}`,
      `Real Aspect Ratio: ${realAspectRatio}`
    )
    */

    let xOffset = 0; // actualWidth * 0.02;
    let yOffset = 0; // actualHeight * 0.02;

    // No cards are laying down by definition, i.e. we don not need to check for this, e.g. if aspect ratio < 1.2 standing up else laying down
    let pts1 = [
      topLeft[0] - xOffset, topLeft[1] - yOffset,
      topRight[0] + xOffset, topRight[1] - yOffset,
      bottomLeft[0] - xOffset, bottomLeft[1] + yOffset,
      bottomRight[0] + xOffset, bottomRight[1] + yOffset
    ];

    let pts2 = [
      0, 0,
      actualWidth, 0,
      0, actualHeight,
      actualWidth, actualHeight
    ];

    let dst = new cv.Mat();
    let dsize = new cv.Size(actualWidth, actualHeight);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pts1);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, pts2);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);

    cv.warpPerspective(img, dst, M, dsize);

    // https://docs.opencv.org/3.4/de/d06/tutorial_js_basic_ops.html
    // "Sometimes, you will have to play with certain region of images. For eye detection in images, first face detection is done all over the image and when face is obtained, we select the face region alone and search for eyes inside it instead of searching whole image. It improves accuracy (because eyes are always on faces) and performance (because we search for a small area)"
    let bottomRightCorner = new cv.Mat();

    // You can try more different parameters
    // https://docs.opencv.org/4.x/d5/df1/tutorial_js_some_data_structures.html
    let rect = new cv.Rect(
      actualWidth - Math.ceil(actualWidth * 0.175),
      actualHeight - Math.ceil(actualWidth * 1.545 * 0.250),
      Math.ceil(actualWidth * 0.175),
      Math.ceil(actualWidth * 1.545 * 0.250)
    );

    // If playing with cards that can be layed on top of each other horizontally
    // if (realAspectRatio > 0.72) {
    //   rect = new cv.Rect(
    //     actualWidth - Math.ceil(actualHeight * 0.647 * 0.175),
    //     actualHeight - Math.ceil(actualHeight * 0.250),
    //     Math.ceil(actualHeight * 0.647 * 0.175),
    //     Math.ceil(actualHeight * 0.250)
    //   )
    // }

    bottomRightCorner = dst.roi(rect);

    // let rotatedBottomRightCorner = bottomRightCorner.clone()
    // https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
    let rotatedBottomRightCorner = new cv.Mat();
    let rsize = new cv.Size(bottomRightCorner.cols, bottomRightCorner.rows);
    let center = new cv.Point(
      bottomRightCorner.cols / 2.0,
      bottomRightCorner.rows / 2.0
    );
    // You can try more different parameters
    let rM = cv.getRotationMatrix2D(center, 180, 1.1);

    cv.warpAffine(bottomRightCorner, rotatedBottomRightCorner, rM, rsize);

    let grayRotatedBottomRightCorner = new cv.Mat();
    cv.cvtColor(rotatedBottomRightCorner, grayRotatedBottomRightCorner, cv.COLOR_RGBA2GRAY);

    // https://docs.opencv.org/3.4/dd/d6a/tutorial_js_filtering.html
    let blurRotatedBottomRightCorner = new cv.Mat();
    let kSize = new cv.Size(5, 5);
    cv.GaussianBlur(grayRotatedBottomRightCorner, blurRotatedBottomRightCorner, kSize, 0, 0);

    // https://docs.opencv.org/3.4/d7/dd0/tutorial_js_thresholding.html
    let threshRotatedBottomRightCorner = new cv.Mat();
    cv.threshold(blurRotatedBottomRightCorner, threshRotatedBottomRightCorner, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

    // https://docs.opencv.org/3.4/d5/daa/tutorial_js_contours_begin.html
    let contoursRotatedBottomRightCorner = new cv.MatVector();
    let hierarchyRotatedBottomRightCorner = new cv.Mat();
    cv.findContours(threshRotatedBottomRightCorner, contoursRotatedBottomRightCorner, hierarchyRotatedBottomRightCorner, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    if (!(contoursRotatedBottomRightCorner.size() > 0)) {
      continue;
    }

    let symbols = [];

    for (let j = 0; j < contoursRotatedBottomRightCorner.size(); j++) {
      const contour = contoursRotatedBottomRightCorner.get(j);
      symbols.push(cv.boundingRect(contour))
    }

    // Sort by most left (may already be sorted such)
    let sortedSymbols = symbols.sort((a, b) => {
      return a.x - b.x
    });

    // Sort by closest to center
    // let sortedSymbols = symbols.sort((a, b) => {
    //   return Math.abs(a.x - center.x) - Math.abs(b.x - center.x)
    // });

    // Sort by size
    // let sortedSymbols = contoursRotatedBottomRightCorner.sort((a, b) => {
    //   cv.contourArea(a) - cv.contourArea(b);
    // }).reverse();

    let s1 = new cv.Mat();
    let s2 = new cv.Mat();

    let rect1 = sortedSymbols[0];
    let rect2 = sortedSymbols[1];

    s1 = rotatedBottomRightCorner.roi(rect1);
    s2 = rotatedBottomRightCorner.roi(rect2);

    let suit, rank;
    if (rect1.y < rect2.y) {
      rank = s1
      suit = s2
    } else {
      rank = s2
      suit = s1
    }

    // Find closest match for rank
    let rankScaled = new cv.Mat();
    let rankScaledGray = new cv.Mat();
    let rankSize = new cv.Size(50, 50);
    cv.resize(rank, rankScaled, rankSize)
    cv.cvtColor(rankScaled, rankScaledGray, cv.COLOR_RGBA2GRAY)
    let bestRankDiff = Math.pow(100, 10);
    let bestRank = 0;

    for (let j = 0; j < rankImages.length; j++) {
      const compareImage = rankImages[j];
      let imgDiff = new cv.Mat();
      cv.absdiff(rankScaledGray, compareImage, imgDiff);

      // Check for black or red to reduce search area first.

      let sumDiff = Math.ceil(imgDiff.data.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / 255);

      if (j == 0) {
        bestRankDiff = sumDiff
      }

      if (sumDiff < bestRankDiff) {
        bestRank = j
        bestRankDiff = sumDiff
      }
    }

    // No rank match if best match exceeds threshold
    if (bestRankDiff > 600) {
      bestRank = -1
    }

    // Find closest match for suit
    let suitScaled = new cv.Mat();
    let suitScaledGray = new cv.Mat();
    let suitSize = new cv.Size(50, 50);
    cv.resize(suit, suitScaled, suitSize)
    cv.cvtColor(suitScaled, suitScaledGray, cv.COLOR_RGBA2GRAY)
    let bestSuitDiff = Math.pow(100, 10);
    let bestSuit = 0;

    for (let j = 0; j < suitImages.length; j++) {
      const compareImage = suitImages[j];
      let imgDiff = new cv.Mat();
      cv.absdiff(suitScaledGray, compareImage, imgDiff);

      // Check for black or red to reduce search area first.

      let sumDiff = Math.ceil(imgDiff.data.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0) / 255);

      if (j == 0) {
        bestSuitDiff = sumDiff
      }

      if (sumDiff < bestSuitDiff) {
        bestSuit = j
        bestSuitDiff = sumDiff
      }
    }

    // No suit match if best match exceeds threshold
    if (bestSuitDiff > 600) {
      bestSuit = -1
    }

    // If either rank or suit doesn't have a match, the detected card is facing downwards
    // Assuming all detected objects at this point are cards
    let isTurned = bestRank < 0 || bestSuit < 0;

    // Save cards in image
    cardsInImage.push({
      index: i,
      backsideUp: isTurned,
      rank: {
        short: isTurned ? null : rankLabels[bestRank].shortName,
        long: isTurned ? null : rankLabels[bestRank].name,
        image: isTurned ? null : rankLabels[bestRank].imageName
      },
      suit: {
        short: isTurned ? null : suitLabels[bestSuit].shortName,
        long: isTurned ? null : suitLabels[bestSuit].name,
        image: isTurned ? null : suitLabels[bestSuit].imageName
      },
      location: {
        x: topLeft[0],
        y: topLeft[1],
        corners: {
          topLeft: {
            x: topLeft[0],
            y: topLeft[1]
          },
          topRight: {
            x: topRight[0],
            y: topRight[1]
          },
          bottomLeft: {
            x: bottomLeft[0],
            y: bottomLeft[1]
          },
          bottomRight: {
            x: bottomRight[0],
            y: bottomRight[1]
          }
        }
      },
      size: {
        width: actualWidth,
        height: actualHeight,
        aspectRatio: realAspectRatio
      },
      name: function () {
        if (this.backsideUp) {
          return 'Unknown';
        }
        return this.rank.long + " of " + this.suit.long;
      },
      shortName: function () {
        if (this.backsideUp) {
          return 'U';
        }
        return this.suit.short + this.rank.short;
      }
    })
  }

  console.log(cardsInImage);

  // Determine location
  let xVals = cardsInImage.map((card) => {
    return card.location.x;
  });
  let yVals = cardsInImage.map((card) => {
    return card.location.y;
  });

  let minY = Math.min(...yVals);
  let maxX = Math.max(...xVals);

  let cardWithMaxX = cardsInImage.find((card) => {
    return card.location.x == maxX;
  });

  let assumedWidth = cardWithMaxX.size.width;
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

  let cardsWithLocation = cardsInImage.map((card) => {
    card.space = {
      row: determineNumericalSpace(card.location.y, rowBoundaries),
      col: determineNumericalSpace(card.location.x, colBoundaries)
    }
    return card;
  })

  function determineNumericalSpace(value, boundaries) {
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

  // Setup game
  const currGame = {
    stockPile: cardsWithLocation.filter((card) => {
      return card.space.col == 1 && card.space.row == 1;
    }),
    wastePile: cardsWithLocation.filter((card) => {
      return card.space.col == 2 && card.space.row == 1;
    }),
    foundationPiles: [
      cardsWithLocation.filter((card) => {
        return card.space.col == 4 && card.space.row == 1;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 5 && card.space.row == 1;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 6 && card.space.row == 1;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 7 && card.space.row == 1;
      }),
    ],
    tableauPiles: [
      cardsWithLocation.filter((card) => {
        return card.space.col == 1 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 2 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 3 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 4 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 5 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 6 && card.space.row == 2;
      }),
      cardsWithLocation.filter((card) => {
        return card.space.col == 7 && card.space.row == 2;
      }),
    ],
    isStockPileEmpty: function () {
      return this.stockPile.length == 0
    }
  }

  // Determine change:
  // Load game history
  let gameHistory = JSON.parse(window.localStorage.getItem('game-history')) ?? [];

  // Get previus state of game
  let prevGame = gameHistory[gameHistory.length - 1];

  // Update game to account for previous state
  let updatedGame = prevGame ?? currGame;

  // If we are continuing from previous game, find the change since last move
  if (prevGame) {
    // Look for changes in waste pile
    // Grab the waste pile's current and previous state
    let currWastePile = currGame.wastePile;
    let prevWastePile = prevGame.wastePile;

    // Grab the current and previous waste pile's top most card
    let currTopWasteCard = currWastePile[currWastePile.length - 1];
    let prevTopWasteCard = prevWastePile[prevWastePile.length - 1];

    if (
      currTopWasteCard?.suit.short !== prevTopWasteCard?.suit.short ||
      currTopWasteCard?.rank.short !== prevTopWasteCard?.rank.short
    ) {
      console.log(`Waste pile change`);
      if (currWastePile.length == 0) {
        // If current pile empty, updated pile is empty
        updatedGame.wastePile = [];
      } else {
        // Otherwise a card was moved to the pile
        updatedGame.wastePile.pop();
        updatedGame.wastePile.push(currTopWasteCard);
      }
    }

    // Look for changes in stock pile
    // Grab the stock pile's current and previous state
    let currStockPile = currGame.stockPile;
    let prevStockPile = prevGame.stockPile;

    // Grab the current and previous stock pile's top most card
    let currTopStockCard = currStockPile[currStockPile.length - 1];
    let prevTopStockCard = prevStockPile[prevStockPile.length - 1];

    if (
      currTopStockCard?.suit.short !== prevTopStockCard?.suit.short ||
      currTopStockCard?.rank.short !== prevTopStockCard?.rank.short
    ) {
      console.log(`Stock pile change`);
      // If current pile empty, updated pile is empty
      if (currStockPile.length == 0) {
        updatedGame.stockPile = [];
      } else {
        // Otherwise a card was moved from the pile 
        // Does not account for us knowing what's in the pile...
        updatedGame.stockPile.pop();
        updatedGame.stockPile.push(currTopStockCard);
      }
    }

    // Look for changes in tableau piles
    // For us to update accoridng to "run", we must  know before what was moved and where to at the same time, do this after.
    let runPile = [];
    let runToPile = -1;
    for (let i = 0; i < currGame.tableauPiles.length; i++) {
      // Grab the relevant pile's current and previous state
      const currPile = currGame.tableauPiles[i];
      const prevPile = prevGame.tableauPiles[i];

      // Grab the current and previous pile's top most card
      const currTopCard = currPile[currPile.length - 1];
      const prevTopCard = prevPile[prevPile.length - 1];

      // Grab the previous pile's bottom most card
      // const prevBottomCard = prevPile[0];

      // There is always a change in rank and/or suit of top most card in pile, 
      // When there is a change in a pile, as no two cards have the same rank and suit.
      if (
        currTopCard?.suit.short !== prevTopCard?.suit.short ||
        currTopCard?.rank.short !== prevTopCard?.rank.short
      ) {
        console.log(`Tableau pile change in pile: ${i + 1}`);
        if (!prevTopCard) {
          // No card before, means we moved one or more cards to here
          if (currTopCard?.rank.short == 13) {
            console.log(`Layed down single card`);
            // If top most card is now a king, we must have layed down just a single card, i.e. a king.
            updatedGame.tableauPiles[i].push(currTopCard);
          } else {
            console.log(`Layed down run of cards`);
            // Otherwise we must have have layed down a "run" of cards.
            runToPile = i;
          }
        } else if (!currTopCard) {
          // No card now, mean we moved one or more cards from here

          // Either way, there is no longer any cards in the pile
          updatedGame.tableauPiles[i] = [];

          // For the pile to be empty now, we must have known all cards in the pile
          // I.e., the amount of cards in the previous pile determines how many cards were moved.
          if (prevPile.length == 1) {
            console.log(`Taken up single card`);
            // If there was only one card, we must have have taken just a single card, i.e. that card.
            // We do nothing.
          } else {
            console.log(`Taken up run of cards`);
            // Otherwise we must have taken a "run" of cards.
            runPile = prevPile;
          }
        } else {
          // Handle other situations where cards are involved before and after

          // Find change in rank
          let rankChange = (prevTopCard?.rank.short ?? 0) - (currTopCard?.rank.short ?? 0);

          // We can look at which pile is longer to determine whether or nor a card was moved to or from here.
          if (currTopCard.size.aspectRatio < prevTopCard.size.aspectRatio) {
            // Current pile is longer, i.e. card was moved to here
            if (Math.abs(rankChange) == 1) {
              console.log(`Layed down single card`);
              // If there was only one jump in rank, we must have layed down a single card
              updatedGame.tableauPiles[i].push(currTopCard);
            } else {
              console.log(`Layed down run of cards`);
              // Otherwsie, we must have layed down a "run" of cards
              runToPile = i;
            }
          } else {
            // Previous pile is longer, i.e. card was moved from here

            // If current top most card was *not* in previous pile, we must have flipped a card
            let wasInPile = prevPile.find((card) => {
              return (
                card?.rank.short === currTopCard?.rank.short &&
                card?.suit.short === currTopCard?.suit.short
              );
            })
            if (wasInPile) {
              // No flip, i.e. we proceed as usual
              if (Math.abs(rankChange) == 1) {
                console.log(`Taken up single card`);
                // If there was only one jump in rank, we must have taken a single card
                updatedGame.tableauPiles[i].pop()
              } else {
                console.log(`Taken up run of cards`);
                // Otherwsie, we must have taken a "run" of cards
                runToPile = updatedGame.tableauPiles[i]
                  .splice(prevPile.length - Math.abs(rankChange), 0);
              }
            } else {
              console.log('Flipped card');
              // A flip, i.e. we proceed as follows
              if (prevPile.length == 1) {
                console.log(`Taken up single card`);
                // If there was only one card, we must have have taken just a single card, i.e. that card.
                updatedGame.tableauPiles[i].pop();
              } else {
                console.log(`Taken up run of cards`);
                // Otherwise we must have taken a "run" of cards.
                updatedGame.tableauPiles[i] = [];
                runPile = prevPile;
              }
              // Set flipped card;
              updatedGame.tableauPiles[i].push(currTopCard);
            }
          }
        }
      }
    }

    // Handle run after checking tableau piles, as a run consts of multiple cards and can only appear within the tableau piles.
    // We must know what cards are moved before updating the location to where they are moved.
    if (runPile.length > 0) {
      updatedGame.tableauPiles[runToPile].push(...runPile);
      // TODO: Make sure dimensions for updated per top card is updated
      let updatedTopCard = currGame.tableauPiles[runToPile][currGame.tableauPiles[runToPile].length - 1];
      console.log(updatedGame.tableauPiles[runToPile], updatedTopCard);
      updatedGame.tableauPiles[runToPile].pop();
      updatedGame.tableauPiles[runToPile].push(updatedTopCard);
      console.log(updatedGame.tableauPiles[runToPile]);
    }

    // Look for changes in foundation piles
    for (let i = 0; i < currGame.foundationPiles.length; i++) {
      // Grab the relevant pile's current and previous state
      const currPile = currGame.foundationPiles[i];
      const prevPile = prevGame.foundationPiles[i];

      // Grab the current and previous pile's top most card
      const currTopCard = currPile[currPile.length - 1];
      const prevTopCard = prevPile[prevPile.length - 1];

      // Grab the previous pile's bottom most card
      // const prevBottomCard = prePile[0];

      // There is always a change in rank and/or suit of top most card in pile, 
      // When there is a change in a pile, as no two cards have the same rank and suit.
      if (
        // currTopCard?.suit.short !== prevTopCard?.suit.short || // Assume no change in suit
        currTopCard?.rank.short !== prevTopCard?.rank.short
      ) {
        console.log(`Foundation pile change in pile: ${i + 1}`);
        if (!prevTopCard) {
          console.log(`Layed down single card`);
          // No card before, means we moved one card to here
          // We must have layed down just a single card.
          updatedGame.foundationPiles[i].push(currTopCard);
        } else if (!currTopCard) {
          console.log(`Taken up single card`);
          // No card now, mean we moved one card from here
          // There is no longer any cards in the pile
          updatedGame.foundationPiles[i] = [];
          // There was only one card, we must have have taken just a single card, i.e. that card.
          // We do nothing.
        } else {
          // Handle other situations where cards are involved before and after

          // Find change in rank
          let rankChange = (prevTopCard?.rank.short ?? 0) - (currTopCard?.rank.short ?? 0);

          // Only a single card may be moved to and from here and change is at most 1.
          if (rankChange < 0) {
            console.log(`Layed down single card`);
            // Card was moved to here
            // There is only one jump in rank, we must have layed down a single card.
            updatedGame.foundationPiles[i].push(currTopCard);
          } else {
            console.log(`Taken up single card`);
            // Card was moved from here
            // There is only one jump in rank, we must have have taken just a single card.
            updatedGame.foundationPiles[i].pop();
          }
        }
      }
    }
  }

  console.log(updatedGame)

  displaySolitaire(updatedGame);

  // Add game to game history
  gameHistory.push(updatedGame);

  // Save game history
  // window.localStorage.setItem('game-history', JSON.stringify(gameHistory));

  // Solve game
  let moves = [];

  // Can you draw from stock pile?
  if (updatedGame.stockPile.length > 0) {
    moves.push({
      type: 'stockToWaste',
      from: 'stockPile',
      to: 'wastePile'
    })
  }

  // Can use card from waste pile?
  if (updatedGame.wastePile.length > 0) {
    // Is stock pile empty?
    if (updatedGame.stockPile.length == 0) {
      moves.push({
        type: 'flipWasteToStock',
        from: 'wastePile',
        to: 'stockPile'
      })
    }

    // Grab moveable card
    let wasteCard = updatedGame.wastePile[updatedGame.wastePile.length - 1];

    // ...to foundation piles?
    for (let i = 0; i < updatedGame.foundationPiles.length; i++) {
      const foundationPile = updatedGame.foundationPiles[i];

      // Are those checks redudant with isNextInPile methods???
      if (foundationPile.length === 0) {
        // Is empty, only ace can be moved to here
        if (wasteCard?.rank.short == 1) {
          moves.push({
            type: 'wasteToFoundation',
            from: `waste`,
            to: `foundationPile${i}`
          })
        }
      } else {
        const foundationTopCard = foundationPile[foundationPile.length - 1];

        // Can card be moved to foundation pile, is it next in order?
        if (isNextInFoundationPile(wasteCard, foundationTopCard)) {
          moves.push({
            type: 'wasteToFoundation',
            from: `waste`,
            to: `foundationPile${i}`
          })
        }
      }
    }

    // ...to tableau piles?
    for (let i = 0; i < updatedGame.tableauPiles.length; i++) {
      const tableauPile = updatedGame.tableauPiles[i];

      // Are those checks redudant with isNextInPile methods???
      if (tableauPile.length === 0) {
        // Is empty, only a king can be moved to here
        if (wasteCard?.rank.short == 13) {
          moves.push({
            type: 'wasteToTableau',
            from: `waste`,
            to: `tableauPile${i}`
          })
        }
      } else {
        const tableauTopCard = tableauPile[tableauPile.length - 1];

        // Can card be moved to tableau pile, is it next in order?
        if (isNextInTableauPile(wasteCard, tableauTopCard)) {
          moves.push({
            type: 'wasteToTableau',
            from: `waste`,
            to: `tableauPile${i}`
          })
        }
      }
    }
  }

  // Can use cards from foundation piles?
  for (let i = 0; i < updatedGame.foundationPiles.length; i++) {
    const foundationPile = updatedGame.foundationPiles[i];

    if (foundationPile.length > 0) {
      // Pile has content and there is something to move

      // Grab moveable card
      const foundationTopCard = foundationPile[foundationPile.length - 1];

      // ...to tableau piles?
      for (let j = 0; j < updatedGame.tableauPiles.length; j++) {
        const tableauPile = updatedGame.tableauPiles[j];

        // Are those checks redudant with isNextInPile methods???
        if (tableauPile.length === 0) {
          // Is empty, only a king can be moved to here
          if (foundationTopCard?.rank.short == 13) {
            moves.push({
              type: 'foundationToTableau',
              from: `foundationPile${i}`,
              to: `tableauPile${i}`
            })
          }
        } else {
          const tableauTopCard = tableauPile[tableauPile.length - 1];

          // Can card be moved to tableau pile, is it next in order?
          if (isNextInTableauPile(foundationTopCard, tableauTopCard)) {
            moves.push({
              type: 'foundationToTableau',
              from: `foundationPile${i}`,
              to: `tableauPile${i}`
            })
          }
        }
      }
    }
    // Otherwise pile is empty and there is nothing to move, i.e. do nothing
  }

  // Can use cards from tableau piles?
  for (let i = 0; i < updatedGame.tableauPiles.length; i++) {
    const tableauPile = updatedGame.tableauPiles[i];

    if (tableauPile.length > 0) {
      // Pile has content and there is something to move

      // Grab moveable card
      const tableauTopCard = tableauPile[tableauPile.length - 1];

      // ...to foundation piles
      for (let j = 0; j < updatedGame.foundationPiles.length; j++) {
        const foundationPile = updatedGame.foundationPiles[j];

        // Are those checks redudant with isNextInPile methods???
        if (foundationPile.length === 0) {
          // Is empty, only ace can be moved to here
          if (tableauTopCard?.rank.short == 1) {
            moves.push({
              type: 'tableauToFoundation',
              from: `tableauPile${i}`,
              to: `foundationPile${i}`
            })
          }
        } else {
          const foundationTopCard = foundationPile[foundationPile.length - 1];

          // Can card be moved to foundation pile, is it next in order?
          if (isNextInFoundationPile(tableauTopCard, foundationTopCard)) {
            moves.push({
              type: 'tableauToFoundation',
              from: `tableauPile${i}`,
              to: `foundationPile${i}`
            })
          }
        }
      }

      // ...to tableau piles
      for (let j = 0; j < tableauPile.length; j++) {
        // Try all cards in pile to check for potential "runs"
        const tableauCard = tableauPile[j];

        // Note: If j is not top card it is a run of cards being moved.

        for (let k = 0; k < updatedGame.tableauPiles.length; k++) {
          const otherTableauPile = updatedGame.tableauPiles[k];

          // Do not for pile we are within
          if (k === i) {
            continue;
          }

          // Are those checks redudant with isNextInPile methods???
          if (otherTableauPile.length === 0) {
            // Is empty, only ace can be moved to here
            if (tableauCard?.rank.short == 13) {
              moves.push({
                type: 'tableauToTableau',
                from: `tableauPile${i}`,
                to: `tableauPile${k}`,
                isRun: j < tableauPile.length - 1
              })
            }
          } else {
            const otherTableauTopCard = otherTableauPile[otherTableauPile.length - 1];

            // Can card be moved to foundation pile, is it next in order?
            if (isNextInTableauPile(tableauCard, otherTableauTopCard)) {
              moves.push({
                type: 'tableauToTableau',
                from: `tableauPile${i}`,
                to: `tableauPile${k}`,
                isRun: j < tableauPile.length - 1
              })
            }
          }
        }
      }
      // Otherwise pile is empty and there is nothing to move, i.e. do nothing
    }
  }

  console.log(moves);

  // TODO: Sort moves

  function getColor(card) {
    if (card?.suit.short == 'C' || card?.suit.short == 'S') {
      return 'BLACK';
    } else if (card?.suit.short == 'D' || card?.suit.short == 'H') {
      return 'RED';
    } else {
      throw new Error('Card has no color');
    }
  }

  function isColorDifferent(card1, card2) {
    try {
      let color1 = getColor(card1);
      let color2 = getColor(card2);
      return color1 !== color2;
    } catch (error) {
      console.log(error);
    }
  }

  // There should never be a card to be flipped in tableau nor foundation pile...
  // You may check for this anyways

  function nextRankInTableauOrder(card) {
    let next;

    if (!card) {
      next = 13;
    } else {
      next = card?.rank.short - 1;
    }
    return next;
  }

  function isNextInTableauPile(card, tableauCard) {
    if (
      isColorDifferent(card, tableauCard) &&
      card?.rank.short === nextRankInTableauOrder(tableauCard)
    ) {
      return true;
    } else {
      return false;
    }
  }

  function nextRankInFoundationOrder(card) {
    let next;

    if (!card) {
      next = 1;
    } else {
      next = card?.rank.short + 1;
    }
    return next;
  }

  function isNextInFoundationPile(card, foundationCard) {
    if (
      card?.suit.short === foundationCard?.suit.short &&
      card?.rank.short === nextRankInFoundationOrder(foundationCard)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // The End.

  this.disabled = false;
  document.body.classList.remove('loading');
}

const newGameButton = document.getElementById('new-game');

newGameButton.onclick = function () {
  window.localStorage.removeItem('game-history');
}


// ------------------------------------------------
/**
 * Display Detected Solitaire 
 */
// ------------------------------------------------
function displaySolitaire(game) {
  const stockPile = document.getElementById('stock__pile')
  emptyPile(stockPile);
  let stockNode = document.createElement('p')
  if (game.stockPile.length > 0) {
    stockNode.innerText = 'Has cards'
    stockPile.appendChild(stockNode)
  } else {
    stockNode.innerText = 'Is empty'
    stockPile.appendChild(stockNode)
  }

  const wastePile = document.getElementById('waste__pile')
  emptyPile(wastePile)
  if (game.wastePile.length > 0) {
    let card = game.wastePile[game.wastePile.length - 1]
    let wasteNode = getCardImageElement(card)
    wastePile.appendChild(wasteNode)
  }

  for (let i = 0; i < game.foundationPiles.length; i++) {
    const foundationPile = game.foundationPiles[i]
    const pileNode = document.getElementById(`foundation__pile-${i + 1}`)
    emptyPile(pileNode)
    if (foundationPile.length > 0) {
      for (let j = 0; j < foundationPile.length; j++) {
        const foundationCard = foundationPile[j]
        const cardNode = getCardImageElement(foundationCard)
        cardNode.setAttribute('data-row', 2)
        cardNode.setAttribute('data-col', i + 1)
        cardNode.setAttribute('data-suit', foundationCard?.suit.short)
        cardNode.setAttribute('data-rank', foundationCard?.rank.short)
        cardNode.setAttribute('data-order', j)
        cardNode.addEventListener('click', onOpenEditModal)
        pileNode.appendChild(cardNode)
      }
    }
  }

  for (let i = 0; i < game.tableauPiles.length; i++) {
    const tableauPile = game.tableauPiles[i]
    const pileNode = document.getElementById(`tableau__pile-${i + 1}`)
    emptyPile(pileNode)
    if (tableauPile.length > 0) {
      for (let j = 0; j < tableauPile.length; j++) {
        const tableauCard = tableauPile[j]
        const cardNode = getCardImageElement(tableauCard)
        cardNode.setAttribute('data-row', 2)
        cardNode.setAttribute('data-col', i + 1)
        cardNode.setAttribute('data-suit', tableauCard?.suit.short)
        cardNode.setAttribute('data-rank', tableauCard?.rank.short)
        cardNode.setAttribute('data-order', j)
        cardNode.addEventListener('click', onOpenEditModal)
        pileNode.appendChild(cardNode)
      }
    }
  }
}
// ------------------------------------------------

function emptyPile(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function getCardImageElement(card) {
  let imgNode = document.createElement('img');
  imgNode.setAttribute('src', `assets/img/cards/200px-Playing_card_${card.suit.image}_${card.rank.image}.svg.png`)
  imgNode.setAttribute('alt', `${card.rank.long} of ${card.suit.long}`)
  return imgNode;
}

function saveGame(exportObj, exportName) {
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function altPrintSolitaire(game) {
  console.log("Game:")
  console.log(`${game.foundationPiles[3][game.foundationPiles[3].length - 1]?.rank.short ?? '#'}\t|\t${game.tableauPiles[6].map((card) => { return card.rank.short; }).join('\t')}`)
  console.log(`${game.foundationPiles[2][game.foundationPiles[2].length - 1]?.rank.short ?? '#'}\t|\t${game.tableauPiles[5].map((card) => { return card.rank.short; }).join('\t')}`)
  console.log(`${game.foundationPiles[1][game.foundationPiles[1].length - 1]?.rank.short ?? '#'}\t|\t${game.tableauPiles[4].map((card) => { return card.rank.short; }).join('\t')}`)
  console.log(`${game.foundationPiles[0][game.foundationPiles[0].length - 1]?.rank.short ?? '#'}\t|\t${game.tableauPiles[3].map((card) => { return card.rank.short; }).join('\t')}`)
  console.log(`\t|\t${game.tableauPiles[2].map((card) => { return card.rank.short; }).join('\t')}`);
  console.log(`${game.wastePile[game.wastePile.length - 1]?.rank.short ?? '#'}\t|\t${game.tableauPiles[1].map((card) => { return card.rank.short; }).join('\t')}`)
  console.log(`${game.stockPile.length}\t|\t${game.tableauPiles[0].map((card) => { return card.rank.short; }).join('\t')}`)
}

function printSolitaire(game) {
  console.log("Game:");
  console.log(`${game.foundationPiles[3][game.foundationPiles[3].length - 1]?.shortName() ?? '#'}\t|\t${game.tableauPiles[6].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`${game.foundationPiles[2][game.foundationPiles[2].length - 1]?.shortName() ?? '#'}\t|\t${game.tableauPiles[5].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`${game.foundationPiles[1][game.foundationPiles[1].length - 1]?.shortName() ?? '#'}\t|\t${game.tableauPiles[4].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`${game.foundationPiles[0][game.foundationPiles[0].length - 1]?.shortName() ?? '#'}\t|\t${game.tableauPiles[3].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`\t|\t${game.tableauPiles[2].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`${game.wastePile[game.wastePile.length - 1]?.shortName() ?? '#'}\t|\t${game.tableauPiles[1].map((card) => { return card.shortName(); }).join('\t')}`);
  console.log(`${game.stockPile.length}\t|\t${game.tableauPiles[0].map((card) => { return card.shortName(); }).join('\t')}`);
}

// TODO
// export functions to logical files
// make sure variables and functions are globally available
// run functions within single file to form the app

// clean up