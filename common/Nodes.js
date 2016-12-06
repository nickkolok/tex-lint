'use strict';

// Конструктор
function Nodes(text) {
  this.nodes = [];
  if (text) {
	  this.fromText(text);
  }
};
// TODO: наследовать от массива и this.nodes = this


require('./Nodes_construction.js')(Nodes);
require('./Nodes_get.js')(Nodes);
require('./Nodes_codemirror.js')(Nodes);
require('./Nodes_constants.js')(Nodes);
require('./Nodes_transformation.js')(Nodes);

module.exports.Nodes = Nodes;