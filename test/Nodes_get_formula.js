QUnit.module("Nodes_get_formula");


function equal(bool1, bool2, i) {
	return assert.deepEqual(
		!!bool1,
		!!bool2,
		i
	);
}

function testInsideFormula(str, inside$$, inside$) {
	var n = new Nodes(str);
	for (var i = 0; i < n.length; i++){
		equal(
			n.isInside$$(i),
			Math.floor(inside$$[i]),
			i + ' $$ ' + str
		);
		equal(
			n.isInside$$(i),
			!!Math.floor(inside$$[i]),
			i + ' $$ ' + str
		);
		equal(
			n.isInside$$(i, true),
			!!Math.ceil(inside$$[i]),
			i + ' $$ ' + true + ' ' + str
		);

		equal(
			n.isInside$(i),
			!!Math.floor(inside$[i]),
			i + ' $ ' + str
		);
		equal(
			n.isInside$(i),
			!!Math.floor(inside$[i]),
			i + ' $ ' + str
		);
		equal(
			n.isInside$(i, true),
			!!Math.ceil(inside$[i]),
			i + ' $ ' + true + ' ' + str
		);

		equal(
			n.isInsideFormula(i),
			!!Math.floor(inside$[i]) || !!Math.floor(inside$$[i]),
			i + ' Formula ' + str
		);
		equal(
			n.isInsideFormula(i),
			!!Math.floor(inside$[i]) || !!Math.floor(inside$$[i]),
			i + ' Formula ' + str
		);
		equal(
			n.isInsideFormula(i, true),
			!!Math.ceil(inside$[i]) || !!Math.ceil(inside$$[i]),
			i + ' Formula ' + true + ' ' + str
		);

	}
}

function testInsideFormulaArray(arr, inside$$, inside$) {
	for (var j = 0; j < arr.length; j++) {
		testInsideFormula(arr[j], inside$$, inside$);
	}
}

test('isInside$$', function () {

	testInsideFormulaArray(
		[
			'\\[a\\]',
			'$$a$$',
		],
		[0.5, 1, 0.5],
		[0, 0, 0]
	);
	testInsideFormulaArray(
		[
			'\\[a\\]b',
			'$$a$$b',
		],
		[0.5, 1, 0.5, 0],
		[0, 0, 0, 0]
	);
	testInsideFormulaArray(
		[
			'\\[a\\]b$$',
			'$$a$$b$$',
		],
		[0.5, 1, 0.5, 0, 0.5],
		[0, 0, 0, 0, 0]
	);
	testInsideFormulaArray(
		[
			'$$a$$\\alpha$$g$$',
			'$$a$$\\alpha\\[g\\]',
			'\\[a\\]\\alpha$$g$$',
			'\\[a\\]\\alpha\\[g\\]',
		],
		[0.5, 1, 0.5, 0, 0.5, 1, 0.5],
		[0, 0, 0, 0, 0, 0, 0]
	);

	testInsideFormulaArray(
		[
			'$$a$$\\alpha$g$123$$g$$',
			'\\[a\\]\\alpha$g$123$$g$$',
			'$$a$$\\alpha$g$123\\[g\\]',
			'\\[a\\]\\alpha$g$123\\[g\\]',
			'$$a$$\\alpha\\(g\\)123$$g$$',
			'\\[a\\]\\alpha\\(g\\)123$$g$$',
			'$$a$$\\alpha\\(g\\)123\\[g\\]',
			'\\[a\\]\\alpha\\(g\\)123\\[g\\]',
		],
		[0.5, 1, 0.5, 0, 0  , 0, 0  , 0, 0.5, 1, 0.5],
		[0  , 0, 0  , 0, 0.5, 1, 0.5, 0, 0  , 0, 0  ]
	);
});


