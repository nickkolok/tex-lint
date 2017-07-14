'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^comment$/,
	/^..+$/,
	{
		name: 'no_nontrivial-comments',
		message: 'Не разрешается комментировать фрагменты текста',
		commonCorrector: function(nodes, i) {
			nodes.removeComment(i);
			return nodes;
		},
	}
);
