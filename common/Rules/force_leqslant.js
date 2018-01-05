'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\leq?$/,
	{
		name: 'force_leqslant',
		message: 'Используйте \\leqslant вместо \\leq или \\le',
		replacement: '\\leqslant',
		noReparse: true, // One tag is replaced by another, what are we going to reparse?
	}
);
