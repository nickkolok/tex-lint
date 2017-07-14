'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\(cite|bibitem)$/,
	{
		name: 'noautonumbiblio',
		message: 'Не допускается использование автоматической нумерации библиографии',
	}
);
