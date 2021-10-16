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

	N = new Nodes('\\frac{1}%\n{2}3[5]');
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



	N = new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc}');

	// Полукостыли, но без них парсится неправильно.
	// То есть правильно, но нам так не надо.
	var _utf8_ = new Nodes('[ utf8 ]');
	_utf8_.nodes[2].type = null;

	var utf8_ = new Nodes('[utf8 ]');
	utf8_.nodes[1].type = null;

	var utf8 = new Nodes('[utf8]');
	utf8.nodes[1].type = null;

	assert.deepEqual(
		N.getArguments(4, 2),
		[
			new Nodes('\\usepackage'),
			_utf8_,
		],
		""
	);

	N = new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc} ');
	assert.deepEqual(
		N.getArguments(4, 2),
		[
			new Nodes('\\usepackage'),
			_utf8_,
		],
		""
	);

	N = new Nodes('\\usepackage [ utf8 ] {inputenc}');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('\\usepackage'),
			_utf8_,
		],
		""
	);

	N = new Nodes('\\usepackage [ utf8 ] {inputenc}');
	assert.deepEqual(
		N.getArguments(0, 1),
		[
			new Nodes('\\usepackage'),
		],
		""
	);
	N = new Nodes('[ utf8 ] {inputenc}');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('[ utf8 ]'), // Да, а вот здесь так, ибо не аргумент
			new Nodes('{inputenc}'),
		],
		""
	);

	N = new Nodes('\\usepackage [ utf8 ]');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('\\usepackage'),
			_utf8_,
		],
		""
	);

	N = new Nodes('\\usepackage [utf8 ]');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('\\usepackage'),
			utf8_,
		],
		""
	);

	N = new Nodes('\\usepackage [utf8]');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('\\usepackage'),
			utf8,
		],
		""
	);

	N = new Nodes('\\usepackage[utf8]');
	assert.deepEqual(
		N.getArguments(0, 2),
		[
			new Nodes('\\usepackage'),
			utf8,
		],
		""
	);
});

test("getArgumentsMap", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');

	assert.deepEqual(
		N.getArgumentsMap(1, 1),
		[
			[1, 3],
		],
		""
	);

	assert.deepEqual(
		N.getArgumentsMap(1, 2),
		[
			[1, 3],
			[4, 6],
		],
		""
	);

	assert.deepEqual(
		N.getArgumentsMap(1, 3),
		[
			[1, 3],
			[4, 6],
			[7, 7],
		],
		""
	);

	assert.deepEqual(
		N.getArgumentsMap(1, 4),
		[
			[1, 3],
			[4, 6],
			[7, 7],
			[8, 10],
		],
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]\\sqrt {2} \\alpha');

	assert.deepEqual(
		N.getArgumentsMap(0, 1),
		[
			[0, 0],
		],
		""
	);

	assert.deepEqual(
		N.getArgumentsMap(0, 2),
		[
			[0, 0],
			[1, 3],
		],
		""
	);
	assert.deepEqual(
		N.getArgumentsMap(11, 2),
		[
			[11, 11],
			[13, 15],
		],
		""
	);
	assert.deepEqual(
		N.getArgumentsMap(11, 3),
		[
			[11, 11],
			[13, 15],
			[17, 17],
		],
		""
	);
	assert.deepEqual(
		N.getArgumentsMap(12, 3),
		[
			[13, 15],
			[17, 17],
		],
		""
	);

	N = new Nodes('\\frac');

	assert.deepEqual(
		N.getArgumentsMap(0, 3),
		[
			[0, 0],
		],
		""
	);

	N = new Nodes('');
	assert.deepEqual(
		N.getArgumentsMap(0, 3),
		[
		],
		""
	);
	assert.deepEqual(
		N.getArgumentsMap(0, 1),
		[
		],
		""
	);
	assert.deepEqual(
		N.getArgumentsMap(1, 25),
		[
		],
		""
	);

	N = new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc}');
	assert.deepEqual(
		N.getArgumentsMap(4, 2),
		[
			[4, 4],
			[6, 11],
		],
		""
	);

	N = new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc} ');
	assert.deepEqual(
		N.getArgumentsMap(4, 2),
		[
			[4, 4],
			[6, 11],
		],
		""
	);

	N = new Nodes('\\usepackage [ utf8 ] {inputenc}');
	assert.deepEqual(
		N.getArgumentsMap(0, 2),
		[
			[0, 0],
			[2, 7],
		],
		""
	);

});

