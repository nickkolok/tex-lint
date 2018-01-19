QUnit.module("Nodes_get_formula");


test('isInside$$', function () {
	assert.deepEqual(
		new Nodes('$$a$$').isInside$$(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInside$$(3),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInside$$(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b').isInside$$(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$b$$').isInside$$(3, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$$g$$').isInside$$(5, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInside$$(9, true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInside$$(5, true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$$a$$\\alpha$g$123$$g$$').isInside$$(5),
		false,
		""
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

