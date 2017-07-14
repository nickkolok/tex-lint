'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\(re|)new(command|environment)$/,
	{
		name: 'nonewcommand',
		message: 'Не допускается переопределение команд или окружений или определение новых',
	}
);
