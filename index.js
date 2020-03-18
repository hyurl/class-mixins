"use strict";

/**
 * Mixes properties and methods from the given mixins to the class.
 * @param {Function} ctor 
 * @param {(object | Function)[]} mixins
 */
function mixin(ctor, ...mixins) {
    for (let _mixin of mixins) {
        if (_mixin && typeof _mixin == "object") {
            mergeIfNotExists(ctor.prototype, _mixin);
        } else if (typeof _mixin == "function") {
            mergeHierarchy(ctor, _mixin);
        } else {
            throw new TypeError("A mixin must be either an object or a function");
        }
    }
}
exports.mixin = mixin;

/**
 * A decorator used directly on the class.
 * @param {(object | Function)[]} mixins
 * @returns {(ctor: Function) => void}
 */
function mix(...mixins) {
    return function (ctor) {
        mixin(ctor, ...mixins);
    }
}
exports.mix = mix;

/**
 * Returns an extended class combined all mixin functions.
 * @param {Function} base 
 * @param {(object | Function)[]} mixins
 */
function Mixed(base, ...mixins) {
    let ctor = class extends base { };
    mixin(ctor, ...mixins);
    return ctor;
}
exports.Mixed = Mixed;

/**
 * Merges properties and methods only if they're missing in the class. 
 * @param {object} proto 
 * @param {object} source 
 * @param {boolean} mergeSuper 
 */
function mergeIfNotExists(proto, source, mergeSuper = false) {
    let props = Reflect.ownKeys(source);

    for (let prop of props) {
        if (prop == "constructor") {
            continue;
        } else if (mergeSuper) {
            // When merging properties from super classes, the properties in the
            // base super classes has the major priority, then the mixins 
            // and their super classes share the priority from left to right.
            if (!(prop in proto)) {
                setProp(proto, source, prop);
            }
        } else if (!proto.hasOwnProperty(prop)) {
            setProp(proto, source, prop);
        }
    }

    return proto;
}

/**
 * Sets property for prototype based on the given source and prop name properly.
 * @param {object} proto 
 * @param {object} source 
 * @param {string|symbol} prop 
 */
function setProp(proto, source, prop) {
    let desc = Object.getOwnPropertyDescriptor(source, prop);

    if (desc) {
        Object.defineProperty(proto, prop, desc);
    } else {
        proto[prop] = source[prop];
    }
}

/**
 * Merges properties and methods across the prototype chain.
 * @param {Function} ctor 
 * @param {Function} mixin 
 * @param {boolean} mergeSuper 
 */
function mergeHierarchy(ctor, mixin, mergeSuper = false) {
    mergeIfNotExists(ctor.prototype, mixin.prototype, mergeSuper);

    let _super = Object.getPrototypeOf(mixin);

    // Every user defined class or functions that can be instantiated have their
    // own names, if no name appears, that means the function has traveled to 
    // the root of the hierarchical tree.
    if (_super.name) {
        mergeHierarchy(ctor, _super, true);
    }
}