import 'video.js/dist/video-js.css'
import videojs from 'video.js'
import 'videojs-shaka-player'

var instance = new Object()

instance.init = function() {
    this.player = videojs('player', {
        controls: true,
        techOrder: ['shaka', 'html5'],
        sources: [
            { type: 'application/dash+xml', src: './video/574825.mpd' },
            { type: 'video/mp4', src: './video/friendship.mp4' }
        ]
    })
    this.player.ready(() => {
        console.log('Videojs Player: Ready!')
    })
}

export default instance
