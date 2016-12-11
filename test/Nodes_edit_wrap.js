QUnit.module("Nodes_edit_wrap");


test('trim', function () {
	var N = new Nodes('');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);
	var N = new Nodes('123');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123',
		""
	);
	var N = new Nodes('123 456\n789');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes('  123 456\n789\n');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes(' \n 123 456\n789\n  ');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes('  123 456\n789  ');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes('\n\n\n123 456\n789\n\n\n\n');
	N.trim();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
});

test('unwrap', function () {
	var N = new Nodes('');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);
	var N = new Nodes('{}');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	var N = new Nodes('{ }');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);
	var N = new Nodes(' {} ');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);
	var N = new Nodes('\n\n\n123 456\n789\n\n\n\n');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes('\n{\n{\n123 456\n789\n}}\n\n');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'123 456\n789',
		""
	);
	var N = new Nodes('\n{\n{\n123}}{{456\n789\n}}\n\n');
	N.unwrap();
	assert.deepEqual(
		N.toString(),
		'{\n{\n123}}{{456\n789\n}}',
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
