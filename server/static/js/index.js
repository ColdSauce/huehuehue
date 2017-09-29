const video = document.querySelector('#webcam')
const canvas = document.querySelector('#canvas')
const avgDisplay = document.querySelector('#avg')
const ctx = canvas.getContext('2d')

navigator.mediaDevices.getUserMedia({
  video: {
    width: 720,
    height: 480
  },
}).then(function(mediaStream) {
  video.srcObject = mediaStream
  video.onloadedmetadata = function(e) {
    video.play()
  }
}).catch(function(err) {
  console.log(err)
})

const FREQUENCY = 2000

const BLOCK_SIZE = 5 // only visit every 5 pixels

setInterval(function() {
  // get image and avg every {FREQUENCY} ms
  ctx.drawImage(video, 0, 0, 720, 480)
  let frame;
  try {
    frame = ctx.getImageData(0, 0, 720, 480)
  } catch(e) {
    console.log(e)
    return 
  }
  const length = frame.data.length;
  let i = -4
  let count = 0
  let red = 0
  let green = 0
  let blue = 0
  while ( (i += BLOCK_SIZE * 4) < length ) {
    ++count
    red += frame.data[i];
    green += frame.data[i+1];
    blue += frame.data[i+2];
  }
  red = ~~(red/count);
  green = ~~(green/count);
  blue = ~~(blue/count);
  // display
  avgDisplay.style.background = `rgb(${red}, ${green}, ${blue})`

  const color = chroma(red, green, blue)
  const hsl = color.hsl()
  const convertedHSL = convertHSL(hsl)
  // contact hue
  // GET wth param h, s, l
  fetch(`/changeColor?h=${convertedHSL[0]}&s=${convertedHSL[1]}&l=${convertedHSL[2]}`).then(function(res) {
    console.log('success!', res)
  }).catch(function(err) {
    console.log(err)
  })
}, FREQUENCY)

function convertHSL(hsl) {
  // convert to hue endpoint standard: 0 ~ 65535, integer
  return hsl.map(function(num) {
    if (num === NaN) num = 0
    return Math.floor(num / 255 * 65535)
  })
}