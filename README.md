# Class Mixins

JavaScript is a single-inheritance language, unlike other languages that can 
inherit from multiple base classes, it keeps programming simple and easy to 
understand. But sometimes, when we need to implement some methods that are 
standalone from the main class, defining a middle class is just painful. In this 
case, PHP introduces a mechanism called `trait` to solve the problem. And in 
JavaScript, we have `mixin`.

## Install

```sh
npm i class-mixins
```

## Example

```typescript
import * as mixins from "class-mixins";

class Mixin1 {
    show(str) {
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

### `mixins.mixin(ctor: Function, ...mixins: (object | Function)[])`

This function mixes the given mixins to the given class.

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

When the base class and mixins classes/objects carry the same properties/
methods, the program will follow this rule to apply them:

1. The properties/method defined in the base class are always NO.1.
2. If the property/method is inherited from the supper class, then the one from 
    mixins (must be own property) will override it.
3. If the property from a mixin is inherited from its supper class, then the 
    inherited property in the base class will remain and ignore the mixin's ones.
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
// order to pass type check.
interface MyClass extends B, C { }
class MyClass extends Base {
    get name() { }
}

mixins.mixin(MyClass, B, C);

var ins = new MyClass;

(ins instanceof Base) === true;
(ins instanceof B) === false;
ins.name === A.prototype.name;
ins.echo === Base.prototype.echo;
ins.talk === B.prototype.talk;
ins.show === C.prototype.show;
```

### mixins.mix(...mixins: (object | Function)[]): (ctor: Function) => void

This is a decorator designed for TypeScript and Babel.

### mixins.Mixed(base: Function, ...mixins: (object | Function)[])

This function will internally create and return an anonymous class that extends 
the base class, the mixins will be merged to the pivot class instead of binding 
to the base class.

In TypeScript, this function accepts no more than six mixins in order to get
auto type hint, but if you pass more that six mixins, you must define the
generic type manually.

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

class F {
    // ...
}

class G {
    // ...
}

class H {
    // ...
}

class Base { }

// will automatically get typed
class MyClass extends mixins.Mixed(Base, A, B, C, D) {
    // ...
}

// must explicitly provide the types
interface Mixins extends A, B, C, D, E, F, G, H { }
class MyClass2 extends mixins.Mixed<Base, Mixins>(Base, A, B, C, D, E, F, G, H) {
    // ...
}

var mine = new MyClass;
(mine instanceof Base) === true;
```