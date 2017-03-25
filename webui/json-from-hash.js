'use strict';

// TODO: таки средствами chas-lib, но не засоряя прототипы
function importNonExisting(from, to) {
	if (from) {
		for (var prop in from) {
			if (!(prop in to)) {
				to[prop] = from[prop];
			}
		}
	}
}

function encodeURIComponentEx(str) {
	return encodeURIComponent(str).replace(/'/g, '%27');
}

function decodeURIComponentEx(str) {
	return decodeURIComponent(str).replace(/&quot;/g, '"');
}
function decodeHash() {
	return window.location.hash = decodeURIComponentEx(window.location.hash.slice(1));
}

function encodeHash() {
	return window.location.hash = '#' + encodeURIComponentEx(window.location.hash.slice(1));
}

var defaultOptions = {
	decodeBefore: true,
};

function getHashAsObject(o) {
	importNonExisting(defaultOptions, o);

	var hash = window.location.hash.slice(1);
	if (o.decodeBefore) {
		hash = decodeHash(); // Firefox does not allow otherwise =(
	}

	if (o.decodeAfter) {
		decodeHash();
	}
	if (o.encodeAfter) {
		encodeHash();
	}

	var result = {};
	try {
		result = JSON.parse(hash);
	} catch (e) {
		console.log('Не удалось выделить JSON из хэша страницы. Unable to get JSON from location hash');
		console.log(hash);
		console.log(decodeURIComponent(hash));
	}
	if ('defaults' in o) {
		importNonExisting(o.defaults, result);
	}

	return result;
}

module.exports = {
	getHashAsObject : getHashAsObject,
	decodeHash : decodeHash,
	encodeHash : encodeHash,
	importNonExisting : importNonExisting,
	encodeURIComponentEx : encodeURIComponentEx,
	decodeURIComponentEx : decodeURIComponentEx,
};
