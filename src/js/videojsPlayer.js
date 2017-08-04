import 'video.js/dist/video-js.css';
window.videojs = require('video.js').default;

let instance = new Object(), baseURL = './video/';

instance.init = function() {
    let select = document.getElementById('techSelect'),
        form = document.getElementById('techForm');
    select.addEventListener('change', () => {
        form.submit();
    });
    this.setPlayback();
}

instance.setPlayback = function() {
    let select = document.getElementById('techSelect'),
        value = location.search.replace('?tech=', '') || 'hls';

    select.value = value;

    if(value === 'shaka') {
        this.shakaDashPlayback();
    } else {
        this.hlsPlayback();
    }
}

instance.hlsPlayback = function() {
    require('videojs-contrib-hls/dist/videojs-contrib-hls');

    this.player = videojs('player', {
        controls: true,
        sources: [
            { type:'application/x-mpegURL', src: baseURL + '574825.m3u8' }
        ]
    })
    this.player.ready(() => {
        console.log('Videojs Player: Ready!')
    })
}

instance.shakaDashPlayback = function() {
    require('videojs-shaka-player');
    require('videojs-shaka-player/dist/player-skin');

    this.player = videojs('player', {
        controls: true,
        sources: [
            { type:'application/dash+xml', src: baseURL + '574825.mpd' }
        ]
    })
    this.player.ready(() => {
        console.log('Videojs Player: Ready!')
    })
}

export default instance;