test("getArgumentsEnd", function () {
	var N = new Nodes('\\frac{1}{2}3[5]\\sqrt {2} \\alpha');

	assert.deepEqual(
		N.getArgumentsEnd(0, 1),
		1,
		""
	);

	assert.deepEqual(
		N.getArgumentsEnd(0, 2),
		4,
		""
	);

	assert.deepEqual(
		N.getArgumentsEnd(1, 1),
		4,
		""
	);

	assert.deepEqual(
		N.getArgumentsEnd(1, 2),
		7,
		""
	);

	assert.deepEqual(
		N.getArgumentsEnd(1, 3),
		8,
		""
	);

	assert.deepEqual(
		N.getArgumentsEnd(1, 4),
		11,
		""
	);
	assert.deepEqual(
		N.getArgumentsEnd(11, 2),
		16,
		""
	);
	assert.deepEqual(
		N.getArgumentsEnd(11, 3),
		18,
		""
	);
	assert.deepEqual(
		N.getArgumentsEnd(12, 3),
		18,
		""
	);

	N = new Nodes('');
	assert.deepEqual(
		N.getArgumentsEnd(1, 2),
		0,
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

	N = new Nodes('   \\sqrt  \\frac   \n 1 2');
	assert.deepEqual(
		N.getWithArguments(3, 2).nodes,
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

	N = new Nodes('   \\sqrt  \\frac   \n 1 2');
	assert.deepEqual(
		N.getWithArguments(1, 2).nodes,
		[
			{ text: '\\sqrt', type: 'tag' },
			{ text: '  ', type: 'space' },
			{ text: '\\frac', type: 'tag' },
			{ text: '   ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
		],
		""
	);

	N = new Nodes('   \\sqrt  \\frac   \n 1 2');
	assert.deepEqual(
		N.getWithArguments(1, 2).nodes,
		[
			{ text: '\\sqrt', type: 'tag' },
			{ text: '  ', type: 'space' },
			{ text: '\\frac', type: 'tag' },
			{ text: '   ', type: 'space' },
			{ text: '\n', type: 'linebreak' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
		],
		""
	);

	N = new Nodes('');
	assert.deepEqual(
		N.getWithArguments(1, 2).nodes,
		[
		],
		""
	);

	N = new Nodes('\\alpha 1 2 3 \\frac {1} ');
	assert.deepEqual(
		N.getWithArguments(8, 2).nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '{', type: 'bracket' },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
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
		new Nodes('$a$').isInsideSymmDelimiters(0, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(0, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(0, 'keyword', '$', true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(2, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(2, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$a$').isInsideSymmDelimiters(2, 'keyword', '$', true),
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
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(8, 'keyword', '$', true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(16, 'keyword', '$', true),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(8, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(8, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(16, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(16, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(10, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('frac $\\frac{1}{2}$ in').isInsideSymmDelimiters(10, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$\\frac{1}{2}$ in').isInsideSymmDelimiters(8, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$\\frac{1}{2}$ in').isInsideSymmDelimiters(8, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$\\frac{1}{2}$').isInsideSymmDelimiters(8, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$\\frac{1}{2}$').isInsideSymmDelimiters(8, 'keyword', '$', false),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$1$ in').isInsideSymmDelimiters(2, 'keyword', '$'),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('$1$ in').isInsideSymmDelimiters(2, 'keyword', '$', false),
		false,
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
	assert.deepEqual(
		new Nodes('Some text with frac $\\frac{a}{b}+\\frac{1+\\alpha}{2-\\beta}+\\frac{1+C_0}{2}$ in it.').
			getSymmDelimitedTagNumbers(Nodes.NEW_$(), ['\\frac']),
		[ 9, 17, 29, ],
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
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip=18pt').getTagsArrayNumbers(['\\baselineskip']),
		[
			5,
		],
		""
	);
});

test('getRowCol', function () {
	assert.deepEqual(
		new Nodes('\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}\n\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}').getRowCol(22),
		{col:1,row:2,},
		""
	);
	assert.deepEqual(
		new Nodes('\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}\n\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}').getRowCol(24),
		{col:6,row:2,},
		""
	);
	assert.deepEqual(
		new Nodes('\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}\n\\sum_{\\frac{1}{2}}^{\\frac{3}{4}}\n\n\\alpha').getRowCol(45),
		{col:1,row:4,},
		""
	);
	assert.deepEqual(
		new Nodes('\n\n\\alpha').getRowCol(2),
		{col:1,row:3,},
		""
	);
});

test('getInputencs', function () {
	assert.deepEqual(
		new Nodes('\\usepackage[cp1251]{inputenc}').getInputencs(),
		[[0,'cp1251']],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{document}\\usepackage[cp1251]{inputenc}').getInputencs(),
		[[4,'cp1251']],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{document}\\usepackage[utf8]{inputenc}').getInputencs(),
		[[4,'utf8']],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{document}\\usepackage [ utf8 ] {inputenc}').getInputencs(),
		[[4,'utf8']],
		""
	);
	assert.deepEqual(
		new Nodes('\\usepackage{amsmath}').getInputencs(),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsmath}').getInputencs(),
		[[10,'cp1251']],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{document}\n\\usepackage{amsmath}\n\\usepackage[cp1251]{inputenc}\\usepackage{amsthm}\n\\usepackage[cp866]{inputenc}').getInputencs(),
		[
			[10,'cp1251'],
			[23,'cp866'],
		],
		""
	);

});

test('clone', function () {
	var oldNodes = new Nodes('\\frac{1}{2}');
	var newNodes = oldNodes.clone();
	newNodes.nodes[2].text = '3';
	assert.deepEqual(
		oldNodes.toString(),
		'\\frac{1}{2}',
		''
	);
});

test('getSuspiciousLongmaps', function () {
	assert.deepEqual(
		new Nodes('4=\\longmapsto').getSuspiciousLongmaps(),
		[
			0,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\mu4=\\longmapsto').getSuspiciousLongmaps(),
		[
			1,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\mu=\\longmapsto').getSuspiciousLongmaps(),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('4=\\longmapsto\\alpha 4=\\longmapsto').getSuspiciousLongmaps(),
		[
			0,
			5,
		],
		""
	);
});

test('getTagsAssignments', function () {
	assert.deepEqual(
		new Nodes('').getTagsAssignments(['\\baselineskip']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip=18pt').getTagsAssignments(['\\baselineskip']),
		[
			5,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip').getTagsAssignments(['\\baselineskip']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip 0').getTagsAssignments(['\\baselineskip']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\baselineskip=18pt').getTagsAssignments(['\\baselineskip']),
		[
			0,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip=18pt\\parindent=19pt').getTagsAssignments(['\\baselineskip', '\\parindent']),
		[
			5,
			7,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip=18pt\\parindent=19pt').getTagsAssignments(['\\parindent']),
		[
			7,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\begin{center}\n\\baselineskip=18pt\\parindent=19pt').getTagsAssignments(['\\baselineskip']),
		[
			5,
		],
		""
	);
});

test('getTagsEmpty', function () {
	assert.deepEqual(
		new Nodes('').getTagsEmpty(['\\large']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\large{}').getTagsEmpty(['\\large']),
		[
			0,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\large{ }').getTagsEmpty(['\\large']),
		[
			0,
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\large{ }').getTagsEmpty(['\\text']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\large{ 2}').getTagsEmpty(['\\large']),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('abc\\large{ }xyz\\text{}\\alpha').getTagsEmpty(['\\large','\\text']),
		[
			1,
			6,
		],
		""
	);
	assert.deepEqual(
		new Nodes('abc\\large{ }xyz\\text{2}\\alpha').getTagsEmpty(['\\large','\\text']),
		[
			1,
		],
		""
	);
});

test('getSubunicodeArtifacts', function () {
	assert.deepEqual(
		new Nodes('').getSubunicodeArtifacts(),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('\\alpha').getSubunicodeArtifacts(),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('^^').getSubunicodeArtifacts(),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('в плоскости $mbox{^^d0^^121}^{2}  $  с преградой').getSubunicodeArtifacts(),
		[
		],
		""
	);
	assert.deepEqual(
		new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой').getSubunicodeArtifacts(),
		[
			5,
		],
		""
	);
	assert.deepEqual(
		new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой $$x\\in \\mbox{^^d0^^121}^{2} \\l,\\, \\, t>0;\\eqno(1) $$').getSubunicodeArtifacts(),
		[
			5,
			30,
		],
		""
	);
	assert.deepEqual(
		new Nodes('$$x\\in \\mbox{^^d0^^121}^{2} \\l,\\, \\, t>0;\\eqno(1) $$').getSubunicodeArtifacts(),
		[
			4,
		],
		""
	);
	assert.deepEqual(
		new Nodes('$$\\mbox{^^d0^^120}q_{1}^{1} (x_{1} ,t)\\in C_{x_{1} ,t}^{2,1} ((-1,1),\\lbrack 0;\\infty )), $$').getSubunicodeArtifacts(),
		[
			1,
		],
		""
	);
	assert.deepEqual(
		new Nodes('в плоскости $\\mbox{^^d0^^121}^{2}  $  с преградой $$\\mbox{^^d0^^120}q_{1}^{1} (x_{1} ,t)\\in C_{x_{1} ,t}^{2,1} ((-1,1),\\lbrack 0;\\infty )), $$').getSubunicodeArtifacts(),
		[
			5,
			27,
		],
		""
	);
});

test('findSingleByRegExp', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.findSingleByRegExp(/bracket/, /^/),
		[
			1,
			3,
			4,
			6,
			8,
			10,
		],
		""
	);
	assert.deepEqual(
		N.findSingleByRegExp(/^/, /{|}/),
		[
			1,
			3,
			4,
			6,
		],
		""
	);
	assert.deepEqual(
		N.findSingleByRegExp(/bracket/, /{|}/),
		[
			1,
			3,
			4,
			6,
		],
		""
	);
	assert.deepEqual(
		N.findSingleByRegExp(/bracket|number/, /{|1/),
		[
			1,
			2,
			4,
		],
		""
	);
	N = new Nodes('a $a+b=c$ b');
	assert.deepEqual(
		N.findSingleByRegExp(/null|variable-2/, /a|b/),
		[
			0,
			3,
			5,
			10,
		],
		""
	);
	assert.deepEqual(
		N.findSingleByRegExp(/null/, /a|b/),
		[
			0,
			10,
		],
		""
	);
	assert.deepEqual(
		N.findSingleByRegExp(/null|variable-2/, /a/),
		[
			0,
			3,
		],
		""
	);
});

test('findSequenceByRegExp', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }]),
		[
			1,
			3,
			4,
			6,
			8,
			10,
		],
		""
	);
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			3,
		],
		""
	);
	N = new Nodes('\\frac{1}{2}{3}[5]');
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			3,
			6,
			9,
		],
		""
	);
	N = new Nodes('\\frac{1}{2}{3}[5]');
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/number/, text:/^/ }]),
		[
			1,
			4,
			7,
			10,
		],
		""
	);
	assert.deepEqual(
		N.findSequenceByRegExp([{ type: /^(?!bracket$)/, text: /^/ }]),
		[
			0,
			2,
			5,
			8,
			11,
		],
		""
	);
	N.nodes[2].skip = true;
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			1,
			3,
			6,
			9,
		],
		""
	);
	N.nodes[1].skip = true;
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			3,
			6,
			9,
		],
		""
	);
	N.nodes[6].skip = true;
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			3,
			9,
		],
		""
	);

	N = new Nodes('{1}');
	N.nodes[1].skip = true;
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
			0,
		],
		''
	);
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/number/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
		],
		''
	);
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/number/, text:/^/ }]),
		[
		],
		''
	);
	N = new Nodes('{1}');
	N.nodes[1].skip = true;
	N.nodes[2].skip = true;
	assert.deepEqual(
		N.findSequenceByRegExp([{ type:/bracket/, text:/^/ }, { type:/bracket/, text:/^/ }]),
		[
		],
		''
	);


	N = new Nodes('графа $\\Gamma  $ , инцидентных');
	assert.deepEqual(
		N.findSequenceByRegExp([
			{ type:/space/, text:/^/ },
		]),
		[
			1,
			4,
			6,
			8,
		],
		''
	);
	assert.deepEqual(
		N.findSequenceByRegExp([
			{ type: /^/, text: /\$/ },
			{ type: /space/, text: /^/ },
		]),
		[
			5,
		],
		''
	);
	assert.deepEqual(
		N.findSequenceByRegExp([
			{ type: /^/, text: /\$/ },
			{ type: /space/, text: /^/ },
			{ type: /^(?!(tag))/, text: /^,/ },
		]),
		[
			5,
		],
		''
	);

});

