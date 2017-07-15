QUnit.module("Nodes_get_rowsplit");

test('getNonseparated$$Numbers', function () {
	assert.deepEqual(
		new Nodes('$$').getNonseparated$$Numbers(),
		[],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$ text text text').getNonseparated$$Numbers(),
		[2,16],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha \n$$\n \\frac{1}{2} \\cdot \\gamma $$ text text text').getNonseparated$$Numbers(),
		[18],
		""
	);
	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$ text text text').getNonseparated$$Numbers(),
		[2,17],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma $$\n text text text').getNonseparated$$Numbers(),
		[2,16],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$\n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n  $$\n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n$$  \n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\\alpha $$ \\frac{1}{2} \\cdot \\gamma \n   $$   \n text text text').getNonseparated$$Numbers(),
		[2],
		""
	);

	assert.deepEqual(
		new Nodes('\n$$\n').getNonseparated$$Numbers(),
		[],
		""
	);

	assert.deepEqual(
		new Nodes('1 $$ 2 $$\n 3').getNonseparated$$Numbers(),
		[2, 6],
		""
	);
});

test('isGoodOpening$', function () {
	assert.deepEqual(
		new Nodes('$12$').isGoodOpening$(0),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a$12$').isGoodOpening$(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a $12$').isGoodOpening$(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('a c$12$').isGoodOpening$(3),
		false,
		""
	);
});

test('isGoodClosing$', function () {
	assert.deepEqual(
		new Nodes('$12$ \nb').isGoodClosing$(2),
		true,
		""
	);
});


test('isWellSeparated$', function () {
	assert.deepEqual(
		new Nodes('$12$').isWellSeparated$(0),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a$12$').isWellSeparated$(1),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('a $12$').isWellSeparated$(2),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('a c$12$').isWellSeparated$(3),
		false,
		""
	);
	assert.deepEqual(
		new Nodes('a c$12$').isWellSeparated$(5),
		true,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ \nb').isWellSeparated$(2),
		true,
		""
	);
});

test('count$SeparationErrors', function () {
	assert.deepEqual(
		new Nodes('$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a $12$').count$SeparationErrors(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('$12$b').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b').count$SeparationErrors(),
		1,
		""
	);
	assert.deepEqual(
		new Nodes('$12$\n b').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ \nb').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('a\n$12$').count$SeparationErrors(),
		0,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b \n$333$c d\n$4$').count$SeparationErrors(),
		2,
		""
	);
	assert.deepEqual(
		new Nodes('$12$ b \n$333$ $67$ c d\n$4$').count$SeparationErrors(),
		4,
		""
	);
});

test('getTooLongRowsNumbers', function () {
	assert.deepEqual(
		new Nodes('').getTooLongRowsNumbers(4),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('123').getTooLongRowsNumbers(4),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('1234').getTooLongRowsNumbers(4),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('123\n456').getTooLongRowsNumbers(4),
		[],
		""
	);
	assert.deepEqual(
		new Nodes('12345').getTooLongRowsNumbers(4),
		[0],
		""
	);
	assert.deepEqual(
		new Nodes('12345\n67890').getTooLongRowsNumbers(4),
		[0, 1],
		""
	);
	assert.deepEqual(
		new Nodes('12345\nabc\n67890').getTooLongRowsNumbers(4),
		[0, 2],
		""
	);
	assert.deepEqual(
		new Nodes('12345\n abc \n67890').getTooLongRowsNumbers(4),
		[0, 1, 2],
		""
	);
	assert.deepEqual(
		new Nodes('1\n12345 6 7').getTooLongRowsNumbers(4),
		[1],
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
