var RuleViolation = require('../RuleViolation.js');

require('../Rule.js').makeSingleForbiddingRule(
	/^tag$/,
	/^\\upsilon$/,
	{
		name: "forbid_upsilon",
		message: "Скорее всего, то, что Вы пытаетесь записать как \\upsilon - обычная v",
	}
);
