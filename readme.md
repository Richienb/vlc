# VLC [![Travis CI Build Status](https://img.shields.io/travis/com/Richienb/vlc/master.svg?style=for-the-badge)](https://travis-ci.com/Richienb/vlc)

An interface to VLC Media Player.

[![NPM Badge](https://nodei.co/npm/@richienb/vlc.png)](https://npmjs.com/package/@richienb/vlc)

## Highlights

- Automatic command encoding and delivery.
- Automatic port acquisition.
- TypeScript support.
- Bundled binaries.
- No native dependencies.
- Actively maintained.

## Install

```sh
npm install @richienb/vlc
```

## Usage

```js
const vlc = require("@richienb/vlc");

(async () => {
	const vlc = await vlc()

	// Play audio
	await vlc.command("in_play", {
		input: "audioFile.mp3"
	})

	// Pause/resume audio
	await vlc.command("pl_pause")
})()
```

## API

See the documentation: https://richienb.github.io/vlc
