'use strict';

require('../Rule.js').forbidEnvs(
	['eqnarray*'],
	{
		name: 'no_env_eqnarray*',
		message: 'Не разрешается использование окружений \\begin{eqnarray*} ... \\end{eqnarray*}',
	}
);
