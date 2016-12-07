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
