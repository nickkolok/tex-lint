'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^comment$/,
	/^%$/,
	{
		name: 'no_trivial-comments',
		message: 'Не разрешается комментировать пустое окончание строки',
		commonCorrector: function(nodes, i) {
			nodes.removeComment(i);
			return nodes;
		},
	}
);
