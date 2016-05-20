"use strict";

let imagemin = require('imagemin')
,   fs = require("fs")
,   path = require("path")
,   imageminMozjpeg = require('imagemin-mozjpeg')
,   imageminPngquant = require('imagemin-pngquant');
 
imagemin(path.resolve(__dirname, "../test/api/test-image.jpg"), path.resolve(__dirname, "../test/api/"), {
	plugins: [
		imageminMozjpeg({targa: true}),
		imageminPngquant({quality: '65-80'})
	]
}).then(files => {
	console.log(files);
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …] 
});