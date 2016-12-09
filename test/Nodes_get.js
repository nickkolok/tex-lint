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
		0,
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
		0,
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

test('getNonseparated$$Numbers', function () {
	assert.deepEqual(
		new Nodes('$$').getNonseparated$$Numbers(),
		[],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$ text text text').getNonseparated$$Numbers(),
		[2,16],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma $$ text text text').getNonseparated$$Numbers(),
		[18],
		""
	);
	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$ text text text').getNonseparated$$Numbers(),
		[2,17],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$\n text text text').getNonseparated$$Numbers(),
		[2,16],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$\n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\n$$\n').getNonseparated$$Numbers(),
		[],
		""
	);

	assert.deepEqual(
		new Nodes('1 $$ 2 $$\n 3').getNonseparated$$Numbers(),
		[2, 6],
		""
	);
});

test('isGoodOpening$', function () {
	assert.deepEqual(
		new Nodes('$12$').isGoodOpening$(0),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a$12$').isGoodOpening$(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a $12$').isGoodOpening$(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('a c$12$').isGoodOpening$(3),
		false,
		""
	);
});

test('isGoodClosing$', function () {
	assert.deepEqual(
		new Nodes('$12$ \nb').isGoodClosing$(2),
		true,
		""
	);
});

test('count$SeparationErrors', function () {
	assert.deepEqual(
		new Nodes('$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a $12$').count$SeparationErrors(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('$12$b').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b').count$SeparationErrors(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('$12$\n b').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ \nb').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a\n$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b \n$333$c d\n$4$').count$SeparationErrors(),
		2,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b \n$333$ $67$ c d\n$4$').count$SeparationErrors(),
		4,
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
