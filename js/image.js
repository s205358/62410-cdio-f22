/**
 * Processes an image
 * 
 * @link https://docs.opencv.org/3.4/dd/d6a/tutorial_js_filtering.html
 * @link https://docs.opencv.org/3.4/d7/dd0/tutorial_js_thresholding.html
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} image 
 * @returns 
 */
function processImage(image) {
  let gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);

  let blur = new cv.Mat();
  let kSize = new cv.Size(5, 5);
  cv.GaussianBlur(gray, blur, kSize, 0, 0);

  let thresh = new cv.Mat();
  cv.threshold(blur, thresh, imageThreshold, 255, cv.THRESH_BINARY);

  return thresh
}

/**
 * Find objects in an image
 * 
 * @link https://docs.opencv.org/3.4/d5/daa/tutorial_js_contours_begin.html
 * @link https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
 * @link https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} image 
 * @returns objects
 */
function detectObjects(image) {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(image, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  const objects = [];
  for (let i = 0; i < contours.size(); i++) {
    let cnt = contours.get(i);
    objects.push(cnt)
  }

  return objects
}

/**
 * Find cards in an image
 * 
 * @link https://docs.opencv.org/3.4/d5/daa/tutorial_js_contours_begin.html
 * @link https://docs.opencv.org/3.4/dc/dcf/tutorial_js_contour_features.html
 * @link https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} image 
 * @returns cards
 */
function detectCardObjects(image) {
  let objects = detectObjects(image)

  let cards = []
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];

    let dst = new cv.Mat();

    let area = cv.contourArea(object);
    let perimeter = cv.arcLength(object, true);
    let epsilon = 0.03 * perimeter;
    cv.approxPolyDP(object, dst, epsilon, true);

    if (!(area > 20000)) {
      continue;
    }

    cards.push(dst)
  }

  return cards
}

/**
 * Grabs objects from an image
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} objects,
 * @param {*} image 
 * @returns grabbed objects
 */
function grabObjectsFromImage(objects, image) {
  let grabbedObjects = []

  // Get corner points of polygon (is rect)
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];

    let pts = object.data32S
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

    // No cards are laying down by definition, i.e. we don not need to check for this, e.g. if aspect ratio < 1.2 standing up else laying down
    let pts1 = [
      topLeft[0], topLeft[1],
      topRight[0], topRight[1],
      bottomLeft[0], bottomLeft[1],
      bottomRight[0], bottomRight[1]
    ];

    let pts2 = [
      0, 0,
      maxWidth, 0,
      0, maxHeight,
      maxWidth, maxHeight
    ];

    let dst = new cv.Mat();
    let dsize = new cv.Size(maxWidth, maxHeight);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, pts1);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, pts2);
    let M = cv.getPerspectiveTransform(srcTri, dstTri);

    cv.warpPerspective(image, dst, M, dsize);

    grabbedObjects.push({
      image: dst,
      size: {
        width: maxWidth,
        height: maxHeight,
        aspectRatio: visibleAspectRatio,
      },
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
    })
  }

  return grabbedObjects
}

/**
 * Detects card symbols
 * 
 * @author Tobias; Jens
 * @email s205358@student.dtu.dk; s205343@student.dtu.dk
 * 
 * @param {*} cardObj,
 * @returns symbol images
 */
function detectCardSymbols(cardObj) {
  // https://docs.opencv.org/3.4/de/d06/tutorial_js_basic_ops.html
  // "Sometimes, you will have to play with certain region of images. For eye detection in images, first face detection is done all over the image and when face is obtained, we select the face region alone and search for eyes inside it instead of searching whole image. It improves accuracy (because eyes are always on faces) and performance (because we search for a small area)"
  let bottomRightCorner = new cv.Mat();

  // You can try more different parameters
  // https://docs.opencv.org/4.x/d5/df1/tutorial_js_some_data_structures.html
  let rect = new cv.Rect(
    cardObj.size.width - Math.ceil(cardObj.size.width * 0.175),
    cardObj.size.height - Math.ceil(cardObj.size.width * 1.545 * 0.250),
    Math.ceil(cardObj.size.width * 0.175),
    Math.ceil(cardObj.size.width * 1.545 * 0.250)
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

  bottomRightCorner = cardObj.image.roi(rect);

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
    return null;
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

  let suitImage, rankImage;
  if (rect1.y < rect2.y) {
    rankImage = s1
    suitImage = s2
  } else {
    rankImage = s2
    suitImage = s1
  }

  return {
    suitImage,
    rankImage
  }
}

/**
 * Find best match
 * 
 * @author Tobias; Jens; Kim
 * @email s205358@student.dtu.dk; s205343@student.dtu.dk; s205341@student.dtu.dk
 * 
 * @param {*} image 
 * @param {*} comparisonImages
 * @param {*} threshold
 * @returns best match
 */
function findClosestMatch(image, comparisonImages, threshold = 600) {
  // Find closest match for rank
  let imageScaled = new cv.Mat();
  let imageScaledGray = new cv.Mat();
  let imageSize = new cv.Size(50, 50);
  cv.resize(image, imageScaled, imageSize)
  cv.cvtColor(imageScaled, imageScaledGray, cv.COLOR_RGBA2GRAY)
  let bestImageDiff = Math.pow(100, 10);
  let bestImageIndex = 0;

  for (let i = 0; i < comparisonImages.length; i++) {
    const comparisonImage = comparisonImages[i];
    let imageDiff = new cv.Mat();
    cv.absdiff(imageScaledGray, comparisonImage, imageDiff);

    // It's possible to check for black or red to reduce search area first on suit.

    let imageDiffSum = Math.ceil(imageDiff.data.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0) / 255);

    if (i == 0) {
      bestImageDiff = imageDiffSum;
    }

    if (imageDiffSum < bestImageDiff) {
      bestImageIndex = i;
      bestImageDiff = imageDiffSum;
    }
  }

  // No rank match if best match exceeds threshold
  if (bestImageDiff > threshold) {
    bestImageIndex = -1
  }

  return bestImageIndex;
}

/**
 * Get card value
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} cardObj 
 * @returns rank, suit and whether or not it's upside down
 */
function getCardValue(cardObj) {
  let { rankImage, suitImage } = detectCardSymbols(cardObj)
  let rank = rankLabels[findClosestMatch(rankImage, rankImages)] ?? null
  let suit = suitLabels[findClosestMatch(suitImage, suitImages)] ?? null
  return {
    rank,
    suit,
    backsideUp: typeof rank === undefined || typeof suit === undefined
  }
}

/**
 * Appends card values to card objects
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 * 
 * @param {*} cardObjects 
 * @returns card objects with values
 */
function appendCardValues(cardObjects) {
  return cardObjects.map((cardObj) => {
    return {
      ...cardObj,
      ...getCardValue(cardObj)
    }
  })
}