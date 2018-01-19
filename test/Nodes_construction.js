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
			{ text: '% ', type: 'comment' },
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

test('', function () {
	assert.deepEqual(
		new Nodes('in it.  %comment\n\n % Line-long comment\n\n%%%%%%%%%%%%%%%%%%%%%%%%%\n%%% EVIL COMMENT\n%%%%%%%%%%%%%%%%%%%%%%%%%\n\n\\begin{equation}\\label{eq1}\nE=mc^2\n\\end{equation}\nто есть энергия есть масса (см. \\cite{Einstein}).\n\n$$E=mc^2$$\n\nЗдесь и далее полагаем ').nodes,
		[
			{ text: 'in', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'it', type: null },
			{ text: '.', type: null },
			{ text: '  ', type: 'space' },
			{ text: '%comment', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: '% Line-long comment', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: '%%%%%%%%%%%%%%%%%%%%%%%%%', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
			{ text: '%%% EVIL COMMENT', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
			{ text: '%%%%%%%%%%%%%%%%%%%%%%%%%', type: 'comment' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\begin', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\\label', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'eq1', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'E', type: null },
			{ text: '=mc', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\end', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'то', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'есть', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'энергия', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'есть', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'масса', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '(', type: null },
			{ text: 'см', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: ' ', type: 'space' },
			{ text: '\\cite', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'Einstein', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: ')', type: null },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: '$$', type: 'keyword' },
			{ text: 'E', type: 'variable-2' },
			{ text: '=', type: null },
			{ text: 'mc', type: 'variable-2' },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'Здесь', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'и', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'далее', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'полагаем', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
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

test('spaces and $s', function () {
	assert.deepEqual(
		new Nodes(' $ \\alpha $ ').nodes,
		[
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\\alpha', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
		],
		""
	);
});

test('\\begin{document}\\usepackage [ utf8 ] {inputenc}', function () {
	assert.deepEqual(
		new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc}').nodes,
		[
			{ text: '\\begin', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'document', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\\usepackage', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '[', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: 'utf', type: null },
			{ text: '8', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: ']', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '{', type: 'bracket' },
			{ text: 'inputenc', type: null }, // TODO: ?!
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsmath}', function () {
	assert.deepEqual(
		new Nodes('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsmath}').nodes,
		[
			{ text: '\\begin', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'document', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\usepackage', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'amsmath', type: null },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\usepackage', type: 'tag' },
			{ text: '[', type: 'bracket' },
			{ text: 'cp', type: null },
			{ text: '1251', type: 'number' },
			{ text: ']', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: 'inputenc', type: null },
			{ text: '}', type: 'bracket' },
			{ text: '\\usepackage', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'amsmath', type: null },
			{ text: '}', type: 'bracket' },
		],
		""
	);
});

test('[utf8]', function () {
	assert.deepEqual(
		new Nodes('[utf8]').nodes,
		[
			{ text: '[', type: 'bracket' },
			{ text: 'utf', type: null },
			{ text: '8', type: 'number' },
			{ text: ']', type: 'bracket' },
		],
		""
	);
});

test('baselineskip=18pt', function () {
	assert.deepEqual(
		new Nodes('\\baselineskip=18pt').nodes,
		[
			{ text: '\\baselineskip', type: 'tag' },
			{ text: '=18pt', type: null },
		],
		""
	);
});

test('в плоскости $mbox{^^d0^^121}^{2}  $  с преградой', function () {
	assert.deepEqual(
		new Nodes('в плоскости $mbox{^^d0^^121}^{2}  $  с преградой').nodes,
		[
			{ text: 'в', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'плоскости', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'mbox', type: 'variable-2' },
			{ text: '{', type: 'bracket' },
			{ text: '^', type: 'tag' },
			{ text: '^', type: 'tag' },
			{ text: 'd', type: 'variable-2' },
			{ text: '0', type: 'number' },
			{ text: '^', type: 'tag' },
			{ text: '^', type: 'tag' },
			{ text: '121', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '^', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '  ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '  ', type: 'space' },
			{ text: 'с', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'преградой', type: 'cyrtext' },
		],
		""
	);
});

test('а', function () {
	assert.deepEqual(
		new Nodes('а').nodes,
		[
			{ text: 'а', type: 'cyrtext' },
		],
		""
	);
});

test('абв', function () {
	assert.deepEqual(
		new Nodes('абв').nodes,
		[
			{ text: 'абв', type: 'cyrtext' },
		],
		""
	);
});

test('comma btw words', function () {
	assert.deepEqual(
		new Nodes('Найти проекции скорости точки $M$ на оси цилиндрической системы координат,уравнения движения точки $M_{1 } $,\n\tописывающей годограф скорости, и проекции скорости точки $M_{1 } $.\n').nodes,
		[
			{ text: 'Найти', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'проекции', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'скорости', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'точки', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'M', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: 'на', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'оси', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'цилиндрической', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'системы', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'координат', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: 'уравнения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'движения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'точки', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'M', type: 'variable-2' },
			{ text: '_', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: 'описывающей', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'годограф', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'скорости', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'и', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'проекции', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'скорости', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'точки', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'M', type: 'variable-2' },
			{ text: '_', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('координат,уравнения').nodes,
		[
			{ text: 'координат', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: 'уравнения', type: 'cyrtext' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('$a,b$').nodes,
		[
			{ text: '$', type: 'keyword' },
			{ text: 'a', type: 'variable-2' },
			{ text: ',', type: null },
			{ text: 'b', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
		],
		""
	);
});

test('a $a+ b=c$ b', function () {
	assert.deepEqual(
		new Nodes('a $a+ b=c$ b').nodes,
		[
			{ text: 'a', type: null },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'a', type: 'variable-2' },
			{ text: '+', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'b', type: 'variable-2' },
			{ text: '=', type: null },
			{ text: 'c', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: 'b', type: null },
		],
		""
	);
});

test('Atomic \\label', function () {
	assert.deepEqual(
		new Nodes('\\begin{equation}\\label{label with spaces}\n	u^2+2\\nu k^2u-Agk=0\n\\end{equation}\n').nodes,
		[
			{ text: '\\begin', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\\label', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'label', type: 'variable' },
			{ text: ' ', type: 'space' },
			{ text: 'with', type: 'variable' },
			{ text: ' ', type: 'space' },
			{ text: 'spaces', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: 'u', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '+', type: null },
			{ text: '2', type: 'number' },
			{ text: '\\nu', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: 'k', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: 'u-Agk', type: null },
			{ text: '=', type: null },
			{ text: '0', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\end', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{equation}\\label{labelwithoutspaces}\n	u^2+2\\nu k^2u-Agk=0\n\\end{equation}\n').nodes,
		[
			{ text: '\\begin', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\\label', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'labelwithoutspaces', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: 'u', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '+', type: null },
			{ text: '2', type: 'number' },
			{ text: '\\nu', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: 'k', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: 'u-Agk', type: null },
			{ text: '=', type: null },
			{ text: '0', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\end', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'equation', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\label{label with spaces}\n	u^2+2\\nu k^2u-Agk=0\n\n').nodes,
		[
			{ text: '\\label', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'label', type: 'variable' },
			{ text: ' ', type: 'space' },
			{ text: 'with', type: 'variable' },
			{ text: ' ', type: 'space' },
			{ text: 'spaces', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: 'u', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '+', type: null },
			{ text: '2', type: 'number' },
			{ text: '\\nu', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: 'k', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: 'u-Agk', type: null },
			{ text: '=', type: null },
			{ text: '0', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\label{labelwithoutspaces}\n	u^2+2\\nu k^2u-Agk=0\n\n').nodes,
		[
			{ text: '\\label', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'labelwithoutspaces', type: 'variable' },
			{ text: '}', type: 'bracket' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: 'u', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: '+', type: null },
			{ text: '2', type: 'number' },
			{ text: '\\nu', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: 'k', type: null },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: 'u-Agk', type: null },
			{ text: '=', type: null },
			{ text: '0', type: 'number' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});


test('Пробелы в начале строк', function () {
	assert.deepEqual(
		new Nodes('На криволинейных участках железнодорожного пути возвышают наружный\n рельс\n над внутренним для того,\nчтобы сила давления проходящего поезда на рельсы была направлена\n перпендикулярно').nodes,
		[
			{ text: 'На', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'криволинейных', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'участках', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'железнодорожного', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'пути', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'возвышают', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'наружный', type: 'cyrtext' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: 'рельс', type: 'cyrtext' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: 'над', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'внутренним', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'для', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'того', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: 'чтобы', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'сила', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'давления', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'проходящего', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'поезда', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'на', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'рельсы', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'была', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'направлена', type: 'cyrtext' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: 'перпендикулярно', type: 'cyrtext' },
		],
		""
	);
});

test('1 $2+ 2=4$ 265 $$2a-x2=2y2', function () {
	assert.deepEqual(
		new Nodes('1 $2+ 2=4$ 265 $$2a-x2=2y2').nodes,
		[
			{ text: '1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '2', type: 'number' },
			{ text: '+', type: null },
			{ text: ' ', type: 'space' },
			{ text: '2', type: 'number' },
			{ text: '=', type: null },
			{ text: '4', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '265', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '$$', type: 'keyword' },
			{ text: '2', type: 'number' },
			{ text: 'a', type: 'variable-2' },
			{ text: '-', type: null },
			{ text: 'x', type: 'variable-2' },
			{ text: '2', type: 'number' },
			{ text: '=', type: null },
			{ text: '2', type: 'number' },
			{ text: 'y', type: 'variable-2' },
			{ text: '2', type: 'number' },
		],
		""
	);
});

test('3.14', function () {
	assert.deepEqual(
		new Nodes('3.14').nodes,
		[
			{ text: '3.14', type: 'number' },
		],
		""
	);
});

test('', function () {
	assert.deepEqual(
		new Nodes('(2)').nodes,
		[
			{ text: '(', type: null },
			{ text: '2', type: 'number' },
			{ text: ')', type: null },
		],
		""
	);
	assert.deepEqual(
		new Nodes('{1}').nodes,
		[
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\frac12').nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '12', type: 'number' },
		],
		""
	);
});

test('quotes', function () {
	assert.deepEqual(
		new Nodes('For an "operator" situation, see Corollary 2.1 below').nodes,
		[
			{ text: 'For', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'an', type: null },
			{ text: ' ', type: 'space' },
			{ text: '"', type: null },
			{ text: 'operator', type: null },
			{ text: '"', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'situation', type: null },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'see', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'Corollary', type: null },
			{ text: ' ', type: 'space' },
			{ text: '2.1', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: 'below', type: null },
		],
		""
	);
	assert.deepEqual(
		new Nodes('Ижевск НИЦ "Регулярная и хаотическая динамика", 1999').nodes,
		[
			{ text: 'Ижевск', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'НИЦ', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '"', type: null },
			{ text: 'Регулярная', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'и', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'хаотическая', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'динамика', type: 'cyrtext' },
			{ text: '"', type: null },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: '1999', type: 'number' },
		],
		""
	);
});

test('babel-inspirated quotes', function () {
	assert.deepEqual(
		new Nodes('Вместе с физико"=математическим, медицинским, историко-филологическим и юридическим факультетами в г. Воронеж прибыли:').nodes,
		[
			//TDOD: maybe treat "= as single node? Wouldn't it make parser too slow?
			{ text: 'Вместе', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'с', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'физико', type: 'cyrtext' },
			{ text: '"', type: null },
			{ text: '=', type: null },
			{ text: 'математическим', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'медицинским', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'историко', type: 'cyrtext' },
			{ text: '-', type: null },
			{ text: 'филологическим', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'и', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'юридическим', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'факультетами', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'в', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'г', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'Воронеж', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'прибыли', type: 'cyrtext' },
			{ text: ':', type: null },
		],
		""
	);
});

test('\\( \\)', function () {
	assert.deepEqual(
		new Nodes('где \\(B=\\sqrt{\\frac{\\rho+\\alpha}2}\\),').nodes,
		[
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '\\(', type: 'keyword' },
			{ text: 'B', type: 'variable-2' },
			{ text: '=', type: null },
			{ text: '\\sqrt', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\rho', type: 'tag' },
			{ text: '+', type: null },
			{ text: '\\alpha', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '\\)', type: 'keyword' },
			{ text: ',', type: null },
		],
		""
	);
	assert.deepEqual(
		new Nodes('где $B=\\sqrt{\\frac{\\rho+\\alpha}2}$,').nodes,
		[
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'B', type: 'variable-2' },
			{ text: '=', type: null },
			{ text: '\\sqrt', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\rho', type: 'tag' },
			{ text: '+', type: null },
			{ text: '\\alpha', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
		],
		""
	);
});

test('\\[a\\]\\alpha$g$123\\[g\\]', function () {
	assert.deepEqual(
		new Nodes('\\[a\\]\\alpha$g$123\\[g\\]').nodes,
		[
			{ text: '\\[', type: 'keyword' },
			{ text: 'a', type: 'variable-2' },
			{ text: '\\]', type: 'keyword' },
			{ text: '\\alpha', type: 'tag' },
			{ text: '$', type: 'keyword' },
			{ text: 'g', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: '123', type: 'number' },
			{ text: '\\[', type: 'keyword' },
			{ text: 'g', type: 'variable-2' },
			{ text: '\\]', type: 'keyword' },
		],
		""
	);
});



/*
//TODO: запятая не отделяется от слова. Решить, что с ней делать.
test('', function () {
	assert.deepEqual(
		new Nodes('\\begin{document}\n\\usepackage{amsmath,amsthm}').nodes,
		[
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
	assert.deepEqual(
		new Nodes('a,b').nodes,
		[
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});
*/

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
