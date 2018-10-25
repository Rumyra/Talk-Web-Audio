navigator.serviceWorker.getRegistrations().then(function(registrations) {
 for(let registration of registrations) {
  registration.unregister()
} });

// initialise Reveal
Reveal.initialize({

  // The "normal" size of the presentation, aspect ratio will be preserved
  // when the presentation is scaled to fit different resolutions. Can be
  // specified using percentage units.
  width: 1024,
  height: 768,

  // Factor of the display size that should remain empty around the content
  margin: 0.1,

  // Bounds for smallest/largest possible scale to apply to content
  minScale: 0.2,
  maxScale: 1.5,

  center: false,

  // Display controls in the bottom right corner
  controls: false,

  // Display a presentation progress bar
  progress: false,

  // Display the page number of the current slide
  slideNumber: false,

  // Push each slide change to the browser history
  history: true,

  // Enable keyboard shortcuts for navigation
  keyboard: {
    25: 'next' // go to the next slide when the DOWN key is pressed
  },

  // Transition style
  transition: 'fade', // none/fade/slide/convex/concave/zoom

  // Transition speed
  transitionSpeed: 'default', // default/fast/slow

  // Transition style for full page slide backgrounds
  backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom

  // Number of slides away from the current that are visible
  viewDistance: 2,

  // Parallax background image
  parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

  // Parallax background size
  parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

  // Amount to move parallax background (horizontal and vertical) on slide change
  // Number, e.g. 100
  parallaxBackgroundHorizontal: '',
  parallaxBackgroundVertical: ''

});

// sine wave graph ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// all
const svgDom = document.querySelector('#wave-graph'),
  svgDomDi = {
    width: Math.floor(svgDom.getBoundingClientRect().width),
    height: Math.floor(svgDom.getBoundingClientRect().height)
  };
var line,
  samples = Math.PI * 3,
  graphMargin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 40
  },
  xScale = d3.scale.linear().domain([0, samples - 1]).range([0, svgDomDi.width-50]),
  yScale = d3.scale.linear().domain([-1, 1]).range([svgDomDi.height-50, 0]),
  xAxis = d3.svg.axis().scale(xScale).ticks(10).orient('bottom'),
  yAxis = d3.svg.axis().scale(yScale).ticks(5).orient('left');

// lineOne
function generateSineDataOne(samples){
  return d3.range(0, 100).map(function(i){
    return Math.sin(i*2)*1.9;
  });
}
var sinPathOne,
  dataOne = generateSineDataOne(samples);

// lineTwo

// lineThree

// lineFour


var svg = d3.select('#wave-graph')
  .append('g').attr('transform', "translate(" + graphMargin.left + ", " + graphMargin.top + ")");
// svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", w).attr("height", h);
svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + (svgDomDi.height-40) + ")").call(xAxis).append('text').text('time (ms)').attr('transform','translate('+(svgDomDi.width-100)+',-10)');
svg.append('g').attr('class', 'y axis').call(yAxis).append('text').text('amp').attr('transform','translate(20,50)rotate(-90)');

line = d3.svg.line().x(function(d, i){
  return xScale(i);
}).y(function(d, i){
  return yScale(d);
}).interpolate('basis');

// g = svg.append('g').attr('clip-path', 'url(#clip)');
var gOne = svg.append('g');
sinPathOne = gOne.append('path')
  .attr('class', 'sinPathOne')
  .data([dataOne]).attr('d', line)
  .style('fill', 'none')
  .style('stroke', 'white')
  .style('stroke-width', '2px');




// audio stuff ~~~~~~~~~~~~~~~~~~~~~~~~~

const context = new window.AudioContext;
const playArpsButton = document.querySelector('button[data-sound="play-arps"]'),
  arpsButton = document.querySelector('button[data-sound="arps"]');

Reveal.addEventListener('play-sin', function(ev) {

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'd') {

      const sin = context.createOscillator();
      sin.frequency.value = 440;

      sin.connect(context.destination);
      sin.start(context.currentTime);
      sin.stop(context.currentTime+1);
    }

  });
});

// play arps
Reveal.addEventListener( 'play-arps', function(ev) {

  fetch('media/100_C_G_Arps_SP_01.wav')
    // read into memory as array buffer
    .then(response => response.arrayBuffer())
    // turn into raw audio data
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      window.addEventListener("keydown", function(evt) {

        const arpsSource = context.createBufferSource();
        arpsSource.buffer = audioBuffer;
        arpsSource.connect(context.destination);

        if (evt.key === 'q') {
          arpsSource.start();
          playArpsButton.classList.add('on');
          arpsSource.onended = function() {
            playArpsButton.classList.remove('on');
          }
        }

      });
    })
});
// remove on class if I forget
Reveal.addEventListener( 'stop-arps', function(ev) {
  playArpsButton.classList.remove('on');
});

