'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	//"\\ge",
	/^\\geq?$/,
	{
		name: 'force_geqslant',
		message: 'Используйте \\geqslant вместо \\geq или \\ge',
		replacement: '\\geqslant',
		noReparse: true, // One tag is replaced by another, what are we going to reparse?
	}
);
