'use strict';

var xtend = require('xtend');

module.exports = function(Nodes) {

// Здесь сложены функции, вызываемые из других функций, правил и т.д.
// Они НЕ изменяют объект, а возвращают нечто новое
// В этом файле - функции, относящиеся к формулам и их поиску

Nodes.inlineFormulaDelimiters = {
	'$': null,
	'\\(': null,
	'\\)': null,
};

Nodes.displayFormulaDelimiters = {
	'$$': null,
	'\\[': null,
	'\\]': null,
};

Nodes.allFormulaDelimiters = xtend(
	Nodes.inlineFormulaDelimiters,
	Nodes.displayFormulaDelimiters
);

Nodes.inlineFormulaEnvironments = {
	'math': null,
};
Nodes.displayFormulaEnvironments = {
	'align': null,
	'align*': null,
	'alignat': null,
	'alignat*': null,
	'displaymath': null,
	'eqnarray': null,
	'eqnarray*': null,
	'equation': null,
	'equation*': null,
	'flalign': null,
	'flalign*': null,
	'gather': null,
	'gather*': null,
	'multline': null,
	'multline*': null,
/*
	'': null,
	'*': null,
	'': null,
	'*': null,
	'': null,
	'*': null,
*/
};

Nodes.allFormulaEnvironments = xtend(
	Nodes.inlineFormulaEnvironments,
	Nodes.displayFormulaEnvironments
);


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

	var nearest = this.getNearestFormulaDelimiterLeft(index);

	if (nearest.index === -1) {
		return false;
	}

	if (nearest.isBegin) {
		return true;
	}

	if (nearest.isEnd) {
		return false;
	}

	index = nearest.index;
	nearest = this.nodes[index];
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
	if (index >= this.length || index < 0) {
		return null;
	}

	//TODO: refactor?
	if (this.isFormulaDelimiter(index)) {
		// Bad case, we don't know, is index left or right border of formula
		if (this.nodes[index].text === '\\[' || this.nodes[index].text === '\\(') {
			//TODO: correct type + tests!
			return this.getFormulaByIndex(index + 1);
		}
		if (this.nodes[index].text === '\\]' || this.nodes[index].text === '\\)') {
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

	var start = this.getNearestFormulaDelimiterLeft(index).index;
	var end = this.getNearestFormulaDelimiterRight(index).index;


	return {
		start : start,
		end   : end,
		type  : type,
	};
};

Nodes.prototype.isFormulaEnvironmentName = function(index) {
	return (
		(
			this.nodes[index].type === 'variable'
			||
			this.nodes[index].type === 'variable-2'
			||
			this.nodes[index].type === null
		)
	&&
		this.nodes[index].text in Nodes.allFormulaEnvironments
	);
};

Nodes.prototype.isFormulaDelimiter = function(index) {
	// TODO: it's very rough
	// The space, the tag and the brackets in `\begin {equation}` will be not delimiters
	// However, this should be enough for our needs

	if (index < 0 || index >= this.length) {
		return false;
	}

	if (this.nodes[index].type === 'keyword') {
		return true;
	}
	if (this.isFormulaEnvironmentName(index)) {
		var tag = this.skipToTypeReverse(index, 'tag');
		return (
			this.nodes[tag].text === '\\begin'
		||
			this.nodes[tag].text === '\\end'
		);
	}
	return false;
};

Nodes.prototype.classifyFormulaDelimiter = function(index) {
	if (index < 0 || index >= this.length) {
		return {
			index: index,
		};
	}
	switch (this.nodes[index].text) {
		//{{ Plain TeX delimiters $ and $$
		case '$':
			return {
				index: index,
				inline: true,
				display: false,
				marker: '$',
				isBegin: undefined,
				isEnd: undefined,
			};
		case '$$':
			return {
				index: index,
				inline: false,
				display: true,
				marker: '$$',
				isBegin: undefined,
				isEnd: undefined,
			};
		//}} Plain TeX delimiters $ and $$

		//{{ Simple LaTeX delimiters \( \) \[ \]
		case '\\(':
			return {
				index: index,
				inline: true,
				display: false,
				marker: '\\(',
				isBegin: true,
				isEnd: false,
			};
		case '\\)':
			return {
				index: index,
				inline: true,
				display: false,
				marker: '\\(',
				isBegin: false,
				isEnd: true,
			};

		case '\\[':
			return {
				index: index,
				inline: false,
				display: true,
				marker: '\\[',
				isBegin: true,
				isEnd: false,
			};
		case '\\]':
			return {
				index: index,
				inline: false,
				display: true,
				marker: '\\[',
				isBegin: false,
				isEnd: true,
			};
		default:
			var marker = this.nodes[index].text;
			if (this.nodes[index + 1].text === '*') {
				// Parser splits them
				// TODO: dekostylize
				marker += '*';
			}
			if (this.isFormulaEnvironmentName(index)) {
				var tag = this.skipToTypeReverse(index, 'tag');
				if (!this.nodes[tag]) {
					break;
				}
				var tagtext = this.nodes[tag].text;

				//if (tagtext !== '\\begin' && tagtext !== '\\end'){
				//	break;
				//}
				if (tagtext === '\\begin') {
					return {
						index: this.skipToType(index, 'bracket'),
						inline: marker in Nodes.inlineFormulaEnvironments,
						display: marker in Nodes.displayFormulaEnvironments,
						marker: marker,
						isBegin: true,
						isEnd: false,
					};
				}
				if (tagtext === '\\end') {
					return {
						index: tag,
						inline: marker in Nodes.inlineFormulaEnvironments,
						display: marker in Nodes.displayFormulaEnvironments,
						marker: marker,
						isBegin: false,
						isEnd: true,
					};
				}
			}
	}
	return {
		index: index,
	};
};

Nodes.prototype.getNearestFormulaDelimiterRight = function(index) {
	for (; index < this.length; index++) {
		if (
			this.nodes[index].text in Nodes.allFormulaDelimiters
		||
			this.nodes[index].text in Nodes.allFormulaEnvironments
		) {
			var classified = this.classifyFormulaDelimiter(index);
			if (classified.marker) {
				return classified;
			}
		}
	}
	return {
		index: this.length,
	};
};

Nodes.prototype.getNearestFormulaDelimiterLeft = function(index) {
	for (; index > -1; index--) {
		if (
			this.nodes[index].text in Nodes.allFormulaDelimiters
		||
			this.nodes[index].text in Nodes.allFormulaEnvironments
		) {
			var classified = this.classifyFormulaDelimiter(index);
			if (classified.marker) {
				return classified;
			}
		}
	}
	return {
		index: -1,
	};
};

};//modules.export
