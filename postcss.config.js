const path = require('path');
console.log('postcss.config подключен');

function sortMedia(a, b, revers = false) {
	// revers = true;
	let reg = /max-width\s*:\s*\d+/;
	a = +a.match(reg)[0].match(/\d+/)[0];
	b = +b.match(reg)[0].match(/\d+/)[0];
	if (revers) {
		[a, b] = [b, a];
		console.log(revers)
	}

	if ( a < b ) {
		// console.log(a+' < '+b+' return 1')
		return 1;
	}
	else if ( a == b ) {
		// console.log(a+' = '+b+' return 0')
		return 0;
	}
	else {
		// console.log(a+' > '+b+' return -1')
		return -1;
	}
}

// console.log(sortMedia('(min-width: 800px) and (max-width: 1200px)', '(min-width: 320px) and (max-width: 799px)'))

module.exports = {
	plugins: [
		require('postcss-preset-env'),
		require('autoprefixer'),
		require('css-mqpacker')({
			sort: sortMedia
		}),
		require('cssnano')({preset: ['default', {
			cssDeclarationSorter: false,
			normalizeWhitespace: false,
			mergeRules: false
		}]}),
		require('postcss-normalize')({ browsers: 'last 2 versions' }),
		// require('stylelint'),
		require('stylefmt')
	]
}

// const postcss = require('postcss')
// const postcssNormalize = require('postcss-normalize')

// postcss([postcssNormalize(/* pluginOptions */)]).process(YOUR_CSS /*, processOptions */)