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

  const numBars = bufferLength;
  const barSpacing = canvas.width / numBars;
  const maxBarHeight = canvas.height * 0.8; // Adjust this for desired height

  for (let i = 0; i < numBars; i++) {
    const barHeight = (dataArray[i] / 255) * maxBarHeight;
    const hue = (i / numBars) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    const barX = i * barSpacing;
    ctx.fillRect(barX, canvas.height - barHeight, barSpacing, barHeight);
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
