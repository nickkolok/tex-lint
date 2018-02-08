'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\vspace$/,
	{
		name: "forbid_vspace",
		message: "Запрещается вручную указывать отступы",
		commonCorrector: function(nodes, index){
			nodes.replaceArguments(index, 2);
			return nodes;
		},
	}
);
