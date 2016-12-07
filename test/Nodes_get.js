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
