import vlc from "./src"
import isCi from "is-ci"
import test from "ava"

test("main", async (t) => {
	if (isCi) t.pass() // For now, Travis CI doesn't support testing.
	else {
		const v = await vlc()

		t.deepEqual(await v.info(), {
			fullscreen: 0,
			audiodelay: 0,
			apiversion: 3,
			currentplid: -1,
			time: 0,
			volume: 256,
			length: 0,
			random: false,
			audiofilters: {
				filter_0: ""
			},
			rate: 1,
			videoeffects: {
				hue: 0,
				saturation: 1,
				contrast: 1,
				brightness: 1,
				gamma: 1
			},
			state: "stopped",
			loop: false,
			version: "3.0.8 Vetinari",
			position: 0,
			repeat: false,
			subtitledelay: 0,
			equalizer: []
		})
	}
})
