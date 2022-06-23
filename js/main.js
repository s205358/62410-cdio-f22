let imageThreshold = 255 - 80;
let matchThreshold = 600;

// The various HTML elements we need to configure or control.
// These will be set by the startup() function.
let root = null
let video = null
let image = null
let canvas = null
let capture = null
let upload = null
let reset = null
let undo = null

/**
 * Bootstraps app
 * 
 * @author Tobias
 * @email s205358@student.dtu.dk
 */
function startup() {
  console.log('Startup: OpenCV and DOM have been loaded')

  if (showViewLiveResultButton()) {
    return
  }

  root = document.getElementById('root')
  root.hidden = false
  video = document.getElementById('video')
  image = document.getElementById('image')
  canvas = document.getElementById('canvas')
  capture = document.getElementById('capture')
  upload = document.getElementById('upload')
  reset = document.getElementById('reset')
  undo = document.getElementById('undo')

  setupRealTimeCamera()

  cv['onRuntimeInitialized'] = function () {
    loadComparisonImages()
  }

  let previousGame = loadLastGame()

  if (previousGame) {
    const moves = solve(previousGame)
    display(previousGame, moves)
  }

  upload.onchange = function () {
    image.src = URL.createObjectURL(event.target.files[0]);
  };

  image.onload = function () {
    let img = cv.imread(image);
    cv.imshow('canvas', img);
    img.delete();

    console.log('Has changed')

    // Solve game
    const game = init()

    const moves = solve(game)
    
    display(game, moves)

    saveGame(game)
  };

  undo.onclick = function (event) {
    undoLastMove()

    let previousGame = loadLastGame()

    if (previousGame) {
      const moves = solve(previousGame)
      display(previousGame, moves)
    }
  }

  reset.onclick = function () {
    resetGame()
  }
}

// Set up our event listener to run the startup process once loading is complete.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
window.addEventListener('load', startup, false)