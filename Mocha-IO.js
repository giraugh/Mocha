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

