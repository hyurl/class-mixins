"use strict";

/**
 * Mixes properties and methods from the given sources to the target class.
 * @param {Function} target 
 */
function mixin(target) {
    /** @type {any[]} */
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i in sources) {
        var source = sources[i];

        if (typeof source == "object") {
            mergeIfNotExists(target.prototype, source);
        } else if (typeof source == "function") {
            mergeHierarchy(target, source);
        } else {
            throw new TypeError("sources must be either objects or functions");
        }
    }
}
exports.mixin = mixin;

/**
 * A decorator used directly on the class.
 */
function mix() {
    var sources = Array.prototype.slice.call(arguments);
    return function (ctor) {
        mixin.apply(void 0, [ctor].concat(sources));
    }
}
exports.mix = mix;

/**
 * Returns an extended class combined all mixin functions.
 * @param {Function} base 
 */
function Mixed(base) {
    var Mixed = class extends base { },
        sources = Array.prototype.slice.call(arguments, 1);
    mixin.apply(void 0, [Mixed].concat(sources));
    return Mixed;
}
exports.Mixed = Mixed;

/**
 * Merges properties and methods only if they're missing in the target class. 
 * @param {any} target 
 * @param {any} source 
 * @param {boolean} mergeSuper 
 */
function mergeIfNotExists(target, source, mergeSuper) {
    var props = Object.getOwnPropertyNames(source);

    for (var i in props) {
        var prop = props[i];

        if (prop == "constructor") {
            continue;
        } else if (mergeSuper) {
            // When merging properties from super classes, the properties in the
            // target's super classes has the major priority, then the sources 
            // and their super classes share the priority from left to right.
            if (!(prop in target)) {
                setProp(target, source, prop);
            }
        } else {
            if (!target.hasOwnProperty(prop)) {
                setProp(target, source, prop);
            }
        }
    }

    return target;
}

/**
 * Sets property for target based on the given source and prop name properly.
 * @param {any} target 
 * @param {any} source 
 * @param {string} prop 
 */
function setProp(target, source, prop) {
    var desc = Object.getOwnPropertyDescriptor(source, prop);
    if (desc) {
        Object.defineProperty(target, prop, desc);
    } else {
        target[prop] = source[prop];
    }
}

/**
 * Merges properties and methods across the prototype chain.
 * @param {Function} target 
 * @param {Function} source 
 * @param {boolean} mergeSuper 
 */
function mergeHierarchy(target, source, mergeSuper) {
    mergeIfNotExists(target.prototype, source.prototype, mergeSuper);

    var _super = Object.getPrototypeOf(source);

    // Every user defined class or functions that can be instantiated have their
    // own names, if no name appears, that means the function has traveled to 
    // the root of the hierarchical tree.
    if (_super.name) {
        mergeHierarchy(target, _super, true);
    }
}