class Mocha_IO {
	
	/*Make multi line string into array of lines*/
	static stringToArr(arr) {
		return Mocha_IO.splitIntoArray(arr,"\n");
	}
	
	/* Make string an array; breaking at 'token'*/
	static splitIntoArray(str,token) {
		var arr = [];
		var loc = "";
		for (var i in str) {
			if (str[i] == token){
				arr.push(loc);
				loc = "";
			} else {
				loc += str[i];
			}
		}
		arr.push(loc);
		return arr;
	}
	
	/*Returns all characters from a string*/
	static getChars(str) {
		var arr = [];
		for (var i in str) {
			arr.push(str[i]);
		}
		return arr;
	}
	
}


class Mocha_Compile {
	static compileString(x) {
		
		x = "\n" + x;
		x = x + "\n";
		
		//BREAK UP
		while (x.search(";") >= 0) {
			x = x.replace(";","\n");
		}
		
		//FUNCTIONS
		
		this.FUNCreg = /<-(?:\s?)(\S+?)\s(.+)[\r\n]/im;
		this.VARreg = /(\S*)\s?->\s?([^\s;]*)/i;
		this.CALLreg = /(\S+)\s?>>\s?(.+)/i;
		this.CLSreg = /(?:<>|cls)\s?(\S+)/i;
		
		while (this.FUNCreg.test(x)) {
			var matchA = this.FUNCreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			
			//figure out names of things and arguments
			var funcName = matchA[1];
			var funcArgs = matchA[2];
			while (funcArgs.search(" ") >= 0) {funcArgs = funcArgs.replace(" ",",&*&");}
			while (funcArgs.search("&*&") >= 0) {funcArgs = funcArgs.replace("&*&"," ");}
			//funcArgs = funcArgs.substr(0,funcArgs.length-1);
			
			x = beforeMatch+"function "+funcName+"("+funcArgs+") {\n"+afterMatch;
		}
		
		//FUNCTION ENDS
		while (x.search(":") >= 0) {
			x = x.replace(":","}");
		}
		while (x.search("end") >= 0) {
			x = x.replace("end","}");
		}
		
		//MAKE FUNCTIONS STATIC
		while (x.search("~function") >= 0) {
			x = x.replace("~function","static");
		}
		
		//ASSIGNING AND FUNCTION CALLS
		var xLines = Mocha_IO.stringToArr(x);
			
		//VARIABLE ASSIGNMENTS
		while (this.VARreg.test(x)){
			var matchA = this.VARreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			var variableValue = matchA[1];
			var variableName = matchA[2];
			x = beforeMatch + variableName +" = "+variableValue+afterMatch;
		}
		
		//LOCAL
		while (x.search("~") >= 0) {
			x = x.replace("~","var ");
		}
		
		//RETURNS
		while (x.search("@") >= 0) {
			x = x.replace("@","return ");
		}
		
		//FUNCTION CALLS
		while (this.CALLreg.test(x)){
			var matchA = this.CALLreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			
			//get stuff
			var functionName = matchA[1];
			var functionArgs = matchA[2];
			while (functionArgs.search(" ") >= 0) {functionArgs = functionArgs.replace(" ",",&*&");}
			while (functionArgs.search("&*&") >= 0) {functionArgs = functionArgs.replace("&*&"," ");}
			
			x = beforeMatch + functionName+"("+functionArgs+")"+afterMatch;
		}

		
		//CLASSES
		while (this.CLSreg.test(x)){
			var matchA = this.CLSreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			
			//get stuff
			var className = matchA[1];
			x = beforeMatch + "class " + className + " {" + afterMatch;
		}
		
		//RETURN COMPILATION
		return x;
	}
	
	static eval(x) {
		x = Mocha_Compile.compileString(x);
		return eval(x);
	}
}

function Mocha(x){
	return eval(Mocha_Compile.compileString(x));
}

//ADD SOME IO MODULES
var str = "

	//IO Modules
	<-say x
	@console.log >> x y:
	
	<-shout x
	@alert >> x y:
	
	<-question x y
	@prompt >> x y:

	<-warn x
	@console.warn >> x:
	
	<-scream x
	@console.error >> x:
	
";

Mocha(str);


