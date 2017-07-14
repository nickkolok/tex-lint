'use strict';

require('../Rule.js').forbidEnvs(
	['equation'],
	{
		name: 'no_env_equation',
		message: 'Не разрешается использование окружений \\begin{equation} ... \\end{equation}',
	}
);
