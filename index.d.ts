declare namespace mixins {
    type Constructor<T> = Function & { prototype: T }

    /**
     * Mixes properties and methods from the given sources to the target class.
     */
    function mixin(target: Function, ...sources: (object | Function)[]): void;

    /**
     * A decorator used directly on the class.
     */
    function mix(...sources: (object | Function)[]): (ctor: Function) => void;

    /**
     * Returns an extended class combined all mixin functions.
     */
    function Mixed<T, A>(
        base: Constructor<T>,
        source1: Constructor<A>
    ): new (...args: any[]) => T & A;
    function Mixed<T, A, B>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>
    ): new (...args: any[]) => T & A & B;
    function Mixed<T, A, B, C>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>
    ): new (...args: any[]) => T & A & B & C;
    function Mixed<T, A, B, C, D>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>,
        source4: Constructor<D>
    ): new (...args: any[]) => T & A & B & C & D;
    function Mixed<T, A, B, C, D, E>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>,
        source4: Constructor<D>,
        source5: Constructor<E>
    ): new (...args: any[]) => T & A & B & C & D & E;
    function Mixed<T, A, B, C, D, E, F>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>,
        source4: Constructor<D>,
        source5: Constructor<E>,
        source6: Constructor<F>
    ): new (...args: any[]) => T & A & B & C & D & E & F;
}

export = mixins;