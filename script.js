const video = document.querySelector(".player");
const snap = document.querySelector(".snap");
const strip = document.querySelector(".strip");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((media) => {
      console.log(media);
      video.srcObject = media;
      video.play();
    })
    .catch((error) => {
      console.log(error);
    });
}

getVideo();

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;
  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    //take out pixels from canvas
    let pixels = ctx.getImageData(0, 0, width, height);

    //manipulate them
    pixels = filter(pixels);

    //put them back on canvas
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  //take the data out of canvas
  const data = canvas.toDataURL("image/jpeg");

  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "me.jpeg");
  link.innerHTML = `<img src="${data}" alt="pretty lady"/>`;
  strip.insertBefore(link, strip.firstChild);
  console.log(strip.firstChild);
}

function filter(pixels) {
  for (let i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 10; //red
    pixels.data[i + 1] = pixels.data[i + 1] - 20; //blue
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //green
  }
  return pixels;
}

video.addEventListener("canplay", paintToCanvas);
