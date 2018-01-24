'use strict';

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из других функций, правил и т.д.
// Они НЕ изменяют объект, а возвращают нечто новое
// В этом файле - функции, относящиеся к формулам и их поиску

Nodes.inlineFormulaDelimiters = {
	'$': null,
	'\\(': null,
	'\\)': null,
};


Nodes.prototype.isInside$ = function(index, includeDelimiters) {
    if (this.nodes[index].type === 'keyword') {
        return (
            !!includeDelimiters
        &&
            this.nodes[index].text in Nodes.inlineFormulaDelimiters
        );
    }
	var delimCount = 0;
	for (; index > -1; index--) {
		if (this.nodes[index].type === 'keyword') {
			if (this.nodes[index].text === '$') {
				delimCount++;
			} else if (this.nodes[index].text === '\\(') {
				return true;
			} else {
				break;
			}
		}
	}
	return !!(delimCount % 2);
};

Nodes.displayFormulaDelimiters = {
	'$$': null,
	'\\[': null,
	'\\]': null,
};

Nodes.prototype.isInside$$ = function(index, includeDelimiters) {
    if (this.nodes[index].type === 'keyword') {
        return (
            !!includeDelimiters
        &&
            this.nodes[index].text in Nodes.displayFormulaDelimiters
        );
    }

	var delimCount = 0;
	for (; index > -1; index--) {
		if (this.nodes[index].type === 'keyword') {
			if (this.nodes[index].text === '$$') {
				delimCount++;
			} else if (this.nodes[index].text === '\\[') {
				return true;
			} else {
				break;
			}
		}
	}
	return !!(delimCount % 2);
};

Nodes.prototype.isInsideFormula = function(index, includeDelimiters) {
    if (this.nodes[index].type === 'keyword') {
        return !!includeDelimiters;
    }

	var nearest;
	for (; index > -1; index--) {
		if (this.nodes[index].type === 'keyword') {
			nearest = this.nodes[index];
			if (nearest.text === '\\[' || nearest.text === '\\(') {
				return true;
			}
			if (nearest.text === '\\]' || nearest.text === '\\)') {
				return false;
			}
			break;
		}
	}
	if (index === -1) {
		return false;
	}

	index--;
	var delimCount = 1;
	for (; index > -1; index--) {
		if (this.nodes[index].type === 'keyword') {
			if (this.nodes[index].text !== nearest.text) {
				break;
			}
			delimCount++;
		}
	}
	return !!(delimCount % 2);
};

Nodes.prototype.getFormulaByIndex = function(index) {
	if (index >= this.length) {
		return null;
	}

	//TODO: refactor?
	if (this.nodes[index].type === 'keyword') {
		// Bad case, we don't know, is index left or right border of formula
		if (this.nodes[index].text === "\[") {
			//TODO: correct type + tests!
			return this.getFormulaByIndex(index + 1);
		}
		if (this.nodes[index].text === "\]") {
			//TODO: correct type + tests!
			return this.getFormulaByIndex(index - 1);
		}
		if (this.nodes[index].text === "$" || this.nodes[index].text === "$$") {
			//TODO: correct type + tests!
			if (this.nodes[index + 1] && this.isInsideFormula(index + 1)) {
				return this.getFormulaByIndex(index + 1);
			}
			return this.getFormulaByIndex(index - 1);
		}
	}

	// TODO: обобщить
	var beginIndex = 0;
	if (this.isInside$(index, true)) {
		var type = '$';
	} else if (this.isInside$$(index, true)) {
		var type = '$$';
	} else {
		return null; // TODO: а может, всё-таки объект, пусть и пустой?
	}

	// TODO: getNearestLeft/RightFormulaDelimiter
	var start = index;
	do {
		start--;
	} while (!(
		this.nodes[start].text in Nodes.inlineFormulaDelimiters
	||
		this.nodes[start].text in Nodes.displayFormulaDelimiters
	));

	var end = index;
	while (!(
		end >= this.length - 1
	||
		this.nodes[end].text in Nodes.inlineFormulaDelimiters
	||
		this.nodes[end].text in Nodes.displayFormulaDelimiters
	)) {
		end++;
	}

	return {
		start : start,
		end   : end,
		type  : type,
	};
};

};//modules.export
