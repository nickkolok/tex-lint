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
	assert.deepEqual(
		new Nodes('$a$').isInside$(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInside$(3),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInside$(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInside$(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b$').isInside$(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g$').isInside$(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$').isInside$(5, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$123$g$').isInside$(9, true),
		true,
		""
	);

});

test('isInsideFormula', function () {
	assert.deepEqual(
		new Nodes('$a$').isInsideFormula(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideFormula(3),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideFormula(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideFormula(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideFormula(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b$').isInsideFormula(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g$').isInsideFormula(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$').isInsideFormula(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$123$g$').isInsideFormula(9, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$').isInsideFormula(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInsideFormula(3),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInsideFormula(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInsideFormula(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b$$').isInsideFormula(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$$g$$').isInsideFormula(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInsideFormula(9, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInsideFormula(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInsideFormula(5),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInsideFormula(3),
		false,
		""
	);

});

test('getFormulaByIndex', function () {
	assert.deepEqual(
		new Nodes('$a$').getFormulaByIndex(1),
		{
			start : 0,
			end   : 2,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').getFormulaByIndex(3),
		null,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').getFormulaByIndex(2),
		{
			start: 0,
			end: 2,
			type: '$'
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').getFormulaByIndex(3),
		null,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b$').getFormulaByIndex(3),
		null,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g$').getFormulaByIndex(5),
		{
			start : 4,
			end   : 6,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$').getFormulaByIndex(5),
		{
			start : 4,
			end   : 6,
			type  : '$$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g\\beta_2$').getFormulaByIndex(5),
		{
			start : 4,
			end   : 9,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g\\beta_2$').getFormulaByIndex(4),
		{
			start : 4,
			end   : 9,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g\\beta_2$').getFormulaByIndex(9),
		{
			start : 4,
			end   : 9,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$').getFormulaByIndex(6),
		{
			start: 4,
			end: 6,
			type: '$$'
		},
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$123$g$').getFormulaByIndex(9),
		{
			start : 8,
			end   : 10,
			type  : '$',
		},
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').getFormulaByIndex(8),
		{
			start : 8,
			end   : 16,
			type  : '$',
		},
		""
	);
	
});