// arps play & pause
Reveal.addEventListener( 'mute-arps', function(ev) {
  fetch('media/100_C_G_Arps_SP_01.wav')
    // read into memory as array buffer
    .then(response => response.arrayBuffer())
    // turn into raw audio data
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {

      const arpsSource = context.createBufferSource();
      const arpsGain = context.createGain();
      arpsSource.buffer = audioBuffer;

      window.addEventListener("keydown", function(evt) {

        if (evt.key === 'w') {

          if (arpsButton.dataset.mute === "true") {
            arpsGain.gain.value = 1;
            arpsButton.dataset.mute = "false";
            arpsButton.classList.add('on');
          } else if (arpsButton.dataset.mute === "false") {
            arpsGain.gain.value = 0;
            arpsButton.dataset.mute = "true";
            arpsButton.classList.remove('on');
          } else {
            arpsSource.connect(arpsGain).connect(context.destination);
            arpsSource.start();
            arpsSource.loop = true;
            arpsButton.dataset.mute = "false";
            arpsButton.classList.add('on');
          }

        }

      });
    })
});

Reveal.addEventListener( 'space', function(ev) {
  const space = document.querySelector('#space'),
    spaceSource = document.querySelector('span[data-object="source"]'),
    spaceListener = document.querySelector('span[data-object="listener"]');

  const soundSource = context.createPanner();
  const listener = context.listener;
  listener.setPosition(0, 0, 5);
  soundSource.setPosition(0, 0, 5);

  var startPosX, startPosY;

  fetch('media/100_C_G_Arps_SP_01.wav')
  // read into memory as array buffer
  .then(response => response.arrayBuffer())
  // turn into raw audio data
  .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    const music = context.createBufferSource();
    music.buffer = audioBuffer;
    music.loop = true;
    music.connect(soundSource).connect(context.destination);
    // click & move person
    space.addEventListener("mousedown", function(evt) {
      music.start();
      startPosX = evt.clientX;
      startPosY = evt.clientY;

      this.addEventListener("mousemove", function(evt) {
        soundSource.setPosition((evt.clientX-startPosX)/10, (evt.clientY-startPosY)/10, (evt.clientY-startPosY)/10);
        spaceSource.style.transform = 'translate('+(evt.clientX-startPosX)+'px, '+(evt.clientY-startPosY)+'px)';

        this.addEventListener("mouseup", function(evt) {
          music.stop();
        })
      })
    })

  })

});

Reveal.addEventListener('osc', function(ev) {
  // const oscButton = document.querySelector('button[data-sound="osc"]');

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'e') {
      // oscButton.classList.add('on');

      const osc = context.createOscillator();
      osc.frequency.value = 440;
      osc.type = 'triangle';

      osc.connect(context.destination);
      osc.start(context.currentTime);
      osc.stop(context.currentTime+1);
      // osc.onended = function() {
      //   oscButton.classList.remove('on');
      // }
    }

  });


});

Reveal.addEventListener( 'laser', function(ev) {

  const laserButton = document.querySelector('button[data-sound="laser"]');

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 't') {
      laserButton.classList.add('on');
      const laser = context.createOscillator();
      laser.frequency.value = 523.251;
      laser.type = 'triangle';
      laser.frequency.exponentialRampToValueAtTime(10, context.currentTime+1);

      const laserGain = context.createGain();
      // set gain value to 1 'now'
      laserGain.gain.setValueAtTime(1, context.currentTime)
      // decease suddenly but smoothly
      laserGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime+0.9);
      laser.connect(laserGain).connect(context.destination);
      laser.start(context.currentTime);
      laser.stop(context.currentTime+1);
      laser.onended = function() {
        laserButton.classList.remove('on');
      }
    }
  });

});

Reveal.addEventListener('white', function(ev) {

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'g') {

      const whiteBufferSize = context.sampleRate;
      // pass in channels, frame count, sample rate
      const whiteBuffer = context.createBuffer(1, whiteBufferSize, context.sampleRate);
      const white = context.createBufferSource();

      // create some data for the buffer
      var whiteData = whiteBuffer.getChannelData(0);

      for (let i=0; i<whiteBufferSize; i++) {
        whiteData[i] = Math.random()*2 - 1;
      }

      white.buffer = whiteBuffer;

      white.connect(context.destination);
      white.start(context.currentTime);
      white.stop(context.currentTime+0.5);
    }
  });
});

