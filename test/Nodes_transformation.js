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
