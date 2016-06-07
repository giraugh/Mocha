# Mocha
A (very) shorthand version of JavaScript
<br>
<br>
###Adding Mocha to HTML:
```HTML
<script src="https://rawgit.com/retroverse/Mocha/master/Mocha.js"></script>
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
  @x+y
end
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
if (happy && knowsIt) {
  clapHands();
}
```
#####Mocha
```
iff happy && knowsIt
   %clapHands
end
```

<br>
###Inline Conditions (Ternary)
#####JS
```Javascript
if (happy&&knowsIt) {
  clapHands();
}
```
#####Mocha
```
%clapHands ?? happy && knowsIt
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
###Multiline Strings
######JS
```Javascript
`
MULTI..
LINE
`
```
######Mocha
```
"
MULTI..
LINE
"
```

<br>
###For loops
######JS
```Javascript
for (var i=0;i<11;i++) {
  say(i);
}
```
######Mocha
```
for i=0.10 say>>i end
//or
ofor i=0 i<11 i++ say>>i end
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
    @x+y
  end

  ~<-multiply x y
    @x*y
  end
end
```

<br>
###String Interpolation
In mocha you can use string interpolation like this:
```
~Apples = 3
say >> "I have #{Apples} apples" //'I have 3 apples'
```


<br>
###Inline Terminators
Sometimes you need some more control when inline programming
(which is what Mocha is good at)

For instance:
```say >> #Im_Happy ?? happy ```
produces
```Javascript
say("Im, Happy", if (,) { happy, )
```
so instead we use the ```|``` Terminator:<br>
```say >> #Im_Happy| ?? happy```<br>
It can also be used to terminate function definitions (instead of ```;```)

####The ```;``` Terminator
You can also use ```;``` to terminate
but the ```;``` terminator also adds a line break.
