const socket = io('/');
const myVideo = document.createElement('video');
myVideo.muted = true;

let videoGrid = document.getElementById('video-grid');
let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
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
    // Message section
    let message = document.getElementById('chat_message');
    message.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' && message.value.trim().length != 0) {
            socket.emit('message', message.value)
            message.value = "";
        }
    })

    socket.on('createMessage', message => {
        document.querySelector('.messages').insertAdjacentHTML('beforeend', `<li class="message"><b>User</b><br/>${message}</li>`)
        scrollToBottom();
    })
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

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

// Function for muting our audio
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

// Video 
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
        <span>Start Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}