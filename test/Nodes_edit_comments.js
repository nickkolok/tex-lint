QUnit.module('Nodes_edit_comments');


test('removeNontrivialComments', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]% \n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]% \n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%\n%',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123 a b c');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]123 a b c',
		""
	);

	N = new Nodes('%');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'%',
		""
	);

	N = new Nodes('Текст\ntext % another text');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext ',
		""
	);

	N = new Nodes('Текст\ntext % another text\n');
	N.removeNontrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext ',
		""
	);
});

test('removeTrivialComments', function () {
	var N = new Nodes('\\frac{1}{2}3[5]');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]% \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%\n%line\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123 a b c');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n%line \n123 a b c',
		""
	);

	N = new Nodes('%');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('% ');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('%\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('% \n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('Текст\ntext % another text');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext % another text',
		""
	);

	N = new Nodes('Текст\ntext % another text\n');
	N.removeTrivialComments();
	assert.deepEqual(
		N.toString(),
		'Текст\ntext % another text\n',
		""
	);
});


test('removeComment', function () {
	var N = new Nodes('\\frac{1}{2}3[5]%\n');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]% \n');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n%',
		""
	);
	N.removeComment(12);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%\n%');
	N.removeComment(13);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%',
		""
	);


	N = new Nodes('\\frac{1}3[5]%text\n');
	N.removeComment(8);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}3[5]\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n%line\n',
		""
	);
	N = new Nodes('\\frac{1}{2}3[5]%text\n%line\n');
	N.removeComment(13);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n%line \n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n');
	N.removeComment(13);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n%line \n123',
		""
	);
	N.removeComment(12);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123');
	N.removeComment(13);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n123',
		""
	);
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n123',
		""
	);

	N = new Nodes('\\frac{1}{2}3[5]%text\n%line \n123 a b c');
	N.removeComment(13);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]%text\n123 a b c',
		""
	);
	N.removeComment(11);
	assert.deepEqual(
		N.toString(),
		'\\frac{1}{2}3[5]\n123 a b c',
		""
	);

	N = new Nodes('%');
	N.removeComment(0);
	assert.deepEqual(
		N.toString(),
		'',
		""
	);

	N = new Nodes('Текст\ntext % another text');
	N.removeComment(4);
	assert.deepEqual(
		N.toString(),
		'Текст\ntext ',
		""
	);

	N = new Nodes('Текст\ntext % another text\n');
	N.removeComment(4);
	assert.deepEqual(
		N.toString(),
		'Текст\ntext \n',
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
