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
	var N = new Nodes('Look at\\begin {equation}\\frac{\\alpha}{\\beta}+1\\end {equation}');
	N.replaceArguments(17, 2);
	N.replaceArguments(3, 2);
	assert.deepEqual(
		N.toString(),
		'Look at\\frac{\\alpha}{\\beta}+1',
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

test('inlinizeFrac', function () {
	var N = new Nodes('\\frac{a}{b}');
	N.inlinizeFrac(0);
	assert.deepEqual(
		N.toString(),
		'{a}/{b}',
		""
	);
	var N = new Nodes('\\frac{a+1}{b}');
	N.inlinizeFrac(0);
	assert.deepEqual(
		N.toString(),
		'({a+1})/{b}',
		""
	);
	var N = new Nodes('\\frac{a}{bc}');
	N.inlinizeFrac(0);
	assert.deepEqual(
		N.toString(),
		'{a}/{bc}',
		""
	);
	var N = new Nodes('\\frac{a}{b+1}');
	N.inlinizeFrac(0);
	assert.deepEqual(
		N.toString(),
		'{a}/({b+1})',
		""
	);
	var N = new Nodes('\\frac{a}{b+1} + \\frac{a+1}{b}');
	N.inlinizeFrac(12);
	assert.deepEqual(
		N.toString(),
		'\\frac{a}{b+1} + ({a+1})/{b}',
		""
	);
});

test('pushFormulaOut', function () {
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.pushFormulaOut(1);

	assert.deepEqual(
		N.toString(),
		'$$a$$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz',
		""
	);
	N = new Nodes('abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.pushFormulaOut(23);

	assert.deepEqual(
		N.toString(),
		'abc$\\frac{1+\\alpha}{2 - \\beta}$def\nmno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz',
		""
	);
});

test('pushFirstUglyFormulaOut', function () {
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.pushFirstUglyFormulaOut(['\\frac']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz',
		""
	);
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$');
	N.pushFirstUglyFormulaOut(['\\frac','\\gamma']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz $5$',
		""
	);

	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$');
	N.pushFirstUglyFormulaOut(['\\beta']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$',
		""
	);

	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $\\gamma$');
	N.pushFirstUglyFormulaOut(['\\frac','\\gamma']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz $\\gamma$',
		""
	);
});

test('pushAllUglyFormulasOut', function () {
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz');
	N.pushAllUglyFormulasOut(['\\frac']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz',
		""
	);
	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$');
	N.pushAllUglyFormulasOut(['\\frac','\\gamma']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz $5$',
		""
	);

	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$');
	N.pushAllUglyFormulasOut(['\\beta']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $5$',
		""
	);

	var N = new Nodes('$a$ mno $\\frac{\\gamma} 4  \\varepsilon$ xyz $\\gamma$');
	N.pushAllUglyFormulasOut(['\\frac','\\gamma']);
	assert.deepEqual(
		N.toString(),
		'$a$ mno $$\\frac{\\gamma} 4  \\varepsilon$$ xyz $$\\gamma$$',
		""
	);
});

test('inlinizeFirstSubSupFrac', function () {
	var N = new Nodes('\\sum_{\\frac{1}{a+b}}^{\\frac{c+d}{a-b}}');
	N.inlinizeFirstSubSupFrac();
	assert.deepEqual(
		N.toString(),
		'\\sum_{{1}/({a+b})}^{\\frac{c+d}{a-b}}',
		""
	);
});

test('inlinizeAllSubSupFracs', function () {
	var N = new Nodes('\\sum_{\\frac{1}{a+b}}^{\\frac{c+d}{a-b}}');
	N.inlinizeAllSubSupFracs();
	assert.deepEqual(
		N.toString(),
		'\\sum_{{1}/({a+b})}^{({c+d})/({a-b})}',
		""
	);
});

test('forceInputencs', function () {
	var N = new Nodes('');
	N.forceInputencs('cp1251');
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	var N = new Nodes('\\alpha\\frac{\\pi}{2}');
	N.forceInputencs();
	assert.deepEqual(
		N.toString(),
		'\\alpha\\frac{\\pi}{2}',
		""
	);

	var N = new Nodes('\\usepackage[cp1251]{inputenc}');
	N.forceInputencs('cp1251');
	assert.deepEqual(
		N.toString(),
		'\\usepackage[cp1251]{inputenc}',
		""
	);

	var N = new Nodes('\\usepackage [ cp1251 ] {inputenc}');
	N.forceInputencs('cp1251');
	assert.deepEqual(
		N.toString(),
		'\\usepackage[cp1251] {inputenc}',
		""
	);

	var N = new Nodes('\\usepackage[cp1251]{inputenc}');
	N.forceInputencs('cp866');
	assert.deepEqual(
		N.toString(),
		'\\usepackage[cp866]{inputenc}',
		""
	);

	var N = new Nodes('\\begin{document}\\usepackage[cp1251]{inputenc}');
	N.forceInputencs('utf8');
	assert.deepEqual(
		N.toString(),
		'\\begin{document}\\usepackage[utf8]{inputenc}',
		""
	);



	var N = new Nodes('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsthm}\n\\usepackage[cp866]{inputenc}');
	N.forceInputencs('utf8');
	assert.deepEqual(
		N.toString(),
		'\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[utf8]{inputenc}\\usepackage{amsthm}\n\\usepackage[utf8]{inputenc}',
		""
	);

	var N = new Nodes('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsthm}\n\\usepackage[cp866]{inputenc}');
	N.forceInputencs('cp1251');
	assert.deepEqual(
		N.toString(),
		'\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsthm}\n\\usepackage[cp1251]{inputenc}',
		""
	);
});

test('correctSubunicodeArtifact', function () {

	var N = new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой');
	N.correctSubunicodeArtifact(5);
	assert.deepEqual(
		N.toString(),
		'в плоскости $\\mathbb{R}^{2}  $  с преградой',
		""
	);

	var N = new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой $$x\\in \\mbox{^^d0^^121}^{2} \\l,\\, \\, t>0;\\eqno(1) $$');
	N.correctSubunicodeArtifact(5);
	assert.deepEqual(
		N.toString(),
		'в плоскости $\\mathbb{R}^{2}  $  с преградой $$x\\in \\mbox{^^d0^^121}^{2} \\l,\\, \\, t>0;\\eqno(1) $$',
		""
	);

	var N = new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой $$x\\in \\mbox{^^d0^^121}^{2} \\l,\\, \\, t>0;\\eqno(1) $$');
	N.correctSubunicodeArtifact(30);
	assert.deepEqual(
		N.toString(),
		'в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой $$x\\in \\mathbb{R}^{2} \\l,\\, \\, t>0;\\eqno(1) $$',
		""
	);

	var N = new Nodes('$$\\mbox{^^d0^^120}q_{1}^{1} (x_{1} ,t)\\in C_{x_{1} ,t}^{2,1} ((-1,1),\\lbrack 0;\\infty )), $$');
	N.correctSubunicodeArtifact(1);
	assert.deepEqual(
		N.toString(),
		'$$q_{1}^{1} (x_{1} ,t)\\in C_{x_{1} ,t}^{2,1} ((-1,1),\\lbrack 0;\\infty )), $$',
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
