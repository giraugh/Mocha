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

		//HIDE ALL STRINGS INTO ARRAY
		this.strings = [];
		this.STRreg = /(?:")([^"]*)(?:")/im;
		this.RECreg = /(?:!!!)([\s\S]*?)(?:!!!)/im;

		//DEBUGGING stuff
		const doRecoverStrings = true;

		while (this.STRreg.test(x)){
			var matchA = this.STRreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			this.strings.push(matchA[1]); //add to array
			x = beforeMatch + "!!!"+(this.strings.length-1).toString()+"!!!" +afterMatch;
		}

		x = "\n" + x;
		x = x + "\n";

		//AUTO STRINGS
		this.ASRreg = /#([^\s\n:;\|},]+)/i;
		while (this.ASRreg.test(x)){
			var matchA = this.ASRreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			var stringValue = matchA[1];
			while (stringValue.search("_") >= 0) {stringValue = stringValue.replace("_"," ");}
			x = beforeMatch + '"' + stringValue + '"' + afterMatch;
		}

		//BREAK UP
		while (x.search(";") >= 0) {
			x = x.replace(";","\n");
		}

		this.FUNCreg = /<-(?:\s?)(\S+?)\s(.+)[\r\n\|]/im;
		this.VARreg = /(\S*)\s?->\s?([^\s;]*)/i;
		this.CALLreg = /(\S+)\s?>>\s?([^;}\|\n]+)/i;
		this.CALL2reg = /%\s?([^\s\;\\]+)/i;
		this.CLSreg = /(?:<>|cls)\s?(\S+)/i;
		this.CHKreg = /(?:\?\?|iff)\s?(\S+)/i;
		this.TRNreg = /([^;:\n]+)\s(?:\?\?|iff)\s([^;:\n]+)(?::|}|;|\n|\r)/i;
		this.INTreg = /`([^"]*)#{([^}"]*)}([^"]*)`/i;
		this.FORreg = /for\s?([a-z]+)\s?=\s?([0-9a-z]+)\s?\.\.?\s?([0-9a-z]+)/i;
		this.OFRreg = /ofor(?:\s|\|)(\S+)(?:\s|\|)(\S+)(?:\s|\|)(\S+)/i;

		//FUNCTIONS
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

		//NO ARG FUNCTION CALLS
		while (this.CALL2reg.test(x)){
			var matchA = this.CALL2reg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			//get stuff
			var functionName = matchA[1];
			x = beforeMatch + functionName+"()"+afterMatch;
		}

		//OLD FORS
		while (this.OFRreg.test(x)){
			var matchA = this.OFRreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			//get stuff
			var definition = matchA[1];
			var condition = matchA[2];
			var expression = matchA[3];
			x = beforeMatch + 'for ('+definition+';'+condition+';'+expression+'){' + afterMatch;
		}

		//FORS
		while (this.FORreg.test(x)){
			var matchA = this.FORreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			//get stuff
			var iterator = matchA[1];
			var min = matchA[2];
			var max = matchA[3];
			x = beforeMatch + 'for ('+iterator+' = '+min+';'+iterator+'<'+max+'+1;'+iterator+'++) {' + afterMatch;
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

		//TERNS
		while (this.TRNreg.test(x)){
			var matchA = this.TRNreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			//get stuff
			var expression = matchA[1];
			var condition = matchA[2];
			x = beforeMatch + "if (" + condition + ") {\n"+expression+"}" + afterMatch;
		}

		//IF'S
		while (this.CHKreg.test(x)){
			var matchA = this.CHKreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);

			//get stuff
			var condition = matchA[1];
			x = beforeMatch + "if (" + condition + ") {" + afterMatch;
		}

		//SHOW STRINGS FROM ARRAY
		if (doRecoverStrings) {
			while (this.RECreg.test(x)){
				var matchA = this.RECreg.exec(x);
				var matchStr = matchA[0];
				var matchI = x.indexOf(matchStr);
				var beforeMatch = x.substr(0,matchI);
				var afterMatch = x.substr(matchI+matchStr.length,x.length);
				x = beforeMatch + "`"+this.strings[matchA[1]]+"`" +afterMatch;
			}
		}

		//STRING INTERPOLATION
		while (this.INTreg.test(x)){
			var matchA = this.INTreg.exec(x);
			var matchStr = matchA[0];
			var matchI = x.indexOf(matchStr);
			var beforeMatch = x.substr(0,matchI);
			var afterMatch = x.substr(matchI+matchStr.length,x.length);
			x = beforeMatch + '`' + matchA[1] + '` + ' + matchA[2] + ' + `'+matchA[3] + '`' + afterMatch;
		}

		//REMOVE SEPERATORS
		x = x.replace(/\|{1}/g,"");


		//RETURN COMPILATION
		return x;
	}

	static eval(x) {
		x = Mocha_Compile.compileString(x);
		return eval(x);
	}
}

function Mocha(x) {
	return Mocha_Compile.compileString(x);
}


//BUILT IN
var str = `
		//IO Modules
			<-say x
			@console.log >> x:

			<-shout x
			@alert >> x:

			<-question x y
			@prompt >> x y:

			<-warn x
			@console.warn >> x:

			<-scream x
			@console.error >> x:
`;
eval(Mocha(str));
