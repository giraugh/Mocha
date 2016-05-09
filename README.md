# Mocha
A (very) shorthand version of JavaScript
<br>
<br>
###Adding Mocha to HTML:
```HTML
<script src="https://raw.githubusercontent.com/retroverse/Mocha/master/Mocha.js"></script>
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
###Setting Variables
######JS
```Javascript
a = 1;
```
######Mocha
```
1 -> a
```

<br>
###Setting Local Variables
######JS
```Javascript
var a = 1;
```
######Mocha
```
1 -> ~a
```

<br>
###Calling Functions
####JS
```Javascript
console.log("Im Awesome");
```
####Mocha
```
console.log >> "Im Awesome"
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
