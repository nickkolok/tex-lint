var rules = {};

function Rule(name,message,findErrors){
	this.name = name;
	this.message = message;
	this.findErrors = findErrors;

	rules[name] = this;
}

new Rule(
	"nonewcommand",
	"Не допускается переопределение команд или окружений или определение новых",
	function(nodes){
		return {
			quantity:
				nodes.getNodesQuantity("tag","\\newcommand")+
				nodes.getNodesQuantity("tag","\\renewcommand")+
				nodes.getNodesQuantity("tag","\\newenvironment")+
				nodes.getNodesQuantity("tag","\\renewenvironment")
		};
	}
);

new Rule(
	"noautonumformulas",
	"Не допускается использование автоматической нумерации формул",
	function(nodes){
		return {
			quantity:
				nodes.getNodesQuantity("tag","\\ref")+
				nodes.getNodesQuantity("tag","\\label")
		};
	}
);

new Rule(
	"noautonumbiblio",
	"Не допускается использование автоматической нумерации библиографии",
	function(nodes){
		return {
			quantity:

				nodes.getNodesQuantity("tag","\\cite")+
				nodes.getNodesQuantity("tag","\\bibitem")
		};
	}
);

module.exports.rules = rules;
