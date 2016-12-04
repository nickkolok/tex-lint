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
	var blob = new Blob([myCodeMirror.getValue().replace(/[\r]*[\n][\r]*/g,"},\r\n{")], {
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

	return new Nodes(myCodeMirror.getValue());
};

function runcheck(){
	var nodesObject = getNodesAsIs();
	nodesObject.prepareNodes();
	console.log(nodesObject.nodes);
	if(nodesObject.getNodesQuantity("tag","\\newcommand")+nodesObject.getNodesQuantity("tag","\\renewcommand")){
		document.getElementById("result-container").innerHTML='Команды переопределять нельзя!';
	};
}
