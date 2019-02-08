'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\cdot$/,
	{
		name: "maxima_forbid_cdot",
		message: "Скорее всего, \\cdot - лишний",
		replacement: "",
	}
);
