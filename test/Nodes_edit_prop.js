QUnit.module("Nodes_prop");

test("frac and numbers", function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	N.setPropByRegExp(/^bracket$/, /^/, 'skip', true);
	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket', skip: true },
			{ text: '1', type: 'number' },
			{ text: '}', type: 'bracket', skip: true },
			{ text: '{', type: 'bracket', skip: true },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket', skip: true },
			{ text: '3', type: 'number' },
			{ text: '[', type: 'bracket', skip: true },
			{ text: '5', type: 'number' },
			{ text: ']', type: 'bracket', skip: true },
		],
		""
	);
	N.delPropByRegExp(/^bracket$/, /^/, 'skip');
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
	N.setPropByRegExp(/^bracket$/, /^/, 'skip', true);
	N.setPropByRegExp(/^bracket$/, /^/, 'prop', 'xx');
	N.setPropByRegExp(/^number$/, /^/, 'prop', 'xxx');
	N.delAllPropsOfAllNodes();
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
	N.setPropForRanges([[1,3],[7,19]], 'prop', 'xx');
	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket', prop: 'xx' },
			{ text: '1', type: 'number', prop: 'xx' },
			{ text: '}', type: 'bracket' },
			{ text: '{', type: 'bracket' },
			{ text: '2', type: 'number' },
			{ text: '}', type: 'bracket' },
			{ text: '3', type: 'number', prop: 'xx' },
			{ text: '[', type: 'bracket', prop: 'xx' },
			{ text: '5', type: 'number', prop: 'xx' },
			{ text: ']', type: 'bracket', prop: 'xx' },
		],
		""
	);
	N.delPropForRanges([[7,19]], 'prop');
	assert.deepEqual(
		N.nodes,
		[
			{ text: '\\frac', type: 'tag' },
			{ text: '{', type: 'bracket', prop: 'xx' },
			{ text: '1', type: 'number', prop: 'xx' },
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

test('setSkipAllEnds', function () {
	var n = new Nodes(
		'$$\\mbox{ при } \\dot{\\varphi} < 0,\n\t\\end{array}\n$$\nгде $h$, --- постоянные величины.\n\nСчитая, что $2h/k \\ll 1$, $M_0 /K^2 \\ll 1$,\nприменить метод медленно меняющихся коэффициентов\nдля нахождения установившегося движения маятника.\n'
	);
	n.setSkipAllEnds();
	assert.deepEqual(
		n.nodes,
		[
			{ text: '$$', type: 'keyword' },
			{ text: '\\mbox', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: 'при', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '\\dot', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\varphi', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '<', type: null },
			{ text: ' ', type: 'space' },
			{ text: '0', type: 'number' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: '\\end', type: 'tag', skip: true },
			{ text: '{', type: 'bracket', skip: true },
			{ text: 'array', type: 'variable-2', skip: true },
			{ text: '}', type: 'bracket', skip: true },
			{ text: '\n', type: 'linebreak' },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'h', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: '---', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'постоянные', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'величины', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'Считая', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'что', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '2', type: 'number' },
			{ text: 'h', type: 'variable-2' },
			{ text: '/', type: null },
			{ text: 'k', type: 'variable-2' },
			{ text: ' ', type: 'space' },
			{ text: '\\ll', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'M', type: 'variable-2' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '/', type: null },
			{ text: 'K', type: 'variable-2' },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\ll', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: 'применить', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'метод', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'медленно', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'меняющихся', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'коэффициентов', type: 'cyrtext' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'для', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'нахождения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'установившегося', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'движения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'маятника', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
		],
		""
	);
});

test('setSkipAllEqno', function () {
	var n = new Nodes('случай $$\n\\lambda_1=\\Lambda\\Omega^3,\\,\\,\\Omega\\gg\\omega_0,\\eqno(4)\n$$\nгде $ \\omega_0 $');
	n.setSkipAllEqno();
	assert.deepEqual(
		n.nodes,
		[
			{ text: 'случай', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\lambda', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '1', type: 'number' },
			{ text: '=', type: null },
			{ text: '\\Lambda', type: 'tag' },
			{ text: '\\Omega', type: 'tag' },
			{ text: '^', type: 'tag' },
			{ text: '3', type: 'number' },
			{ text: ',', type: null },
			{ text: '\\,', type: 'tag' },
			{ text: '\\,', type: 'tag' },
			{ text: '\\Omega', type: 'tag' },
			{ text: '\\gg', type: 'tag' },
			{ text: '\\omega', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ',', type: null },
			{ text: '\\eqno', type: 'tag', skip: true },
			{ text: '(', type: 'bracket', skip: true },
			{ text: '4', type: 'number', skip: true },
			{ text: ')', type: 'bracket', skip: true },
			{ text: '\n', type: 'linebreak', skip: true },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\\omega', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
		],
		""
	);

	n = new Nodes('случай $$\n\\lambda_1=\\Lambda\\Omega^3,\\,\\,\\Omega\\gg\\omega_0,\\eqno(4)$$\nгде $ \\omega_0 $');
	n.setSkipAllEqno();
	assert.deepEqual(
		n.nodes,
		[
			{ text: 'случай', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: '\\lambda', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '1', type: 'number' },
			{ text: '=', type: null },
			{ text: '\\Lambda', type: 'tag' },
			{ text: '\\Omega', type: 'tag' },
			{ text: '^', type: 'tag' },
			{ text: '3', type: 'number' },
			{ text: ',', type: null },
			{ text: '\\,', type: 'tag' },
			{ text: '\\,', type: 'tag' },
			{ text: '\\Omega', type: 'tag' },
			{ text: '\\gg', type: 'tag' },
			{ text: '\\omega', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ',', type: null },
			{ text: '\\eqno', type: 'tag', skip: true },
			{ text: '(', type: 'bracket', skip: true },
			{ text: '4', type: 'number', skip: true },
			{ text: ')', type: 'bracket', skip: true },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: ' ', type: 'space' },
			{ text: '\\omega', type: 'tag' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
		],
		""
	);

	n = new Nodes(
		'$$\\mbox{ при } \\dot{\\varphi} < 0,\n\t\\end{array}\n$$\nгде $h$, --- постоянные величины.\n\nСчитая, что $2h/k \\ll 1$, $M_0 /K^2 \\ll 1$,\nприменить метод медленно меняющихся коэффициентов\nдля нахождения установившегося движения маятника.\n'
	);
	n.setSkipAllEqno();
	assert.deepEqual(
		n.nodes,
		[
			{ text: '$$', type: 'keyword' },
			{ text: '\\mbox', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: 'при', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '\\dot', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: '\\varphi', type: 'tag' },
			{ text: '}', type: 'bracket' },
			{ text: ' ', type: 'space' },
			{ text: '<', type: null },
			{ text: ' ', type: 'space' },
			{ text: '0', type: 'number' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\t', type: 'space' },
			{ text: '\\end', type: 'tag' },
			{ text: '{', type: 'bracket' },
			{ text: 'array', type: 'variable-2' },
			{ text: '}', type: 'bracket', },
			{ text: '\n', type: 'linebreak' },
			{ text: '$$', type: 'keyword' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'где', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'h', type: 'variable-2' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: '---', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'постоянные', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'величины', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'Считая', type: 'cyrtext' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: 'что', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: '2', type: 'number' },
			{ text: 'h', type: 'variable-2' },
			{ text: '/', type: null },
			{ text: 'k', type: 'variable-2' },
			{ text: ' ', type: 'space' },
			{ text: '\\ll', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: ' ', type: 'space' },
			{ text: '$', type: 'keyword' },
			{ text: 'M', type: 'variable-2' },
			{ text: '_', type: 'tag' },
			{ text: '0', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '/', type: null },
			{ text: 'K', type: 'variable-2' },
			{ text: '^', type: 'tag' },
			{ text: '2', type: 'number' },
			{ text: ' ', type: 'space' },
			{ text: '\\ll', type: 'tag' },
			{ text: ' ', type: 'space' },
			{ text: '1', type: 'number' },
			{ text: '$', type: 'keyword' },
			{ text: ',', type: null },
			{ text: '\n', type: 'linebreak' },
			{ text: 'применить', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'метод', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'медленно', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'меняющихся', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'коэффициентов', type: 'cyrtext' },
			{ text: '\n', type: 'linebreak' },
			{ text: 'для', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'нахождения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'установившегося', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'движения', type: 'cyrtext' },
			{ text: ' ', type: 'space' },
			{ text: 'маятника', type: 'cyrtext' },
			{ text: '.', type: null },
			{ text: '\n', type: 'linebreak' },
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
