# Mocha
A (very) shorthand version of JavaScript
<br>
<br>
###Adding Mocha to HTML:
```HTML
<script src="https://raw.githubusercontent.com/retroverse/Mocha/master/Mocha.js"></script>
```

###Execute Script
```
var scr = `
say >> 'hello'
`
eval(Mocha(scr));
```

<br>
###Defining Functions
#####JS
```Javascript
function add(x, y) {
  return x + y;
}
```
#####Mocha
```
<-add x y
  @x+y:
```

<br>
###Calling Functions
####JS
```Javascript
clapHands('a lot');
```
####Mocha
```
clapHands >> "a lot"
```

<br>
###Calling Functions with no args
#####JS
```Javascript
clapHands();
```
#####Mocha
```
%clapHands
```

<br>
###Conditions
#####JS
```Javascript
if (happy&&knowsIt) {
  clapHands();
}
```
#####Mocha
```
?? happy&&knowsIt
%clapHands :
```

<br>
###Setting Local Variables
######JS
```Javascript
var a = 1;
```
######Mocha
```
~a = 1
```

<br>
###One Word Strings
######JS
```Javascript
say("Hello");
```
######Mocha
```
say >> #Hello
```

<br>
###Short Strings
######JS
```Javascript
say("Hello There");
```
######Mocha
```
say >> #Hello_There
```

<br>
###Defining a Class
####JS
```Javascript
class Maths {
  static add(x,y) {
    return x + y;
  }
  
  static multiply(x,y) {
    return x*y;
  }
}
```
####Mocha
```
cls Maths
  ~<-add x y
    @x+y:
  
  ~<-multiply x y
    @x*y:
:
```
