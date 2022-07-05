// Global Vars
let width = 500,
    height = 0,
    filter = 'none',
    streaming = false;

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const cameraOptions = document.querySelector('.video-options>select');
const photoFilter = document.getElementById('photo-filter');

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraOptions.innerHTML = options.join('');
};

const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};


// Get media stream
const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  video.play();
  //play.classList.add('d-none');
  //pause.classList.remove('d-none');
  //screenshot.classList.remove('d-none');
  //streamStarted = true;
};

cameraOptions.onchange = () => {
  const updatedConstraints = {
    ...constraints,
    deviceId: {
      exact: cameraOptions.value
    }
  };
  startStream(updatedConstraints);
};

startStream(constraints);

/* navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }, audio: false})
  .then(function(stream) {
    // Link to the video source
    video.srcObject = stream;
    // Play video
    video.play();
  })
  .catch(function(err) {
    console.log(`Error: ${err}`);
  });
 */
  // Play when ready
  video.addEventListener('canplay', function(e) {
    if(!streaming) {
      // Set video / canvas height
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      streaming = true;
    }
  }, false);

  // Photo button event
  photoButton.addEventListener('click', function(e) {
    takePicture();

    e.preventDefault();
  }, false);

  // Filter event
  photoFilter.addEventListener('change', function(e) {
    // Set filter to chosen option
    filter = e.target.value;
    // Set filter to video
    video.style.filter = filter;

    e.preventDefault(); 
  });

  // Clear event
  clearButton.addEventListener('click', function(e) {
    // Clear photos
    photos.innerHTML = '';
    // Change filter back to none
    filter = 'none';
    // Set video filter
    video.style.filter = filter;
    // Reset select list
    photoFilter.selectedIndex = 0;
  });

  // Take picture from canvas
  function takePicture() {
    // Create canvas
    const context = canvas.getContext('2d');
    if(width && height) {
      // set canvas props
      canvas.width = width;
      canvas.height = height;
      // Draw an image of the video on the canvas
      context.drawImage(video, 0, 0, width, height);

      // Create image from the canvas
      const imgUrl = canvas.toDataURL('image/png');

      // Create img element
      const img = document.createElement('img');

      // Set img src
      img.setAttribute('src', imgUrl);

      // Set image filter
      img.style.filter = filter;

      // Add image to photos
      photos.appendChild(img);
    }
  }

  getCameraSelection();