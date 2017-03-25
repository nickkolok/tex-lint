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
		comment: "Отсутствие ошибок является необходимым условием подачи тезисов. Достаточное условие проверяется вручную!",
	},
	mz: {
		title: "Математические заметки",
		url: "http://www.mathnet.ru/php/authornotes.phtml?jrnid=mzm&option_lang=rus&wshow=authornotes",
		rules: [
			["Bibitem_exist",1],
			["udk_exist",1],
			["udk_onlyone",1],
			["noinlinefrac",0.5],
			['no_frac_in_sub_sup',0.5],
			['noinlinesumprod', 0.5],
		],
		comment: "",
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
	smzh: {
		title: "Сибматжурнал",
		url: "http://a-server.math.nsc.ru/publishing/smz/for_authors.php",
		rules: [
			["nonewcommand",1],
			["noautonumformulas",1],
			["noautonumbiblio",1],
			["notoest",1],
			["no_nontrivial-comments",1],
			["no_trivial-comments",1],
			["separate$$",1],
			["separate$",1],
			["splitrows80",1],
			['no_env_equation',1],
			['no_env_equation*',1],
		],
		comment: "",
		examples: [
			{
				title: "Простой пример",
				source: "smzh-1",
			},
		],
	},
	rtf2latex: {
		title: "После конвертера rtf2latex",
		url: "https://github.com/nickkolok/rtf2latex2e",
		rules: [
			['longmapsto_instead_of_delta',1],
			['manual_paragraph_format',1],
			['empty_text_options',1],
			['rtf2latex_subunicode_artifacts',1],
		],
		comment: "",
	},

};

rulesets.defaultSet = rulesets.vzmsh2017;
module.exports = rulesets;
