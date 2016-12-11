QUnit.module("Nodes_edit_rowsplit");

test('separate$$', function () {
	var N;

	N = new Nodes('$$');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'$$',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma $$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$ text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text',
		""
	);

	N = new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text',
		""
	);

	N = new Nodes('\n$$\n');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'\n$$\n',
		""
	);

	N = new Nodes('1$$2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1\n$$\n2',
		""
	);

	N = new Nodes('1 $$2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n2',
		""
	);

	N = new Nodes('1 $$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$\n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n $$ \n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n $$ \n 2',
		""
	);

	N = new Nodes('1 \n $$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n $$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 \n$$ 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 $$\n 2');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2',
		""
	);

	N = new Nodes('1 $$ 2 $$\n 3');
	N.separate$$();
	assert.deepEqual(
		N.toString(),
		'1 \n$$\n 2 \n$$\n 3',
		"'1 $$ 2 $$\\n 3'"
	);

});

test('separate$', function () {
	var N;

	N = new Nodes('$12$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$',
		""
	);
	N = new Nodes('a$12$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'a$12$',
		""
	);
	N = new Nodes('a $12$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'a\n$12$',
		""
	);
	N = new Nodes('$12$b');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$b',
		""
	);
	N = new Nodes('$12$ b');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$\nb',
		""
	);
	N = new Nodes('$12$\n b');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$\n b',
		""
	);
	N = new Nodes('$12$ \nb');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$ \nb',
		""
	);
	N = new Nodes('a\n$12$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'a\n$12$',
		""
	);
	N = new Nodes('$12$ b \n$333$c d\n$4$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$\nb \n$333$c\nd\n$4$',
		""
	);
	N = new Nodes('$12$ b \n$333$ $67$ c d\n$4$');
	N.separate$();
	assert.deepEqual(
		N.toString(),
		'$12$\nb \n$333$\n$67$\nc d\n$4$',
		""
	);
});

test('splitRowOnce', function () {
	var N = new Nodes('1\n12345 6');
	N.splitRowOnce(1, 5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6',
		""
	);

	var N = new Nodes('1\n12345 6 7');
	N.splitRowOnce(1, 5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7',
		""
	);


});

test('splitOneRow', function () {
	var N = new Nodes('');
	N.splitOneRow(5);
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	var N = new Nodes('1\n12345 6');
	N.splitOneRow(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6',
		""
	);

	var N = new Nodes('1\n12345 6 7');
	N.splitOneRow(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7',
		""
	);

	var N = new Nodes('1\n12345 6 7\nabracadabra');
	N.splitOneRow(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7\nabracadabra',
		""
	);

	N.splitOneRow(5);
	assert.deepEqual(
		N.splitOneRow(5),
		false,
		""
	);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7\nabracadabra',
		""
	);


	'1\n12345 6 7\nabracadabra'
});

test('splitRows', function () {
	var N = new Nodes('');
	N.splitRows(5);
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	var N = new Nodes('1\n12345 6');
	N.splitRows(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6',
		""
	);

	var N = new Nodes('1\n12345 6 7');
	N.splitRows(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7',
		""
	);

	var N = new Nodes('1\n12345 6 7\nabracadabra');
	N.splitRows(5);
	assert.deepEqual(
		N.toString(),
		'1\n12345\n6 7\nabracadabra',
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
