'use strict';

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\_$/,
	{
		name: 'maxima_underscore',
		message: '\\_ - это дичь',
		commonCorrector: function(nodes, index){
			if(!nodes.nodes[index] || nodes.nodes[index].text !== '\\_') {
				return nodes;
			}
			if(nodes.nodes[index + 1] && nodes.nodes[index + 1].text === '\\_') {
				nodes.nodes[index].text = '^';
				nodes.nodes[index + 1].text = '';
			} else {
				nodes.nodes[index].text = '_';				
			}
			return nodes;
		},
	}
);
