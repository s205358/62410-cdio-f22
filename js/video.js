/**
 * Setsups video feed in app
 * @link https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
 * 
 * @author Aqib
 * @email s205342@student.dtu.dk
 */

let width = 3840; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.
let streaming = false;

function showViewLiveResultButton() {
  if (window.self !== window.top) {
    // Ensure that if our document is in a frame, we get the user to first open it in its own tab or window. 
    // Otherwise, it won't be able to request permission for camera access.
    root.remove();
    const button = document.createElement("button")
    button.textContent = "View live result of the example code above"
    document.body.append(button)
    button.addEventListener('click', () => window.open(location.href))
    return true
  }
  return false
}

function setupRealTimeCamera() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      video.srcObject = stream
      video.play()
    })
    .catch(function (err) {
      console.log("An error occurred: " + err)
    })

  video.addEventListener('canplay', function (event) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4 / 3)
      }

      video.setAttribute('width', width)
      video.setAttribute('height', height)
      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      streaming = true
    }
  }, false)

  capture.addEventListener('click', function(event){
    capturePhoto();
    event.preventDefault();
  }, false);

  // clearPhoto();
}

function clearPhoto() {
  let context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let data = canvas.toDataURL('image/png');
  image.setAttribute('src', data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function capturePhoto() {
  let context = canvas.getContext('2d');
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png');
    image.setAttribute('src', data);
  } else {
    clearPhoto();
  }
}