test('isInsideArgumentsOf', function () {
	var N = new Nodes('\\alpha \\frac{1}{2} \\dfrac{\\operatorname{tg}t}{\pi}');
	assert.deepEqual(
		N.isInsideArgumentsOf(4, [{ type: /tag/, text: /\\frac/ }], 1),
		true,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(4, [{ type: /tag/, text: /\\frac/ }], 2),
		true,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(7, [{ type: /tag/, text: /\\frac/ }], 2),
		true,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(0, [{ type: /tag/, text: /\\frac/ }], 1),
		false,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(13, [{ type: /tag/, text: /\\frac|\\dfrac/ }], 2),
		true,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(13,
			[
				{ type: /tag/, text: /\\frac/ },
				{ type: /tag/, text: /\\dfrac/ },
			],
		2),
		true,
		""
	);
	assert.deepEqual(
		N.isInsideArgumentsOf(14,
			[
				{ type: /tag/, text: /\\frac/ },
				{ type: /tag/, text: /\\dfrac/ },
			],
			2),
		true,
		""
	);
	N = new Nodes('\\dfrac{\\operatorname{tg}t}{\pi}');
	assert.deepEqual(
		N.isInsideArgumentsOf(4,
			[
				{ type: /tag/, text: /\\frac/ },
				{ type: /tag/, text: /\\dfrac/ },
			],
			2),
		true,
		""
	);
});


