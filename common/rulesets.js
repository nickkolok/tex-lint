'use strict';

var rulesets = {
	vzmsh2017: {
		name: "vzmsh2017",
		title: "ВЗМШ-2017",
		url: "https://vzmsh.math-vsu.ru/rules/",
		rules: [
			["nonewcommand",1],
			["noautonumformulas",1],
			["noautonumbiblio",1],
		],
		examples: [
			{
				title: "",
				source: "",
			},
		],
	},
};

rulesets.defaultSet = rulesets.vzmsh2017;
module.exports = rulesets;
