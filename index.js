const	cp = require('../.'),
	fs = require('fs'),
	vs = require('videoshow');

module.exports = timePlotter;

function timePlotter(f, n, cp_opt, vid_opt, path, map_i, audio = false, show_i = false){
	map_i = map_i || timePlotter.def_map_i;
	const imgs = [];
	var i = 0, img, video;
	
	for(; i < n; i++)
	img = cp(f(map_i(i)), ...cp_opt).write(imgs[i] = `./temp/${i}.png`);
	
	vid_opt = vid_opt || timePlotter.def_vid_opt;
	vid_opt.size = `${img.bitmap.width}x${img.bitmap.height}`;
	
	if(show_i) video = vs(imgs.map((path, i) => ({ path, caption: map_i(i) })), vid_opt);
	
	if(audio) video = video.audio(audio);
	
	video
		.save(path)
		.on('start', cmd => {
			console.log('Comando', cmd);
		}).on('error', (e, sout, serr) => {
			console.error('Erro', e);
			console.error('Erro do FFMPEG', serr);
		}).on('end', () => {
			imgs.forEach(img => fs.unlinkSync(img));
		});
}

timePlotter.def_vid_opt = {
	fps: 30, loop: 1, transition: false, format: 'mp4', videoCodec: 'libx264'
};
timePlotter.def_map_i = i => i;