'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, работающие с TeX-окружениями, не изменяющие массив нод.

Nodes.prototype.getAllEnvironmentsList = function() {
	var pairs = [];
	var begins = this.getNodesNumbers('tag','\\begin');
	for (var j = 0; j < begins.length; j++) {
		/*
		var end = this.getBraceGroup(
			begins[j],
			{ type: 'tag', text: '\\begin' },
			{ type: 'tag', text: '\\end' }
		).nodes.length - 1 + begins[j];
		*/
		var end = this.getEnvironmentEnd(begins[j]);
		var envname = this.getArguments(begins[j] + 1, 1)[0];
		envname.unwrap();
		pairs.push({
			begin: begins[j],
			end:   end,
			name:  envname.toString(),
		});
	}
	return pairs;
};

Nodes.prototype.getEnvironmentsList = function(names) {
	var list = this.getAllEnvironmentsList();
	for (var i = 0; i < list.length; i++) {
		if (names.indexOf(list[i].name) === -1) {
			list.splice(i, 1);
			i--;
		}
	}
	return list;
};

Nodes.prototype.getEnvironmentEnd = function(begin) {
	return this.getBraceGroup(
		begin,
		{ type: 'tag', text: '\\begin' },
		{ type: 'tag', text: '\\end' }
	).nodes.length - 1 + begin;
};


};
