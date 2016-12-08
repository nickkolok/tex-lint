QUnit.module("Nodes_get");

test("getBraceGroup", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');

	assert.deepEqual(
		N.getBraceGroup(1, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY).nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
		],
		""
	);

	assert.deepEqual(
		N.getBraceGroup(4, Nodes.LEFT_CURLY, Nodes.RIGHT_CURLY).nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test("getSubnodes", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.getSubnodes(4, 5).nodes,
		[
			{ text: '{', type: 'bracket' },
		],
		""
	);

	assert.deepEqual(
		N.getSubnodes(4, 7).nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test("getGroupOrSingle", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.getGroupOrSingle(4).nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
		],
		""
	);

	assert.deepEqual(
		N.getGroupOrSingle(5).nodes,
		[
			{ text: '2', type: 'number' },
		],
		""
	);

	assert.deepEqual(
		N.getGroupOrSingle(0).nodes,
		[
			{ text: '\\frac', type: 'tag' },
		],
		""
	);

	assert.deepEqual(
		N.getGroupOrSingle(6).nodes,
		[
		],
		""
	);

	assert.deepEqual(
		N.getGroupOrSingle(8).nodes,
		[
			{ text: '[', type: 'bracket' },
			{ text: '5', type: 'number' },
			{ text: ']', type: 'bracket' },
		],
		""
	);
});

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

test("getArguments", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');

	assert.deepEqual(
		N.getArguments(1, 1),
		[
			new Nodes('{1}'),
		],
		""
	);

	assert.deepEqual(
		N.getArguments(1, 2),
		[
			new Nodes('{1}'),
			new Nodes('{2}'),
		],
		""
	);

	assert.deepEqual(
		N.getArguments(1, 3),
		[
			new Nodes('{1}'),
			new Nodes('{2}'),
			new Nodes('3'),
		],
		""
	);

	assert.deepEqual(
		N.getArguments(1, 4),
		[
			new Nodes('{1}'),
			new Nodes('{2}'),
			new Nodes('3'),
			new Nodes('[5]'),
		],
		""
	);
});

test("getNodesNumbers", function () {
	var N = new Nodes('Some text with frac $\\frac{a}{b}+\\frac{1+\\alpha}{2-\\beta}+\\frac{1+C_0}{2}$ in it.');
	assert.deepEqual(
		N.getNodesNumbers('keyword', '$'),
		[ 8, 40, ],
		""
	);

});

test('getWithArguments', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');

	assert.deepEqual(
		N.getWithArguments(0, 3).nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '3', type: 'number' },
		],
		""
	);

	N = new Nodes('\\frac   \n 1 2');
	assert.deepEqual(
		N.getWithArguments(0, 2).nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '   ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' },
		],
		""
	);
});

test('slice', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	var copy = N.slice();
	N.nodes.splice(1, 3);
	assert.deepEqual(
		copy.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '3', type: 'number' },
			{ text: '[', type: 'bracket' },
			{ text: '5', type: 'number' },
			{ text: ']', type: 'bracket' },
		],
		""
	);
});

test('getNontrivialCommentsQuantity', function () {
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]% \n').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n%').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').getNontrivialCommentsQuantity(),
		2,
		""
	);
	assert.deepEqual(
		new Nodes('%').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('Текст\ntext % another text').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('Текст\ntext % another text\n').getNontrivialCommentsQuantity(),
		1,
		""
	);

});


/*

test('', function () {
	var N = new Nodes('');
	assert.deepEqual(
		N.,
		1,
		""
	);

});

*/
