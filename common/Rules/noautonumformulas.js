'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\(label|ref)$/,
	{
		name: 'noautonumformulas',
		message: 'Не допускается использование автоматической нумерации формул',
	}
);
