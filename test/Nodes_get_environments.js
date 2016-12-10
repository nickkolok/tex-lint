QUnit.module("Nodes_get");

test("getAllEnvironmentsList", function () {
	var N = new Nodes('');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[],
		""
	);

	var N = new Nodes('qwe\n123  ');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[],
		""
	);
	var N = new Nodes('\\begin{equation}\\end{equation}');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 0, end: 4, name: 'equation' },
		],
		""
	);

	var N = new Nodes('\n 123 \\begin{equation}\nE=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 13, name: 'equation' },
		],
		""
	);

	// Не знаю, как на самом деле латех на это реагирует, но пусть будет
	var N = new Nodes('\n 123 \\begin{ equation }\nE=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 15, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{ equation* }\nE=mc^2\n\\end{equation*} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 16, name: 'equation*' },
		],
		""
	);

	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 29, name: 'equation' },
			{ begin: 9, end: 21, name: 'array' },
		],
		""
	);
});

test("getEnvironmentsList", function () {
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getEnvironmentsList(['equation']),
		[
			{ begin: 4, end: 29, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\begin{equation}\\end{equation}\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123\\begin{equation}a+b=c\\end{equation}');
	assert.deepEqual(
		N.getEnvironmentsList(['equation']),
		[
			{ begin:  4, end: 37, name: 'equation' },
			{ begin: 19, end: 23, name: 'equation' },
			{ begin: 47, end: 54, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\begin{equation}\\end{equation}\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123\\begin{equation}a+b=c\\end{equation}');
	assert.deepEqual(
		N.getEnvironmentsList(['equation','array']),
		[
			{ begin:  4, end: 37, name: 'equation' },
			{ begin:  9, end: 29, name: 'array' },
			{ begin: 19, end: 23, name: 'equation' },
			{ begin: 47, end: 54, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\begin{equation}\\end{equation}\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123\\begin{equation}a+b=c\\end{equation}');
	assert.deepEqual(
		N.getEnvironmentsList(['supertabular']),
		[
		],
		""
	);
});
