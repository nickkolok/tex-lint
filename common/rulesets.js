'use strict';

var rulesets = {
	vzmsh2017: {
		title: "ВЗМШ-2017",
		url: "https://vzmsh.math-vsu.ru/rules/",
		rules: [
			["nonewcommand",1],
			["noautonumformulas",1],
			["noautonumbiblio",1],
		],
	},
	mz: {
		title: "Математические заметки",
		url: "http://www.mathnet.ru/php/authornotes.phtml?jrnid=mzm&option_lang=rus&wshow=authornotes",
		rules: [
			["Bibitem_exist",1],
			["udk_exist",1],
			["udk_onlyone",1],
		],
		examples: [
			{
				title: "С библиографией",
				source: "mz-01",
			},
			{
				title: "Без библиографии",
				source: "mz-02-no-biblio",
			},
		],
	},
};

rulesets.defaultSet = rulesets.vzmsh2017;
module.exports = rulesets;
