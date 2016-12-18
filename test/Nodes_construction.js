QUnit.module("Nodes_construction");

test("frac and numbers", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');

	assert.deepEqual(
		N.nodes,
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

test("frac and numbers", function () {
	var N = new Nodes('\\frac12 34');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '12', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '34', type: 'number' },
		],
		""
	);
});

test("number between spaces", function () {
	var N = new Nodes(' 12 ');

	assert.deepEqual(
		N.nodes,
		[
			{ text: ' ', type: 'space' },
			{ text: '12', type: 'number' },
			{ text: ' ', type: 'space' },
		],
		""
	);
});

test("frac, numbers, spaces and linebreak", function () {
	var N = new Nodes('\\frac   \n 1 2');

	assert.deepEqual(
		N.nodes,
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

test("cyrillic text", function () {
	var N = new Nodes('Текст   \n на русском языке!');

	assert.deepEqual(
		N.nodes,
		[
			{ text: 'Текст', type: 'cyrtext' },
			{ text: '   ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: 'на', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'русском', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'языке', type: 'cyrtext' },
			{ text: '!', type: null },
		],
		""
	);
});

test("single comment", function () {
	var N = new Nodes('%\n');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '%', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);

	N = new Nodes('%smth\n');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '%smth', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);

	N = new Nodes('%smth');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '%smth', type: 'comment' },
		],
		""
	);

	N = new Nodes('%%');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '%%', type: 'comment' },
		],
		""
	);


	N = new Nodes('%\\smth');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '%\\smth', type: 'comment' },
		],
		""
	);
});

test("single linebreak", function () {
	var N = new Nodes('\n');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});

test("text with fracs", function () {
	var N = new Nodes('Some text with frac $\\frac{a}{b}+\\frac{1+\\alpha}{2-\\beta}+\\frac{1+C_0}{2}$ in it.');

	assert.deepEqual(
		N.nodes,
		[
			{ text: 'Some', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'text', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'with', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'frac', type: null },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'a', type: 'variable-2' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: 'b', type: 'variable-2' },
			{ text: '}', type: 'bracket' },
			{ text: '+', type: null },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '+', type: null },
			{ text: '\\alpha', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '-', type: null },
			{ text: '\\beta', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: '+', type: null },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '+', type: null },
			{ text: 'C', type: 'variable-2' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: 'in', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'it', type: null },
			{ text: '.', type: null },
		],
		""
	);
});

test('sfrac with \\alpha and \\beta', function () {
	var N = new Nodes('\\frac{1+\\alpha}{2 - \\beta}');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '+', type: null },
			{ text: '\\alpha', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '-', type: null },
			{ text: ' ', type: 'space' },
			{ text: '\\beta', type: 'tag' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test('\\alpha 2 \\beta', function () {
	var N = new Nodes('\\alpha 2 \\beta');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\alpha', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\beta', type: 'tag' },
		],
		""
	);
});

test('with comments', function () {
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').nodes,
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
			{ text: '%', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]% \n').nodes,
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
			{ text: '%', type: 'comment' },
			{ text: ' ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});


test('$$', function () {
	var N = new Nodes('$$');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '$$', type: 'keyword' },
		],
		""
	);

	var N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$ text text text');

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\alpha', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '$$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '\\cdot', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '\\gamma', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '$$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: 'text', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'text', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'text', type: null },
		],
		""
	);
});

test('a$12$', function () {
	assert.deepEqual(
		new Nodes('a$12$').nodes,
		[
			{ text: 'a', type: null },
			{ text: '$', type: 'keyword' },
			{ text: '12', type: 'number' },
			{ text: '$', type: 'keyword' },
		],
		""
	);
});

test('$12$ \nb', function () {
	assert.deepEqual(
		new Nodes('$12$ \nb').nodes,
		[
			{ text: '$', type: 'keyword' },
			{ text: '12', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'b', type: null },
		],
		""
	);
});

test('$$12 \\eqno (1)$$ \nb', function () {
	assert.deepEqual(
		new Nodes('$$12 \\eqno (1)$$ \nb').nodes,
		[
			{ text: '$$', type: 'keyword' },
			{ text: '12', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\eqno', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '(', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: ')', type: 'bracket' },
			{ text: '$$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'b', type: null },
		],
		""
	);
});

test('unwrap', function () {
	assert.deepEqual(
		new Nodes('{\n{\n123 456\n789\n}}').nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '{', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '123', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '456', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '789', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '}', type: 'bracket' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('{}').nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test('\\frac{a}{b+1} + \\frac{a+1}{b}', function () {
	assert.deepEqual(
		new Nodes('\\frac{a}{b+1} + \\frac{a+1}{b}').nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'a', type: null },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: 'b', type: null },
			{ text: '+', type: null },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '+', type: null },
			{ text: ' ', type: 'space' },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'a', type: null },
			{ text: '+', type: null },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: 'b', type: null },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});
test('-1', function () {
	assert.deepEqual(
		new Nodes('-1').nodes,
		[
			{ text: '-', type: null },
			{ text: '1', type: 'number' },
		],
		""
	);
});
test('$-1$', function () {
	assert.deepEqual(
		new Nodes('$-1$').nodes,
		[
			{ text: '$', type: 'keyword' },
			{ text: '-', type: null },
			{ text: '1', type: 'number' },
			{ text: '$', type: 'keyword' },
		],
		""
	);
});
test('space', function () {
	assert.deepEqual(
		new Nodes(' ').nodes,
		[
			{ text: ' ', type: 'space' },
		],
		""
	);
});

test('$a$\\alpha$g$', function () {
	assert.deepEqual(
		new Nodes('$a$\\alpha$g$').nodes,
		[
			{ text: '$', type: 'keyword' },
			{ text: 'a', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: '\\alpha', type: 'tag' },
			{ text: '$', type: 'keyword' },
			{ text: 'g', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
		],
		""
	);
});

test('_', function () {
	assert.deepEqual(
		new Nodes('_').nodes,
		[
			{ text: '_', type: 'tag' },
		],
		""
	);
});

test('double linebreak', function () {
	assert.deepEqual(
		new Nodes('\n\n\\alpha').nodes,
		[
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\alpha', type: 'tag' },
		],
		""
	);
});

/*

test('', function () {
	assert.deepEqual(
		new Nodes('').nodes,
		[
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});

*/
