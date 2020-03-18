declare namespace mixins {
    type Constructor<T> = Function & { prototype: T }

    /**
     * Mixes properties and methods from the given mixins to the class.
     */
    function mixin<T>(
        ctor: Constructor<T>,
        ...mixins: (object | Constructor<object>)[]
    ): void;

    /**
     * A decorator used directly on the class.
     */
    function mix<T>(
        ...mixins: (object | Constructor<object>)[]
    ): (ctor: Constructor<T>) => void;

    /**
     * Returns an extended class combined all mixin functions.
     */
    function Mixed<T, A>(
        base: Constructor<T>,
        mixin1: Constructor<A>
    ): new (...args: any[]) => T & A;
    function Mixed<T, A, B>(
        base: Constructor<T>,
        mixin1: Constructor<A>,
        mixin2: Constructor<B>
    ): new (...args: any[]) => T & A & B;
    function Mixed<T, A, B, C>(
        base: Constructor<T>,
        mixin1: Constructor<A>,
        mixin2: Constructor<B>,
        mixin3: Constructor<C>
    ): new (...args: any[]) => T & A & B & C;
    function Mixed<T, A, B, C, D>(
        base: Constructor<T>,
        mixin1: Constructor<A>,
        mixin2: Constructor<B>,
        mixin3: Constructor<C>,
        mixin4: Constructor<D>
    ): new (...args: any[]) => T & A & B & C & D;
    function Mixed<T, A, B, C, D, E>(
        base: Constructor<T>,
        mixin1: Constructor<A>,
        mixin2: Constructor<B>,
        mixin3: Constructor<C>,
        mixin4: Constructor<D>,
        mixin5: Constructor<E>
    ): new (...args: any[]) => T & A & B & C & D & E;
    function Mixed<T, A, B, C, D, E, F>(
        base: Constructor<T>,
        mixin1: Constructor<A>,
        mixin2: Constructor<B>,
        mixin3: Constructor<C>,
        mixin4: Constructor<D>,
        mixin5: Constructor<E>,
        mixin6: Constructor<F>
    ): new (...args: any[]) => T & A & B & C & D & E & F;
    function Mixed<T, M>(
        base: Constructor<T>,
        ...mixins: Constructor<any>[]
    ): new (...args: any[]) => T & M;
}

export = mixins;