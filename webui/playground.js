
var fileName='saved.tex'

function codeLoad(){

	var readers=[];
	// Closure to capture the file information.
	var f=document.getElementById('file-load').files[0];
	reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try{
				myCodeMirror.setValue(e.target.result);
				fileName = theFile.name;
			}catch(e){
				alert('Не удалось прочитать '+theFile.name)
			}
		};
	})(f);
	reader.readAsText(f);
}

function codeSave(){
	var blob = new Blob([myCodeMirror.getValue().replace(/[\n\r]+/g,"},\r\n{")], {
		type: "text/plain;charset=utf-8"
	});
	var a = document.createElement('a');
	a.download = fileName+".edited.tex";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить TeX-файл</button>";
	document.getElementById('span-save').innerHTML='';
	document.getElementById('span-save').appendChild(a);
	console.log('codeSave()');
}



var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'));

myCodeMirror.on("change",codeSave);


function getNodesAsIs(){
	var nodes = [];
	CodeMirror.runMode(
		myCodeMirror.getValue(),
		{name:'stex'},
		function(node,style){
			nodes.push({text:node,type:style});
		}
	);
	return nodes;
};

function getNodesQuantity(nodes,nodetype,nodetext){
	var quantity = 0;
	for(var i=0; i<nodes.length; i++){
		if(nodes[i].type == nodetype && nodes[i].text == nodetext){
			quantity++;
		}
	}
	return quantity;
}

function runcheck(){
	var nodes = getNodesAsIs();
	console.log(nodes);
	if(getNodesQuantity(nodes,"tag","\\newcommand")+getNodesQuantity(nodes,"tag","\\renewcommand")){
		alert('Команды переопределять нельзя!');
	};
}


