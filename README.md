# Class Mixins

JavaScript is a single-inheritance language, unlike other languages that can 
inherit from multiple base classes, it keeps programming simple and easy to 
understand. But sometimes, when we need to implement some methods that are 
standalone from the main class, defining a middle class is just painful. In this 
case, PHP introduces a mechanism called `trait` to solve the problem. And in 
JavaScript, we have `mixin`.

## Purpose

I build this package because although there are a lot implementations on NPM, 
but they either don't directly support mixing classes or not friendly to use, so
I decide to build my own.

To implement a mixin is easy, what is not easy is how you pick the properties 
and methods from the given sources, and from their super classes. So I check out
the documentation of PHP trait and Python's multi-inheritance, and come up with 
this package.

## Simple Example

(In TypeScript, JavaScript doesn't support decorators)

```typescript
import * as mixins from "class-mixins";

class Mixin1 {
    show(str: string) {
        console.log(str);
    }
}

@mixins.mix(Mixin1)
class Main1 {
    // the class `Main1` now will have the method `show`
}

class Main2 { }
mixins.mixin(Main2, Mixin1); // class `Main1` will also have the method `show`

class Base1 {
    show() { }
}

class Main3 extends mixins.Mixed(Base1, Mixin1) {
    // Main3 will inherit `show` from `Base1`, and ignore the one comes from `Mixin1`
}

class Base2 {
    display() {}
}

class Main4 extends mixins.Mixed(Base2, Mixin1) {
    // Main4 will inherit `display` from `Base1` and mix `show` from `Mixin1`
}
```

## API

### `mixins.mixin(target: Function, ...sources: (object | Function)[])`

This function mixes the given sources to the target class (function). Normally 
we would set the sources classes, but it also support an standard object that 
carries functions.

```javascript
const mixins = require("class-mixins");

class A {
    show(str) { console.log(str) }
}

class B {
    display(str) { return this.show(str) }
}

class MyClass { }

// Mix both class A and class B into MyClass
mixins.mixin(MyClass, A, B);

// You can also mix with an object
mixins.mixin(MyClass, {
    echo(str) {
        return this.show(str);
    }
});

console.log(MyClass.prototype.show); // => [Function: show]
console.log(MyClass.prototype.display); // => [Function: display]
console.log(MyClass.prototype.echo); // => [Function: echo]
```

#### Naming Conflict and Priority

When the target class and source classes/objects carry the same properties/
methods, the program will follow this rule to apply them:

1. The properties/method defined in the target class are always NO.1.
2. If the property/method is inherited from the supper class, then the one from 
    mixins (must be own property) will overwrite it.
3. If the property from a mixin is inherited from its supper class, then the 
    inherited property in the target class will remain and ignore the mixin's.
4. The program will travel the whole prototype chain of a mixin to copy 
    properties and methods.
5. The mixins follow the order of Left-To-Right when copying properties and 
    methods.

```typescript
class A {
    echo() { }
}

class B extends A {
    get name() { }
    talk() { }
}

class C {
    echo() { }
    show() { }
}

class Base {
    echo() { }
    talk() { }
    show() { }
}

// In TypeScript, you must declare the interface with the same name as class in 
// order to pass the type check.
interface MyClass extends B, C { }
class MyClass extends Base {
    get name() { }
}

mixins.mixin(MyClass, B, C);

var ins = new MyClass;

(ins instanceof Base) == true;
(ins instanceof B) == false;
ins.name === A.prototype.name;
ins.echo === Base.prototype.echo;
ins.talk === B.prototype.talk;
ins.show === C.prototype.show;
```

### mixins.mix(...sources: (object | Function)[]): (ctor: Function) => void

This is a decorator designed for TypeScript and Babel.

### mixins.Mixed(base: Function, ...sources: (object | Function)[])

This function will internally create and return an anonymous class that extends 
the base class, the mixins will be merged to the middle class instead of binding 
to the base class.

In TypeScript, this function accepts no more than four mixins and you don't have
to explicitly define the returning type, but if you pass more that four mixins, 
you must define the generic type manually.

```typescript
class A {
    // ...
}

class B {
    // ...
}

class C {
    // ...
}

class D {
    // ...
}

class E {
    // ...
}

class Base { }

class MyClass extends mixins.Mixed(Base, A, B, C, D) {
    // will pass the type check since the mixins count is four
}

interface Mixed extends A, B, C, D, E { }
class MyClass2 extends mixins.Mixed<Base, Mixed>(Base, A, B, C, D, E) {
    // must explicitly dprovide the types
}

var mine = new MyClass;
(mine instanceof Base) == true;
```