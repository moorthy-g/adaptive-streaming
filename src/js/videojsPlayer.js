import 'video.js/dist/video-js.css'
import videojs from 'video.js'

var instance = new Object()

instance.init = function() {
    this.player = videojs('player', {
        controls: true,
        sources: [
            { type: 'video/mp4', src: './video/friendship.mp4' }
        ]
    })
    this.player.ready(() => {
        console.log('Videojs Player: Ready!')
    })
}

export default instance