Reveal.addEventListener('pink', function(ev) {

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'h') {

      const pinkBufferSize = context.sampleRate;
      // pass in channels, frame count, sample rate
      const pinkBuffer = context.createBuffer(1, pinkBufferSize, context.sampleRate);
      const pink = context.createBufferSource();

      // create some data for the buffer
      var pinkData = pinkBuffer.getChannelData(0);

      for (let i=0; i<pinkBufferSize; i++) {
        pinkData[i] = Math.random()*2 - 1;
      }

      pink.buffer = pinkBuffer;

      // create a filter
      const pinkFilter = context.createBiquadFilter();
      pinkFilter.type = "bandpass";
      pinkFilter.frequency = 15000;
      pinkFilter.Q = 0.0001;


      pink.connect(pinkFilter).connect(context.destination);
      pink.start(context.currentTime);
      pink.stop(context.currentTime+0.5);
    }
  });
});

Reveal.addEventListener( 'snare', function(ev) {
  const snareButton = document.querySelector('button[data-sound="snare"]');

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'y') {
      snareButton.classList.add('on');

      const snareBufferSize = context.sampleRate;
      // pass in channels, frame count, sample rate
      const snareBuffer = context.createBuffer(1, snareBufferSize, context.sampleRate);
      const snare = context.createBufferSource();

      // create some data for the buffer
      var snareData = snareBuffer.getChannelData(0);

      for (let i=0; i<snareBufferSize; i++) {
        snareData[i] = Math.random()*2 - 1;
      }

      snare.buffer = snareBuffer;

      // create a filter
      const snareFilter = context.createBiquadFilter();
      snareFilter.type = "bandpass";
      snareFilter.frequency = 15000;
      snareFilter.Q = 0.0001;

      // create gain
      const snareGain = context.createGain();
      snareGain.gain.setValueAtTime(3,context.currentTime);
      snareGain.gain.exponentialRampToValueAtTime(0.01, context.currentTime+0.3);

      snare.connect(snareFilter).connect(snareGain).connect(context.destination);
      snare.start(context.currentTime);
      snare.stop(context.currentTime+0.5);
      snare.onended = function() {
        snareButton.classList.remove('on');
      }
    }
  });
});

Reveal.addEventListener( 'hi-hat', function(ev) {
  const hhButton = document.querySelector('button[data-sound="hh"');

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'u') {
      hhButton.classList.add('on');

      // hi hat
    fetch('media/808CHH.wav')
      // read into memory as array buffer
      .then(response => response.arrayBuffer())
      // turn into raw audio data
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {

        var startTime = context.currentTime + 0.100;
        var tempo = 100; // BPM (beats per minute)
        var eighthNoteTime = (60 / tempo) / 2;

        // Play 2 bars of the following:
        for (var bar = 0; bar < 2; bar++) {
          var time = startTime + bar * 8 * eighthNoteTime;

          // Play the hi-hat every eighthh note.
          for (var i = 0; i < 8; ++i) {
            playHh(audioBuffer, time + i * eighthNoteTime);
          }
        }

      });
    }
  });
});

function playHh(buffer, time) {
  const hh = context.createBufferSource();
  hh.buffer = buffer;
  hh.connect(context.destination);
  hh.start(time);
  hh.stop(time+0.6);
}

function playSnare(time) {
  const snareBufferSize = context.sampleRate;
  // pass in channels, frame count, sample rate
  const snareBuffer = context.createBuffer(1, snareBufferSize, context.sampleRate);
  const snare = context.createBufferSource();

  // create some data for the buffer
  var snareData = snareBuffer.getChannelData(0);

  for (let i=0; i<snareBufferSize; i++) {
    snareData[i] = Math.random()*2 - 1;
  }

  snare.buffer = snareBuffer;

  // create a filter
  const snareFilter = context.createBiquadFilter();
  snareFilter.type = "bandpass";
  snareFilter.frequency = 10000;
  snareFilter.Q = 0.0001;

  // create gain
  const snareGain = context.createGain();
  snareGain.gain.setValueAtTime(1.5,time);
  snareGain.gain.exponentialRampToValueAtTime(0.01, time+0.2);

  snare.connect(snareFilter).connect(snareGain).connect(context.destination);
  snare.start(time);
  snare.stop(time+0.3);
}

