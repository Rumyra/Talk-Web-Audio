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
const arpsButton = document.querySelector('button[data-sound="arps"]');

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
        
        if (evt.key === 'g') {
          arpsSource.start();
          arpsButton.classList.add('on');

          window.addEventListener("keydown", function(evt) {
            if (evt.key === 'h') {
              arpsSource.stop();
              arpsButton.classList.remove('on');
            }
          });
        }

      });
    })
});
// remove on class if I forget
Reveal.addEventListener( 'stop-arps', function(ev) {
  fetch('media/100_C_G_Arps_SP_01.wav')
    // read into memory as array buffer
    .then(response => response.arrayBuffer())
    // turn into raw audio data
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      window.addEventListener("keydown", function(evt) {

        const arpsSource = context.createBufferSource();
        const arpsGain = context.createGain();
        arpsSource.buffer = audioBuffer;
        arpsSource.connect(arpsGain).connect(context.destination);
        
        if (evt.key === 'g') {
          arpsSource.start();
          arpsButton.classList.add('on');

          window.addEventListener("keydown", function(evt) {
            if (evt.key === 'h') {
              arpsSource.stop();
              arpsButton.classList.remove('on');
            }
          });
        }

      });
    })
});

Reveal.addEventListener( 'mute-arps', function(ev) {
  arpsButton.classList.remove('on');
});

  

function playArp(buffer) {
  const arpsSource = context.createBufferSource();
  const arpsGain = context.createGain();

  
  // make play func - and call it
}






