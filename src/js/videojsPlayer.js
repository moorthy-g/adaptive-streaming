import 'video.js/dist/video-js.css';

window.videojs = require('video.js').default;
require('videojs-contrib-hls/dist/videojs-contrib-hls');

var instance = new Object();

instance.init = function() {
    this.player = window.videojs('player', {
        controls: true,
        sources: [
            { type:'application/x-mpegURL', src: './video/574825.m3u8' },
            { type: 'video/mp4', src: './video/friendship.mp4' }
        ]
    })
    this.player.ready(() => {
        console.log('Videojs Player: Ready!')
    })
}

export default instance
