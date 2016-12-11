QUnit.module("Nodes_edit");

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
		'\\frac{1}{2}3[5]%\n%',
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
		'%',
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

test('removeTrivialComments', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]% \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%\n%line\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123 a b c');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n123 a b c',
		""
	);

	N = new Nodes('%');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('% ');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('%\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('% \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('Текст\ntext % another text');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext % another text',
		""
	);

	N = new Nodes('Текст\ntext % another text\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext % another text\n',
		""
	);
});


/*

test('', function () {
	var N = new Nodes('');
	N.();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

});

*/
