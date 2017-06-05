'use strict';

// Конструктор
function Nodes(text) {
  this.nodes = [];
  if (text) {
	  this.fromText(text);
  }
}
// Наследовать от массива пока нельзя.
// Гуглить 'javascript subclass Array', если очень хочется


require('./Nodes_construction.js')(Nodes);
require('./Nodes_codemirror.js')(Nodes);
require('./Nodes_constants.js')(Nodes);

require('./Nodes_get.js')(Nodes);
require('./Nodes_get_environments.js')(Nodes);
require('./Nodes_get_rowsplit.js')(Nodes);
require('./Nodes_get_comments.js')(Nodes);

require('./Nodes_edit.js')(Nodes);
require('./Nodes_edit_wrap.js')(Nodes);
require('./Nodes_edit_rowsplit.js')(Nodes);
require('./Nodes_edit_comments.js')(Nodes);

module.exports.Nodes = Nodes;
