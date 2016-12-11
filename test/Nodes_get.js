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
	var N = new Nodes('$a$\\alpha$g$');
	assert.deepEqual(
		N.getNodesNumbers('keyword', '$'),
		[ 0, 2, 4, 6, ],
		""
	);
	var N = new Nodes('_');
	assert.deepEqual(
		N.getNodesNumbers('tag', '_'),
		[ 0, ],
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

test('isInsideSymmDelimiters', function () {
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(1, 'keyword', '$'),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideSymmDelimiters(3, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideSymmDelimiters(2, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b').isInsideSymmDelimiters(3, 'keyword', '$', true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$b$').isInsideSymmDelimiters(3, 'keyword', '$', true),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$g$').isInsideSymmDelimiters(5, 'keyword', '$', true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$\\alpha$$g$$123$g$').isInsideSymmDelimiters(9, 'keyword', '$', true),
		true,
		""
	);

});

test('getSymmDelimitedTagNumbers', function () {
	assert.deepEqual(
		new Nodes('$\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu']),
		[1, ],
		""
	);
	assert.deepEqual(
		new Nodes('$\\mu\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu']),
		[1, 2, ],
		""
	);
	assert.deepEqual(
		new Nodes('$\\nu\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu']),
		[2, ],
		""
	);
	assert.deepEqual(
		new Nodes('$\\mu\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu','\\nu']),
		[1, 2, ],
		""
	);
	assert.deepEqual(
		new Nodes('$\\mu\\nu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu','\\nu']),
		[1, 2, ],
		""
	);
	assert.deepEqual(
		new Nodes('$\\mu\\mu$\\mu$\\nu^2\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu','\\nu']),
		[1, 2, 6, 9, ],
		""
	);
	assert.deepEqual(
		new Nodes('$$\\mu\\mu$$\\mu$\\nu^2\\mu$').getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\mu','\\nu']),
		[6, 9, ],
		""
	);
});

test('getChildrenInTagsArguments', function () {
	assert.deepEqual(
		new Nodes('').getChildrenInTagsArguments(['_'], ['\\frac'], 1),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('_').getChildrenInTagsArguments(['_'], ['\\frac'], 1),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('_\\frac').getChildrenInTagsArguments(['_'], ['\\frac'], 1),
		[1],
		""
	);
	assert.deepEqual(
		new Nodes('_\\beta\\frac{1}{2}').getChildrenInTagsArguments(['_'], ['\\frac'], 1),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('_\\beta\\frac{1}{2} \\sum_{a = \\frac{1}{2}}^{\\frac{3}{4}}').getChildrenInTagsArguments(['_', '^'], ['\\frac'], 1),
		[17, 27],
		""
	);
	assert.deepEqual(
		new Nodes('\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}').getChildrenInTagsArguments(['_'], ['\\frac'], 1),
		[3],
		""
	);


});
test('getTagsArrayNumbers', function () {
	assert.deepEqual(
		new Nodes('_').getTagsArrayNumbers(['_']),
		[0],
		""
	);

});

/*

test('', function () {
	assert.deepEqual(
		new Nodes('').(),
		1,
		""
	);

});

*/