function playKick() {
  const kick = context.createOscillator();
  kick.frequency = 150;
  kick.frequency.setValueAtTime(150, context.currentTime);
  kick.frequency.exponentialRampToValueAtTime(0.01, context.currentTime+0.5);

  kickGain = context.createGain();
  kickGain.gain.setValueAtTime(2,context.currentTime);
  kickGain.gain.exponentialRampToValueAtTime(0.01,context.currentTime+0.4);

  kick.connect(kickGain).connect(context.destination);
  kick.start(context.currentTime);
  kick.stop(context.currentTime+0.5);
}

function playLaser() {
  const laser = context.createOscillator();
  laser.frequency.value = 523.251;
  laser.type = 'triangle';
  laser.frequency.exponentialRampToValueAtTime(10, context.currentTime+1);

  const laserGain = context.createGain();
  // set gain value to 1 'now'
  laserGain.gain.setValueAtTime(1, context.currentTime)
  // decease suddenly but smoothly
  laserGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime+0.9);
  laser.connect(laserGain).connect(context.destination);
  laser.start(context.currentTime);
  laser.stop(context.currentTime+1);
}

// midi stuff ~~~~~~~~~~~~~~~~~~~~~~
var midi, data = [0,0,0], threshold;
// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, function() {console.log('failed')});
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
  // when we get a succesful response, run this code
  midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status

  var inputs = midi.inputs.values();
  // loop over all available inputs and listen for any MIDI input
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      // each time there is a midi message call the onMIDIMessage function
      input.value.onmidimessage = onMIDIMessage;
  }
}

const arpsSource = context.createBufferSource();
const arpsGain = context.createGain();

const mArpsBut = document.querySelector('button[data-sound="m-arps"]'),
  mLaserBut = document.querySelector('button[data-sound="m-laser"]'),
  mKickBut = document.querySelector('button[data-sound="m-kick"]'),
  mSnareBut = document.querySelector('button[data-sound="m-snare"]'),
  mHhBut = document.querySelector('button[data-sound="m-hh"]');

function onMIDIMessage(message) {
  data = message.data; // this gives us our [command/channel, note, velocity] data.
  console.log(data);

  // fetch arps
  if ( (data[0]===176) && (data[1]===104) && (data[2]===127) ) {

    fetch('media/100_C_G_Arps_SP_01.wav')
    // read into memory as array buffer
    .then(response => response.arrayBuffer())
    // turn into raw audio data
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      console.log('fetch arps');
      arpsSource.buffer = audioBuffer;
      arpsGain.gain.value = 1;
      arpsSource.connect(arpsGain).connect(context.destination);
      // arpsSource.start();
      arpsSource.loop = true;

    })

  }

  if ( (data[0]===144) && (data[1]===0) && (data[2]===127) ) {
    arpsSource.start();
  }

  if ( (data[0] === 144) && (data[2] === 0) ) {

    switch (data[1]) {
      case 0:
        arpsSource.stop();
        mArpsBut.classList.remove('on');
      break;
      // kick
      case 1:
        console.log('kick');
        playKick();
        mKickBut.classList.add('on');
      break;
      // laser
      case 2:
        console.log('laser');
        playLaser();
        mLaserBut.classList.add('on');
      break;
      // arps
      case 3:
        console.log('play arps');
        arpsGain.gain.value = 0;
        mArpsBut.classList.remove('on');
      break;
      // drums
      case 4:
        mHhBut.classList.add('on');
        mSnareBut.classList.add('on');

      fetch('media/808CHH.wav')
      // read into memory as array buffer
      .then(response => response.arrayBuffer())
      // turn into raw audio data
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        var startTime = context.currentTime + 0.100;
        var tempo = 100; // BPM (beats per minute)
        var eighthNoteTime = (60 / tempo) / 2;

        // Play 2 bars of the following:
        for (var bar = 0; bar < 8; bar++) {
          var time = startTime + bar * 8 * eighthNoteTime;

          // Play the snare drum on beats 3, 7
          playSnare(time + 0 * eighthNoteTime);
          playSnare(time + 3 * eighthNoteTime);
          playSnare(time + 6 * eighthNoteTime);

          playHh(audioBuffer, time + 1.75 * eighthNoteTime);

          // Play the hi-hat every eighthh note.
          for (var i = 0; i < 8; ++i) {
            playHh(audioBuffer, time + i * eighthNoteTime);
          }
        }
      });
      break;

    }
  }

  if ( (data[0] === 144) && (data[2] === 0) ) {

    switch (data[1]) {
      // kick
      case 1:
        mKickBut.classList.remove('on');
      break;
      // laser
      case 2:
        mLaserBut.classList.remove('on');
      break;
      // arps
      case 3:
        arpsGain.gain.value = 1;
        mArpsBut.classList.add('on');
      break;
      // drums
      case 4:
      break;

    }
  }

  if ( (data[0]===144) && (data[1]===119) && (data[2]===127) ) {
    canvas.style.filter = 'invert(100%)';
  }
  if ( (data[0]===144) && (data[1]===119) && (data[2]===0) ) {
    canvas.style.filter = 'invert(0%)';
  }


  // if ( (data[0]===144) && (data[1]===5) && (data[2]===64) ) {
  //   console.log('mute arps');
  //   arpsGain.gain.value = 1;
  // }

}

