const socket = io('/');
const myVideo = document.createElement('video');
myVideo.muted = true;

let videoGrid = document.getElementById('video-grid');
let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    // Answering calls
    peer.on('call', call => {
        call.answer(stream); // Answer the call with our own stream
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream); // Show user video
        });
    });

    socket.on('user-connected', (userID) => {
        setTimeout(() => {
            connectToNewUser(userID, stream);
        }, 1000); // Slight delay to ensure both peers are ready
    });
});

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '8000',
});

peer.on('open', id => {
    socket.emit('join-room', room_id.trim(), id);
});

const connectToNewUser = (userID, stream) => {
    const call = peer.call(userID, stream); // Call the new user
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream); // Add the new user's video stream
    });
};

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
};
