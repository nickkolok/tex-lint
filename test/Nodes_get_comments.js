QUnit.module("Nodes_get_comments");

test('getNontrivialCommentsQuantity', function () {
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]% \n').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%\n%').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('\\frac{1}{2}3[5]%text\n%line\n').getNontrivialCommentsQuantity(),
		2,
		""
	);
	assert.deepEqual(
		new Nodes('%').getNontrivialCommentsQuantity(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('Текст\ntext % another text').getNontrivialCommentsQuantity(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('Текст\ntext % another text\n').getNontrivialCommentsQuantity(),
		1,
		""
	);

});

/*

test('', function () {
	assert.deepEqual(
		new Nodes('').,
		1,
		""
	);

});

*/