Reveal.addEventListener('midi', function(ev) {
  console.log(data);

});

// variables
var analyserNode,
    frequencyData = new Uint8Array(124),
    animateDom = function() {};

const screenVals = {
  width: window.innerWidth,
  height: window.innerHeight,
  maxRadius: (window.innerHeight-(window.innerWidth/6))/2,
  minRadius: (window.innerHeight/10)/2
};

let currentAnimation = 'vis_speakers',
  allEls,
  totalEls,
  screen = document.getElementById('screen'),
  useMic = false;

// create an audio API analyser node and connect to source
function createAnalyserNode(audioSource) {
  analyserNode = context.createAnalyser();
  analyserNode.fftSize = 256;
  audioSource.connect(analyserNode);
}

// getUserMedia success callback -> pipe audio stream into audio API
var gotStream = function(stream) {
  // Create an audio input from the stream.
  var audioSource = context.createMediaStreamSource(stream);
  createAnalyserNode(audioSource);
  animate();
  console.log('got stream')
}

// pipe in analysing to getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(gotStream);


function drawHex(ctx, sideLength, startX, startY) {

  // maths mother fucker
  const moveX = Math.sin(Math.radians(30))*sideLength;
  const moveY = Math.cos(Math.radians(30))*sideLength;

  // I actually want the origin to be in the centre
  var startX = startX-(sideLength/2);
  var startY = startY-moveY;

  ctx.beginPath(); // instigate
  ctx.moveTo(startX, startY); // start at pos
  ctx.lineTo(startX+sideLength, startY); // go right along top (we're drawing clockwise from top left)

  ctx.lineTo(startX+sideLength+moveX, startY+moveY);
  ctx.lineTo(startX+sideLength, startY+(moveY*2));
  ctx.lineTo(startX, startY+(moveY*2));
  ctx.lineTo(startX-moveX, startY+moveY);
  ctx.lineTo(startX, startY);
  ctx.closePath();
}
// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};


Reveal.addEventListener('vis_canvas',
  function(ev) {
    screen.style.display = 'block';
    currentAnimation = ev.type;
    screen.innerHTML = '<canvas id="canvas"></canvas>';

var canvas = document.querySelector('#canvas');
canvas.width = screenVals.width;
canvas.height = screenVals.height;

    var ctx = canvas.getContext('2d');

    // var bigData;

    animateDom = function() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0,0,canvas.width, canvas.height);
      ctx.globalCompositeOperation = "hard-light";
      ctx.lineWidth = 2;

      // var frequencies = adjustFreqData(128);
      // var newData = frequencies.newFreqs;
      // bigData = newFreqData.concat(newFreqData).concat(newFreqData).concat(newFreqData).concat(newFreqData).concat(newFreqData);

      for(var i=0;i<frequencyData.length;i++) {
        var d = frequencyData[i];
        // ctx.beginPath();
        drawHex(ctx, d, (i%24)*80, (i%14)*50);
        ctx.strokeStyle = "hsla("+(i*3)+",60%,80%,1)";
        ctx.fillStyle = "hsla("+(i*3)+",60%,"+d/2+"%,0.4)";
        // ctx.arc(x, y, d/(j*5), 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();

      }

    }


  }
)

Reveal.addEventListener( 'no-visuals', function() {
  screen.style.display = 'none';
}, false);


function animate() {
  requestAnimationFrame(animate);
  analyserNode.getByteFrequencyData(frequencyData);
  // newFreqData = adjustFreqData();
  // frequencyData.forEach(newData);
  animateDom();
}





