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
