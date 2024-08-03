const myVideo = document.createElement('video');
myVideo.muted = true;

let videoGrid = document.getElementById('video-grid')

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
})

const addVideoStream = (video, stream) => {
    console.log("inside function")
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        console.log("Hello therre")
        video.play();
    })
    videoGrid.append(video);
}