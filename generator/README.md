# DASH & HLS multi-bitrate video generator
`abr-factory` is a nodejs module that generates multi-bitrate DASH & HLS content for the given video input. No encryptions supported.

## Requirements
 - nodejs
 - ffmpeg
 - [bento4](https://www.bento4.com/) (mp4fragment, mp4dash, mp4hls commands should available)
 
   
## Usage - CLI
```bash
node abr-factory.js path/to/video
```
 
## Usage - As Module
```javascript
const AbrFactory = require('./abr-factory');
const instance = new AbrFactory('video/path', <config object>);
```

## Configuration
- `outDirectory`:`string` Output Directory. Default 'out_`datetime`'
- `hasAudio`:`boolean` - Whether to include audio stream. Default `true`
- `dash`:`boolean` - Whether to output DASH content. Default `true`
- `hls`:`boolean` - Whether to output HLS content. Default `true`
- `hlsUsesDashFrags`:`boolean`- Whether to use DASH fragments in HLS manifest. So, we don't need seperate TS fragments for HLS. Anyhow, beware of browser support. Default `false`
- `emitSingleFile`:`boolean` - Whether to output single file or multi fragments for each bitrates . Default `false`
- `frameRate`:`int` - Frame rate of the streams. Default `25`
- `fragDuration`:`int` - Fragment duration. Default `4`
- `streams`:`intArray` - Array of required streams. The values are video's height. Default `[1080, 720, 540, 360, 270]`
- `bandwidths`: `intArray` - Array of bitrates for streams. The length should match `streams`. Default `[8000, 4000, 2400, 1200, 600]`
 
## Events
- `complete` - fires as the process completes
- `error` - fires, if error, with error code as parameter
