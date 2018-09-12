"use strict";

const mixins = require(".");
const tslib = require("tslib");
const assert = require("assert");

describe("mixins.mixin(target: Function, ...sources: (any | Function)[])", () => {
    it("should extend class prototype from an object", () => {
        class A { }
        mixins.mixin(A, {
            show() { }
        })
        assert.equal(typeof A.prototype.show, "function");
    });

    it("should extend class prototype from two objects", () => {
        class A { }
        mixins.mixin(A,
            {
                show() { }
            },
            {
                display() { }
            }
        );
        assert.equal(typeof A.prototype.show, "function");
        assert.equal(typeof A.prototype.display, "function");
    });

    it("should extend class prototype from another class", () => {
        class A { }
        class B {
            show() { }
        }
        mixins.mixin(A, B);
        assert.equal(typeof A.prototype.show, "function");
    });

    it("should extend class prototype from two other classes", () => {
        class A { }
        class B {
            show() { }
        }
        class C {
            display() { }
        }
        mixins.mixin(A, B, C);
        assert.equal(typeof A.prototype.show, "function");
        assert.equal(typeof A.prototype.display, "function");
    });

    it("should extend class prototype from another class and remain existing properties", () => {
        class A {
            get name() { return this.constructor.name; }
            show() { console.log("Hello, World"); }
        }
        class B {
            get name() {
                return "B";
            }
            show() { }
            display() { }
        }
        let C = {
            show: function () { },
            echo: function () { }
        };

        mixins.mixin(A, B, C);
        assert.equal(A.prototype.name, 'A');
        assert.equal(A.prototype.show.toString(), 'show() { console.log("Hello, World"); }');
        assert.equal(typeof A.prototype.display, "function");
        assert.equal(typeof A.prototype.echo, "function");
    });

    it("should extend class prototype from another class's parent", () => {
        class A { }
        class B {
            get name() { return this.constructor.name }
            show() { }
        }
        class C extends B {
            display() { }
        }
        mixins.mixin(A, C);
        assert.equal(A.prototype.name, "A");
        assert.equal(typeof A.prototype.show, "function");
        assert.equal(typeof A.prototype.display, "function");
        assert.deepStrictEqual(Object.getOwnPropertyNames(A.prototype), ["constructor", "display", "name", "show"]);
    });
});

describe("@mixins.mix(...sources: (any | Function)[])", () => {
    it("should extend class prototype via mix decorator", () => {
        class A { }
        class B {
            get name() { return this.constructor.name }
            show() { }
        }
        class C extends B {
            display() { }
        }
        tslib.__decorate([
            mixins.mix(C)
        ], A);
        assert.equal(A.prototype.name, "A");
        assert.equal(typeof A.prototype.show, "function");
        assert.equal(typeof A.prototype.display, "function");
        assert.deepStrictEqual(Object.getOwnPropertyNames(A.prototype), ["constructor", "display", "name", "show"]);
    });
});

describe("class extends mixins.Mixed(base: Function, ...sources: (any | Function)[])", () => {
    it("should define a class extends the base class and mix with the given sources", () => {
        class B {
            get name() { return this.constructor.name }
            show() { }
        }
        class C {
            display() { }
        }
        class A extends mixins.Mixed(B, C) { }

        assert.equal(A.prototype.name, "A");
        assert.equal(typeof A.prototype.show, "function");
        assert.equal(typeof A.prototype.display, "function");
        assert.deepStrictEqual(Object.getOwnPropertyNames(A.prototype), ["constructor"]);
        assert.ok(new A() instanceof A);
        assert.ok(new A() instanceof B);
        assert.ok(!(new A() instanceof C));
    });
});