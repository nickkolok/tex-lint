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
			{ begin: 4, end: 15, name: 'equation' },
		],
		""
	);

	// Не знаю, как на самом деле латех на это реагирует, но пусть будет
	// Узнал. Плохо на это латех реагирует, не компилируется
	// TODO: тоже реагировать плохо!
	var N = new Nodes('\n 123 \\begin{ equation }\nE=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 16, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{ equation* }\nE=mc^2\n\\end{equation*} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 17, name: 'equation*' },
		],
		""
	);

	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getAllEnvironmentsList(),
		[
			{ begin: 4, end: 35, name: 'equation' },
			{ begin: 9, end: 25, name: 'array' },
		],
		""
	);
});

test("getEnvironmentsList", function () {
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123');
	assert.deepEqual(
		N.getEnvironmentsList(['equation']),
		[
			{ begin: 4, end: 35, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\begin{equation}\\end{equation}\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123\\begin{equation}a+b=c\\end{equation}');
	assert.deepEqual(
		N.getEnvironmentsList(['equation']),
		[
			{ begin:  4, end: 42, name: 'equation' },
			{ begin: 21, end: 25, name: 'equation' },
			{ begin: 52, end: 61, name: 'equation' },
		],
		""
	);
	var N = new Nodes('\n 123 \\begin{equation}\n\\begin{array}{c|c}1&2\\begin{equation}\\end{equation}\\3&4\\end{array}E=mc^2\n\\end{equation} smth \n 123\\begin{equation}a+b=c\\end{equation}');
	assert.deepEqual(
		N.getEnvironmentsList(['equation','array']),
		[
			{ begin:  4, end: 42, name: 'equation' },
			{ begin:  9, end: 33, name: 'array' },
			{ begin: 21, end: 25, name: 'equation' },
			{ begin: 52, end: 61, name: 'equation' },
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
