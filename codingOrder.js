// coding order

// play button stuff
const buttons = document.getElementsByTagName('button');
const kickButton = buttons[0];

kickButton.addEventListener("click", function() {
  play();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// steps
// 1.1 create audio context
// 1.2 create oscillator and set frequency
// 1.3 create play function

// 1.1
const ourAudioContext = new window.AudioContext;

// 1.2
const oscillator = ourAudioContext.createOscillator();
oscillator.frequency.value = 150;
// 1.3
function play() {
  oscillator.connect(ourAudioContext.destination);
  oscillator.start(ourAudioContext.currentTime);
  oscillator.stop(ourAudioContext.currentTime+2);
}
console.log(ourAudioContext.state);

// 2.1 explain how you need to create the ocsialltor every time it stops, as it gets destroyed - move into function

// 2.2 add a wave type - change it
// 2.3 change time

function play() {
  // 2.1
  const oscillator = ourAudioContext.createOscillator();

  oscillator.frequency.value = 150;
  // 2.2
  oscillator.type = 'sawtooth';

  oscillator.connect(ourAudioContext.destination);
  oscillator.start(ourAudioContext.currentTime);
  // 2.3
  oscillator.stop(ourAudioContext.currentTime+0.5);
}

// 3.1 Now we can add effects to this sound.
// Let's have the volume drop away suddenly
// This is really where the audio API starts to get big. We've been through most of the functionality available to us - but there's still a whole bunch of methods and 

// 3.2 add gain node code

const gainNode = ourAudioContext.createGain();
// set value to 1 'now'
gainNode.gain.setValueAtTime(1, ourAudioContext.currentTime);
// decrease suddenly but smoothly
gainNode.gain.exponentialRampToValueAtTime(0.001, ourAudioContext.currentTime + 0.5);

// 3.3 connect


// do the same with our frequency
oscillator.frequency.exponentialRampToValueAtTime(0.001, ourAudioContext.currentTime+0.5);











