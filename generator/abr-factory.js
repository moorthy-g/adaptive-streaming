const { exec } = require('child_process');
const { EventEmitter } = require('events');
const input = process.argv[2];
const noAudio = process.argv[3] === '--no-audio';

class AbrFactory extends EventEmitter {
    constructor(input, customConfig) {
        super();
        let config;
        this.dateTime = new Date().getTime();
        this.inputFile = input;
        this.tmpDirectory = 'tmp_'+ this.dateTime;
        this.command = 'cd . ';
        config = this.config = Object.assign({
            outDirectory: 'out_'+ this.dateTime,
            noAudio: noAudio,
            dash: true,
            hls: true,
            hlsUsesDashFrags: false,
            emitSingleFile: false,
            frameRate: 25,
            fragDuration: 4,
            streams: [ 1080, 720, 540, 360, 270 ], // heights
            bandwidths: [ 8000, 4000, 2400, 1200, 600 ] //in kbps
        }, customConfig || {});
        this.videoParams = `\
                -an -r ${config.frameRate} -x264opts\
                keyint=${config.frameRate*config.fragDuration}:min-keyint=${config.frameRate*config.fragDuration}:no-scenecut\
                -profile:v high -preset slow -movflags +faststart\
                -c:v libx264 `;

        this.execute();
    }

    execute() {
        this.getCommand();

        let abr = exec(this.command);

        abr.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        abr.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        abr.on('error', (err) => {
            this.emit('error', { error: err });
        });

        abr.on('close', (code) => {
            if(code === 0) {
                this.emit('complete');
            } else {
                this.emit('error', code);
            }
        });

    }

    getCommand() {
        this.prepare().processAudio().processVideo()
            .mp4fragment().mp4dash().mp4hls()
            .cleanUp();
    }

    prepare() {
        this.command += `&& mkdir ${this.tmpDirectory} && ffmpeg -y -i ${this.inputFile} `;
        return this;
    }

    processAudio() {
        this.command += !this.config.noAudio ? `-c:a aac -strict -2 -b:a 128k -ac 2 -vn ${this.tmpDirectory}/audio.mp4 ` : '';
        return this;
    }

    processVideo() {
        //${videoParams} -maxrate 4000k -bufsize 8000k -vf scale=-1:1080 1080.mp4
        let bandwidths = this.config.bandwidths;
        this.config.streams.forEach( (stream, i) => {
            this.command += `${this.videoParams} -maxrate ${bandwidths[i]}k -bufsize ${bandwidths[i]*2}k\
                        -vf scale=-1:${stream} ${this.tmpDirectory}/${stream}.mp4 `
        })
        return this;
    }

    mp4fragment() {
        let streams = this.config.streams.slice(0);
        !this.config.noAudio && streams.push('audio');
        streams.forEach( stream => {
            this.command += `&& mp4fragment ${this.tmpDirectory}/${stream}.mp4 ${this.tmpDirectory}/${stream}f.mp4\
            --fragment-duration ${this.config.fragDuration*1000} `
        })
        return this;
    }

    mp4dash() {
        if(this.config.dash) {
            let files = this.getFiles();
            this.command += `&& mp4dash ${files} -f -o ${this.config.outDirectory} `;
            this.command += this.config.hlsUsesDashFrags ? '--hls --hls-master-playlist-name stream.m3u8 ' : '';
            this.command += this.config.emitSingleFile ? '--no-split ' : '';
        }
        return this;
    }

    mp4hls() {
        if(this.config.hls) {
            let files = this.getFiles();
            this.command += `&& mp4hls ${files} -f -o ${this.config.outDirectory}\
                        --segment-duration ${this.config.fragDuration} `;
            this.command += this.config.emitSingleFile ? '--output-single-file ' : '';
        }
        return this;
    }

    cleanUp() {
        this.command += `&& rm -r -f ${this.tmpDirectory}`;
        return this;
    }

    getFiles() {
        let streams = this.config.streams.slice(0);
        !this.config.noAudio && streams.push('audio');
        return streams.reduce((files, value) => {
            return `${files} ${this.tmpDirectory}/${value}f.mp4 `;
        }, '')
        return this;
    }
}

//Create instance, if CLI
input && new AbrFactory(input);

//Export, if required by another module
module.exports = AbrFactory;
