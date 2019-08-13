/*
const Speaker = require('speaker');
 
// Create the Speaker instance
const speaker = new Speaker({
  channels: 2,          // 2 channels
  bitDepth: 16,         // 16-bit samples
  sampleRate: 44100     // 44,100 Hz sample rate
});
 
// PCM data from stdin gets piped into the speaker
process.stdin.pipe(speaker);
*/
/*
const play = require('audio-play');
const load = require('audio-loader');
 
//load('/media/a.wav').then(play);


load('./re.mp3').then(function (buffer) {
  console.log(buffer) // => <AudioBuffer>


let pause = play(buffer, {
    //start/end time, can be negative to measure from the end
    start: 0,
    end: buffer.duration,
   
    //repeat playback within start/end
    loop: false,
   
    //playback rate
    rate: 1,
   
    //fine-tune of playback rate, in cents
    detune: 0,
   
    //volume
    volume: 1,
   
    //possibly existing audio-context, not necessary
    context: require('audio-context'),
   
    //start playing immediately
    autoplay: true
  });
  
  let playback = play(buffer);
  playback.pause();
  playback.play();
   
  //get played time
  playback.currentTime;

})

*/
const play = require('audio-play');
const load = require('audio-loader');
const lenaBuffer = require('audio-lena/mp3');
const decode = require('audio-decode');
var AV = require('av');
require('mp3');

decode(lenaBuffer, (err, audioBuffer) => 
{
    console.log(err);
    console.log(audioBuffer);

});
  
