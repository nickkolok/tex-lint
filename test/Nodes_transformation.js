QUnit.module("Nodes_get");

test('inlinizeAllFracs', function () {
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.inlinizeAllFracs();

	assert.deepEqual(
		N.toString(),
		'$a$ mno $ {\\gamma}/4   \\varepsilon$ xyz',
		""
	);

	N = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def');
	N.inlinizeAllFracs();

	assert.deepEqual(
		N.toString(),
		'abc$ ({1+\\alpha})/({2 - \\beta}) $def',
		""
	);

	N = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.inlinizeAllFracs();

	assert.deepEqual(
		N.toString(),
		'abc$ ({1+\\alpha})/({2 - \\beta}) $def\nmno $ {\\gamma}/4   \\varepsilon$ xyz',
		""
	);
});

test('groupInlineFormulas', function () {

	var N = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.groupInlineFormulas();

	assert.deepEqual(
		N.toString(),
		'abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz',
		""
	);

	assert.deepEqual(
		N.nodes,
		[
			{ text: 'abc', type: null },
			{ text: '$\\frac{1+\\alpha}{2 - \\beta}$', type: 'inlineformula' },
			{ text: 'def', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: 'mno', type: null },
			{ text: ' ', type: 'space' },
			{ text: '$\\frac{\\gamma} 4  \\varepsilon$', type: 'inlineformula' },
			{ text: ' ', type: 'space' },
			{ text: 'xyz', type: null },
		],
		""
	);
});

test('insertSubnodes', function () {
	var Nodes9 = new Nodes('\\alpha 2 \\beta');
	var Nodes10 = new Nodes('\\gamma 4 \\varepsilon');
	Nodes9.insertSubnodes(2, Nodes10);
	assert.deepEqual(
		Nodes9.nodes,
		[
			{ text: '\\alpha', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '\\gamma', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '4', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\varepsilon', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\beta', type: 'tag' },
		],
		""
	);

});

test('nodes-splice', function () {
	var N = new Nodes('\\frac{1+\\alpha}{2 - \\beta}');
	N.nodes.splice(8,3);
	assert.deepEqual(
		N.toString(),
		'\\frac{1+\\alpha}{2\\beta}',
		""
	);

});

test('reparse', function () {

	var N = new Nodes('\\frac   \n 1 2');
	N.nodes[2].text = '\\alpha 2 \\beta';

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '   ', type: 'space' },
			{ text: '\\alpha 2 \\beta', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' }
		],
		""
	);

	N.reparse();

	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '   ', type: 'space' },
			{ text: '\\alpha', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\beta', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' }],
		""
	);
});


test('removeNontrivialComments', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]% \n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]% \n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123 a b c');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]123 a b c',
		""
	);

	N = new Nodes('%');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('Текст\ntext % another text');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext ',
		""
	);

	N = new Nodes('Текст\ntext % another text\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext ',
		""
	);
});

test('separate$$', function () {
	var N;

	N = new Nodes('$$');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'$$',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma $$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text',
		""
	);

	N = new Nodes('\n$$\n');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\n$$\n',
		""
	);

	N = new Nodes('1$$2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1\n$$\n2',
		""
	);

	N = new Nodes('1 $$2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n2',
		""
	);

	N = new Nodes('1 $$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$\n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n $$ \n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n $$ \n 2',
		""
	);

	N = new Nodes('1 \n $$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n $$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 $$\n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 $$ 2 $$\n 3');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2 \n$$\n 3',
		"'1 $$ 2 $$\\n 3'"
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
