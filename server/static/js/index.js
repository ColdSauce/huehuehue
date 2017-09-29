const video = document.querySelector('#webcam')
const canvas = document.querySelector('#canvas')
const avgDisplay = document.querySelector('#avg')
const ctx = canvas.getContext('2d')

let prevColor = chroma('#000')
let curColor = chroma('#000')

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

const FREQUENCY = 4000

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
  
  const color = chroma(red, green, blue)
  
  const hsl = color.saturate().hsl()
  const adjustedColor = chroma.hsl(hsl[0], hsl[1], 0.5)

  // update colors
  if (curColor) prevColor = chroma.rgb(curColor.rgb())
  curColor = chroma.rgb(adjustedColor.rgb())

  const rgb = adjustedColor.rgb()
  // display
  avgDisplay.style.background = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`

  const dist = chroma.distance(curColor, prevColor)
  console.log(dist, curColor, prevColor)
  if (dist > 0) sendToHue(curColor)

}, FREQUENCY)

function convertHSL(hsl) {
  // convert to hue endpoint standard: 0 ~ 65535, integer
  return hsl.map(function(num) {
    if (num === NaN) num = 0
    return Math.floor(num / 360 * 65535)
  })
}

// function sendToHue(color) {
//   const hsl = color.hsl()
//   const convertedHSL = convertHSL(hsl)
//   // contact hue
//   // GET wth param h, s, l
//   fetch(`/changeColor?h=${convertedHSL[0]}&s=255&l=255`).then(function(res) {
//     console.log('success!', res)
//   }).catch(function(err) {
//     console.log(err)
//   })
// }

function sendToHue(color) {
  console.log(color)
  const rgb = color.rgb()

  const xy = toXY(rgb[0], rgb[1], rgb[2])

  // contact hue
  fetch(`/changeColorXY?x=${xy[0]}&y=${xy[1]}&l=125`).then(function(res) {
    console.log('success!', res)
  }).catch(function(err) {
    console.log(err)
  })
}

function toXY(red,green,blue){
  //Gamma correctie
  red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
  green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
  blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);
  
  //Apply wide gamut conversion D65
  var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;
  
  var fx = X / (X + Y + Z);
  var fy = Y / (X + Y + Z);
  if (Number.isNaN(fx)) {
      fx = 0.0;
  }
  if (Number.isNaN(fy)) {
      fy = 0.0;
  }
  
  return [fx.toPrecision(4),fy.toPrecision(4)];
}

