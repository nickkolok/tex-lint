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
