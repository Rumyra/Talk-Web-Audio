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
svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + (svgDomDi.height-40) + ")").call(xAxis).append('text').text('time').attr('transform','translate('+(svgDomDi.width-100)+',-10)');
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

          window.addEventListener("keydown", function(evt) {
            if (evt.key === 'w') {
              arpsSource.stop();
              playArpsButton.classList.remove('on');
            }
          });
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

        if (evt.key === 'e') {

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

Reveal.addEventListener( 'osc', function(ev) {
  const oscButton = document.querySelector('button[data-sound="osc"]');

  window.addEventListener("keydown", function(evt) {

    if (evt.key === 'r') {
      oscButton.classList.add('on');

      const osc = context.createOscillator();
      osc.frequency.value = 440;
      osc.type = 'triangle';

      osc.connect(context.destination);
      osc.start(context.currentTime);
      osc.stop(context.currentTime+1);
      osc.onended = function() {
        oscButton.classList.remove('on');
      }
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

// Reveal.addEventListener( 'stop-arps', function(ev) {
//   playArpsButton.classList.remove('on');
// });

// Reveal.addEventListener( 'stop-arps', function(ev) {
//   playArpsButton.classList.remove('on');
// });

  







