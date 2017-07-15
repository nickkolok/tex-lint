'use strict';

require('../Rule.js').replaceText({
	name: 'notoest',
	message: 'Вместо "то есть" необходимо использовать сокращение "т. е."',
	regtext: /([^-А-Яа-яЁёA-Za-z])то[\s\n\r]+есть([^-А-Яа-яЁёA-Za-z])/g,
	newtext: '$1т.~е.$2',
});