test('isInside$', function () {

	testInsideFormulaArray(
		[
			'\\(a\\)',
			'$a$',
		],
		[0, 0, 0]
		,
		[0.5, 1, 0.5]
	);
	testInsideFormulaArray(
		[
			'\\(a\\)b',
			'$a$b',
		],
		[0, 0, 0, 0]
		,
		[0.5, 1, 0.5, 0]
	);
	testInsideFormulaArray(
		[
			'\\(a\\)b$',
			'$a$b$',
		],
		[0, 0, 0, 0, 0]
		,
		[0.5, 1, 0.5, 0, 0.5]
	);
	testInsideFormulaArray(
		[
			'$a$\\alpha$g$',
			'$a$\\alpha\\(g\\)',
			'\\(a\\)\\alpha$g$',
			'\\(a\\)\\alpha\\(g\\)',
		],
		[0, 0, 0, 0, 0, 0, 0]
		,
		[0.5, 1, 0.5, 0, 0.5, 1, 0.5]
	);
	testInsideFormulaArray(
		[
			'$a$\\alpha$$g$$',
			'$a$\\alpha\\[g\\]',
			'\\(a\\)\\alpha$$g$$',
			'\\(a\\)\\alpha\\[g\\]',
		],
		[0, 0, 0, 0, 0.5, 1, 0.5]
		,
		[0.5, 1, 0.5, 0, 0, 0, 0]
	);

	testInsideFormulaArray(
		[
			'$a$\\alpha$$g$$123$g$',
			'\\(a\\)\\alpha$$g$$123$g$',
			'$a$\\alpha$$g$$123\\(g\\)',
			'\\(a\\)\\alpha$$g$$123\\(g\\)',
			'$a$\\alpha\\[g\\]123$g$',
			'\\(a\\)\\alpha\\[g\\]123$g$',
			'$a$\\alpha\\[g\\]123\\(g\\)',
			'\\(a\\)\\alpha\\[g\\]123\\(g\\)',
		],
		[0  , 0, 0  , 0, 0.5, 1, 0.5, 0, 0  , 0, 0  ]
		,
		[0.5, 1, 0.5, 0, 0  , 0, 0  , 0, 0.5, 1, 0.5]
	);
});

function testFormulaByIndexes(texts, indexes, formula) {
	for (var i = 0; i < texts.length; i++) {
		var nodes = new Nodes(texts[i]);
		for (var j = 0; j < indexes.length; j++) {
			assert.deepEqual(
				nodes.getFormulaByIndex(indexes[j]),
				formula,
				"" + texts[i] + "  " + indexes[j] + "  " + JSON.stringify(formula)
			);					
		}
	}

}

test('getFormulaByIndex', function () {
	testFormulaByIndexes(
		[
			'$a$',
			'\\(a\\)',
			'$a$b',
			'\\(a\\)b',
			'$a$b$',
			'\\(a\\)b$',
		],
		[0, 1, 2],
		{
			start : 0,
			end   : 2,
			type  : '$',
		}
	);
	testFormulaByIndexes(
		[
			'$a$',
			'\\(a\\)',
			'$a$b',
			'\\(a\\)b',
			'$a$b$',
			'\\(a\\)b$',
		],
		[-146, -1, 3, 4, 1337],
		null
	);
	testFormulaByIndexes(
		[
			'$a$\\alpha$g$',
			'$a$\\alpha\\(g\\)',
			'$$a$$\\alpha$g$',
			'$$a$$\\alpha\\(g\\)',
			'\\[a\\]\\alpha$g$',
			'\\[a\\]\\alpha\\(g\\)',
			'\\(a\\)\\alpha$g$',
			'\\(a\\)\\alpha\\(g\\)',
			'a\\beta\\gamma\\alpha$g$',
			'a\\beta\\gamma\\alpha\\(g\\)',
		],
		[4, 5, 6],
		{
			start : 4,
			end   : 6,
			type  : '$',
		},
	);
	testFormulaByIndexes(
		[
			'$a$\\alpha$$g$$',
			'$a$\\alpha\\[g\\]',
			'$$a$$\\alpha$$g$$',
			'$$a$$\\alpha\\[g\\]',
			'\\[a\\]\\alpha$$g$$',
			'\\[a\\]\\alpha\\[g\\]',
			'\\(a\\)\\alpha$$g$$',
			'\\(a\\)\\alpha\\[g\\]',
			'a\\beta\\gamma\\alpha$$g$$',
			'a\\beta\\gamma\\alpha\\[g\\]',
		],
		[4, 5, 6],
		{
			start : 4,
			end   : 6,
			type  : '$$',
		},
	);
	testFormulaByIndexes(
		[
			'$a$\\alpha$g\\beta_2$',
			'$a$\\alpha\\(g\\beta_2\\)',
			'$$a$$\\alpha$g\\beta_2$',
			'$$a$$\\alpha\\(g\\beta_2\\)',
			'\\(a\\)\\alpha$g\\beta_2$',
			'\\(a\\)\\alpha\\(g\\beta_2\\)',
			'\\[a\\]\\alpha$g\\beta_2$',
			'\\[a\\]\\alpha\\(g\\beta_2\\)',
			' a \\alpha$g\\beta_2$',
			' a \\alpha\\(g\\beta_2\\)',
		],
		[4, 5, 6, 7, 8, 9],
		{
			start : 4,
			end   : 9,
			type  : '$',
		}
	);
	testFormulaByIndexes(
		[
			'$a$\\alpha$$g$$123$g$',
			'$a$\\alpha$$g$$123\\(g\\)',
		],
		[8, 9, 10],
		{
			start : 8,
			end   : 10,
			type  : '$',
		}
	);
	testFormulaByIndexes(
		[
			'Some text with frac $\\frac{1}{2}$ in',
			'Some text with frac \\(\\frac{1}{2}\\) in',
		],
		[8,9,10,11,12,13,14,15,16],
		{
			start : 8,
			end   : 16,
			type  : '$',
		}
	);
	
});

