type Constructor<T> = Function & { prototype: T; };

/**
 * Mixes properties and methods from the given mixins to the class.
 */
export function mixin<T>(
    ctor: Constructor<T>,
    ...mixins: (object | Constructor<object>)[]
): void {
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

/**
 * A decorator used directly on the class.
 */
export function mix<T>(
    ...mixins: (object | Constructor<object>)[]
): (ctor: Constructor<T>) => void {
    return function (ctor) {
        mixin(ctor, ...mixins);
    };
}

/**
 * Returns an extended class combined all mixin functions.
 */
export function Mixed<T, A>(
    base: Constructor<T>,
    mixin1: Constructor<A>
): new (...args: any[]) => T & A;
export function Mixed<T, A, B>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>
): new (...args: any[]) => T & A & B;
export function Mixed<T, A, B, C>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>
): new (...args: any[]) => T & A & B & C;
export function Mixed<T, A, B, C, D>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>
): new (...args: any[]) => T & A & B & C & D;
export function Mixed<T, A, B, C, D, E>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>
): new (...args: any[]) => T & A & B & C & D & E;
export function Mixed<T, A, B, C, D, E, F>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>,
    mixin6: Constructor<F>
): new (...args: any[]) => T & A & B & C & D & E & F;
export function Mixed<T, A, B, C, D, E, F, G>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>,
    mixin6: Constructor<F>,
    mixin7: Constructor<G>
): new (...args: any[]) => T & A & B & C & D & E & F & G;
export function Mixed<T, A, B, C, D, E, F, G, H>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>,
    mixin6: Constructor<F>,
    mixin7: Constructor<G>,
    mixin8: Constructor<H>
): new (...args: any[]) => T & A & B & C & D & E & F & G & H;
export function Mixed<T, A, B, C, D, E, F, G, H, I>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>,
    mixin6: Constructor<F>,
    mixin7: Constructor<G>,
    mixin8: Constructor<H>,
    mixin9: Constructor<I>
): new (...args: any[]) => T & A & B & C & D & E & F & G & H & I;
export function Mixed<T, A, B, C, D, E, F, G, H, I, J>(
    base: Constructor<T>,
    mixin1: Constructor<A>,
    mixin2: Constructor<B>,
    mixin3: Constructor<C>,
    mixin4: Constructor<D>,
    mixin5: Constructor<E>,
    mixin6: Constructor<F>,
    mixin7: Constructor<G>,
    mixin8: Constructor<H>,
    mixin9: Constructor<I>,
    mixin10: Constructor<J>
): new (...args: any[]) => T & A & B & C & D & E & F & G & H & I & J;
export function Mixed<T, M>(
    base: Constructor<T>,
    ...mixins: Constructor<any>[]
): new (...args: any[]) => T & M;
export function Mixed(
    base: Constructor<any>,       // must use Constructor, otherwise it will not
    ...mixins: Constructor<any>[] // pass compilation in Deno, reason is unknown.
) {
    let ctor = class extends (<any>base) { };
    mixin(ctor, ...mixins);
    return ctor as any;
}

/**
 * Merges properties and methods only if they're missing in the class. 
 */
function mergeIfNotExists(proto: object, source: object, mergeSuper = false) {
    let props = Reflect.ownKeys(source);

    for (let prop of props) {
        if (prop == "constructor") {
            continue;
        } else if (mergeSuper) {
            // When merging properties from super classes, the properties in the
            // base super classes has the major priority, then the mixins 
            // and their super classes share the priority from left to right.
            if (!(prop in proto)) {
                setProp(proto, source, <string | symbol>prop);
            }
        } else if (!proto.hasOwnProperty(prop)) {
            setProp(proto, source, <string | symbol>prop);
        }
    }

    return proto;
}

/**
 * Merges properties and methods across the prototype chain.
 */
function mergeHierarchy(ctor: Function, mixin: Function, mergeSuper = false) {
    mergeIfNotExists(ctor.prototype, mixin.prototype, mergeSuper);

    let _super = Object.getPrototypeOf(mixin);

    // Every user defined class or functions that can be instantiated have their
    // own names, if no name appears, that means the function has traveled to 
    // the root of the hierarchical tree.
    if (_super.name) {
        mergeHierarchy(ctor, _super, true);
    }
}

/**
 * Sets property for prototype based on the given source and prop name properly.
 */
function setProp(proto: any, source: any, prop: string | symbol) {
    let desc = Object.getOwnPropertyDescriptor(source, prop);

    if (desc) {
        Object.defineProperty(proto, prop, desc);
    } else {
        proto[prop] = source[prop];
    }
}
