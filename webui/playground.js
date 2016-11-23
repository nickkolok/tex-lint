
function codeLoad(){

	var readers=[];
	// Closure to capture the file information.
	var f=document.getElementById('file-load').files[0];
	reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			try{
				myCodeMirror.setValue(e.target.result);
			}catch(e){
				alert('Не удалось прочитать '+theFile.name)
			}
		};
	})(f);
	reader.readAsText(f);
}

function baseSave(){
	var blob = new Blob([JSON.stringify(base).replace(/},{/g,"},\r\n{")], {
		type: "text/plain;charset=utf-8"
	});
	var a = document.createElement('a');
	a.download = "save.json";
	a.href = URL.createObjectURL(blob);
	a.innerHTML = "<button>Сохранить</button>";
	document.getElementById('span-save').innerHTML='';
	document.getElementById('span-save').appendChild(a);
}



var myCodeMirror = CodeMirror(document.getElementById('code-mirror-holder'));

