import test, {ExecutionContext} from 'ava';
import isCi from 'is-ci';
import createVlc from './source/index.js';

const testIf = (condition: boolean) => condition ? test : test.skip;

testIf(!isCi)('main', async (t: ExecutionContext) => {
	const vlc = await createVlc();

	t.deepEqual(await vlc.info(), {
		fullscreen: 0,
		audiodelay: 0,
		apiversion: 3,
		currentplid: -1,
		time: 0,
		volume: 256,
		length: 0,
		random: false,
		audiofilters: {
			filter_0: '',
		},
		rate: 1,
		videoeffects: {
			hue: 0,
			saturation: 1,
			contrast: 1,
			brightness: 1,
			gamma: 1,
		},
		state: 'stopped',
		loop: false,
		version: '3.0.16 Vetinari',
		position: 0,
		repeat: true,
		subtitledelay: 0,
		equalizer: [],
	});

	vlc.kill();
});