test("classifyFormulaDelimiter", function () {
	var N = new Nodes('Text $\\frac{1}{2}$ with display formula $$\\frac{1}{3}$$ and \\(\\pi\\) and \\[E=mc^2\\] other text');
	assert.deepEqual(
		N.classifyFormulaDelimiter(0),
		{
			index: 0,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(-10),
		{
			index: -10,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(9000),
		{
			index: 9000,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(2),
		{
			index: 2,
			inline: true,
			display: false,
			marker: '$',
			isBegin: undefined,
			isEnd: undefined,
	},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(10),
		{
			index: 10,
			inline: true,
			display: false,
			marker: '$',
			isBegin: undefined,
			isEnd: undefined,
	},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(18),
		{
			index: 18,
			inline: false,
			display: true,
			marker: '$$',
			isBegin: undefined,
			isEnd: undefined,
	},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(26),
		{
			index: 26,
			inline: false,
			display: true,
			marker: '$$',
			isBegin: undefined,
			isEnd: undefined,
	},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(30),
		{
			index: 30,
			inline: true,
			display: false,
			marker: '\\(',
			isBegin: true,
			isEnd: false,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(32),
		{
			index: 32,
			inline: true,
			display: false,
			marker: '\\(',
			isBegin: false,
			isEnd: true,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(36),
		{
			index: 36,
			inline: false,
			display: true,
			marker: '\\[',
			isBegin: true,
			isEnd: false,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(42),
		{
			index: 42,
			inline: false,
			display: true,
			marker: '\\[',
			isBegin: false,
			isEnd: true,
		},
		""
	);

	N = new Nodes(
		"Strange formula \\begin{math}x^2\\end{math}"
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(6),
		{
			index: 7,
			inline: true,
			display: false,
			marker: 'math',
			isBegin: true,
			isEnd: false,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(13),
		{
			index: 11,
			inline: true,
			display: false,
			marker: 'math',
			isBegin: false,
			isEnd: true,
		},
		""
	);

	N = new Nodes(
		"Strange formula \\begin{equation*}x^2\\end{equation*}"
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(6),
		{
			index: 8,
			inline: false,
			display: true,
			marker: 'equation*',
			isBegin: true,
			isEnd: false,
		},
		""
	);
	assert.deepEqual(
		N.classifyFormulaDelimiter(14),
		{
			index: 12,
			inline: false,
			display: true,
			marker: 'equation*',
			isBegin: false,
			isEnd: true,
		},
		""
	);
});