test('getIndexBySymbolNumber', function () {
	var N = new Nodes('\\alpha \\frac{1}{2} \\dfrac{\\operatorname{tg}t}{\pi}');
	var indexes = [0,0,0,0,0,0,1,2,2,2,2,2,3,4,5,6,7,8,9,10,10,10,10,10,10,11,12,12];
	for (var i = 0; i < indexes.length; i++) {
		assert.deepEqual(
			N.getIndexBySymbolNumber(i),
			indexes[i],
			""
		);
	}
});

test('isProtectiveTag', function () {
	assert.deepEqual(
		new Nodes("\\begin{equation}\\label{sol:sin}y(x) = sin 2x \\end{equation}").isProtectiveTag(0),
		true,
		""
	);
	assert.deepEqual(
		new Nodes("\\begin{equation}\\label{sol:sin}y(x) = sin 2x \\end{equation}").isProtectiveTag(4),
		true,
		""
	);
	var n2 = new Nodes("\\begin{equation}\\label{sol:sin}y(x) = \\sin 2x \\end{equation}");
	for (var i = 5; i < 19; i++){
		assert.deepEqual(
			n2.isProtectiveTag(i),
			false,
			"" + i + ": " + n2.nodes[i].text
		);	
	}
	assert.deepEqual(
		n2.isProtectiveTag(20),
		true,
		""
	);	
	assert.deepEqual(
		n2.isProtectiveTag(21),
		false,
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
