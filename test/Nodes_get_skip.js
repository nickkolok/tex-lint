QUnit.module("Nodes_get");

test("skipTypes", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipTypes(1,['space']),
		1,
		""
	);

	assert.deepEqual(
		N.skipTypes(1,['space','linebreak']),
		1,
		""
	);

	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.skipTypes(1,['space']),
		2,
		""
	);

	assert.deepEqual(
		N.skipTypes(1,['space','linebreak']),
		4,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipTypes(12,['space']),
		12,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipTypes(14,['space']),
		14,
		""
	);

});

test("skipTypesReverse", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipTypesReverse(1,['space']),
		1,
		""
	);

	assert.deepEqual(
		N.skipTypesReverse(1,['space','linebreak']),
		1,
		""
	);

	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.skipTypesReverse(1,['space']),
		0,
		""
	);

	assert.deepEqual(
		N.skipTypesReverse(3,['space','linebreak']),
		0,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipTypesReverse(12,['space']),
		12,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipTypesReverse(14,['space']),
		14,
		""
	);

});


test("skipToType(s)", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipToTypes(1,['space']),
		11,
		""
	);

	assert.deepEqual(
		N.skipToTypes(1,['space','linebreak']),
		11,
		""
	);

	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipToType(1, 'space'),
		11,
		""
	);

	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipToType(1, 'linebreak'),
		11,
		""
	);


	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.skipToTypes(0,['space']),
		1,
		""
	);
	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.skipToType(0, 'space'),
		1,
		""
	);


	assert.deepEqual(
		N.skipToTypes(2,['space']),
		3,
		""
	);
	assert.deepEqual(
		N.skipToType(2, 'space'),
		3,
		""
	);
	assert.deepEqual(
		N.skipToTypes(2,['space','linebreak']),
		2,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypes(0,['number']),
		2,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToType(0, 'number'),
		2,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipToTypes(4,['linebreak']),
		12,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipToType(4, 'linebreak'),
		12,
		""
	);
});

test("skipToType(s)Reverse", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.skipToTypesReverse(1,['space']),
		-1,
		""
	);
	assert.deepEqual(
		N.skipToTypeReverse(1, 'space'),
		-1,
		""
	);

	assert.deepEqual(
		N.skipToTypesReverse(1,['space','linebreak']),
		-1,
		""
	);
	assert.deepEqual(
		N.skipToTypeReverse(1, 'linebreak'),
		-1,
		""
	);

	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.skipToTypesReverse(2,['space']),
		1,
		""
	);
	assert.deepEqual(
		N.skipToTypeReverse(2, 'space'),
		1,
		""
	);
	assert.deepEqual(
		N.skipToTypesReverse(2,['space','linebreak']),
		2,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypesReverse(12,['space']),
		-1,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypeReverse(12, 'space'),
		-1,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypesReverse(12,['number']),
		9,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypeReverse(12, 'number'),
		9,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').skipToTypesReverse(12,['number','bracket']),
		10,
		""
	);

	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipToTypesReverse(14,['tag']),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').skipToTypeReverse(14, 'tag'),
		0,
		""
	);

});
