import shaka from 'shaka-player'

var instance = new Object()

instance.init = function() {
    shaka.polyfill.installAll()
    if(shaka.Player.isBrowserSupported()) {
        var element = document.getElementById('shakaplayer')
        var player = this.player = new shaka.Player(element)

        player.load('./video/574825.mpd').then(() => {
            console.log('Shaka player: Ready!')
        })
    } else {
        console.log('Shaka player: Browser not supported')
    }
}

export default instance
