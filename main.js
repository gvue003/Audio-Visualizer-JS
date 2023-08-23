const audio1 = document.getElementById("audio");
const canvas = document.getElementById("canvas");
const audioFileInput = document.getElementById("audioFileInput");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const barWidth = canvas.width / bufferLength;

let x = 0;

let audioSource;

audioFileInput.addEventListener("change", handleAudioFile);

function handleAudioFile(event) {
  const file = event.target.files[0];
  if (file) {
    const objectURL = URL.createObjectURL(file);
    audio1.src = objectURL;
    if (audioSource) {
      audioSource.disconnect();
    }
    audioSource = audioCtx.createMediaElementSource(audio1);
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    audio1.play().catch((error) => {
      console.error("Audio playback error:", error);
    });
  }
}

function animate() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Get canvas context
  const ctx = canvas.getContext("2d");

  // Clear the canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  analyser.getByteFrequencyData(dataArray);

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    const hue = (i / bufferLength) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth;
  }

  // Reset x position for the next frame
  x = 0;

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
