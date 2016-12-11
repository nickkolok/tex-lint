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

test('replaceArguments', function () {
	var N = new Nodes('2\\frac{\\alpha}{\\beta}+1');
	N.replaceArguments(1, 3, new Nodes('\\alpha/\\beta'));
	assert.deepEqual(
		N.toString(),
		'2\\alpha/\\beta+1',
		""
	);
	var N = new Nodes('2\\frac{\\alpha}\n{\\beta}+1');
	N.replaceArguments(1, 3, new Nodes('\\alpha/\\beta'));
	assert.deepEqual(
		N.toString(),
		'2\\alpha/\\beta+1',
		""
	);
	var N = new Nodes('2\\frac\n\n{ \\alpha} \n {\\beta}+1');
	N.replaceArguments(1, 3, new Nodes('\\alpha/\\beta'));
	assert.deepEqual(
		N.toString(),
		'2\\alpha/\\beta+1',
		""
	);
	var N = new Nodes('Look at\\begin{equation}\\frac{\\alpha}{\\beta}+1\\end{equation}');
	N.replaceArguments(16, 2, new Nodes('$$'));
	N.replaceArguments(3, 2, new Nodes('$$'));
	assert.deepEqual(
		N.toString(),
		'Look at$$\\frac{\\alpha}{\\beta}+1$$',
		""
	);
	var N = new Nodes('Look at\\begin {equation}\\frac{\\alpha}{\\beta}+1\\end {equation}');
	N.replaceArguments(17, 2, new Nodes('$$'));
	N.replaceArguments(3, 2, new Nodes('$$'));
	assert.deepEqual(
		N.toString(),
		'Look at$$\\frac{\\alpha}{\\beta}+1$$',
		""
	);


});

test('renewEnvironment', function () {
	var N = new Nodes('Look at\\begin {equation}\\frac{\\alpha}{\\beta}+1\\end {equation}qq');
	N.renewEnvironment(3, new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\frac{\\alpha}{\\beta}+1$$%end\nqq',
		""
	);
	var N = new Nodes('Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq');
	N.renewEnvironment(3, new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq',
		""
	);

});

test('renewAllEnvironments', function () {
	var N = new Nodes('Look at\\begin {equation}\\frac{\\alpha}{\\beta}+1\\end {equation}qq');
	N.renewAllEnvironments(['equation'], new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\frac{\\alpha}{\\beta}+1$$%end\nqq',
		""
	);
	var N = new Nodes('Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq');
	N.renewAllEnvironments(['equation'], new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq',
		""
	);
	var N = new Nodes(
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq' +
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq'
	);
	N.renewAllEnvironments(['equation'], new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq' +
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq',
		""
	);
	var N = new Nodes(
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq' +
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq' +
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq'
	);
	N.renewAllEnvironments(['equation'], new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq' +
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq' +
		'Look at$$%begin\n\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} $$%end\nqq',
		""
	);
	var N = new Nodes(
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq' +
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq' +
		'Look at\\begin {equation}\\begin{array}{c|c}\\alpha & \\beta \\+1 & 0 \\end{array} \\end {equation}qq'
	);
	N.renewAllEnvironments(['equation','array'], new Nodes('$$%begin\n'), new Nodes('$$%end\n'));
	assert.deepEqual(
		N.toString(),
		'Look at$$%begin\n$$%begin\n{c|c}\\alpha & \\beta \\+1 & 0 $$%end\n $$%end\nqq' +
		'Look at$$%begin\n$$%begin\n{c|c}\\alpha & \\beta \\+1 & 0 $$%end\n $$%end\nqq' +
		'Look at$$%begin\n$$%begin\n{c|c}\\alpha & \\beta \\+1 & 0 $$%end\n $$%end\nqq',
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
