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
/*
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
*/
