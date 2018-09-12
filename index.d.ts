declare namespace mixins {
    type Constructor<T> = new (...args) => T;
    function mixin(target: Function, ...sources: (object | Function)[]): void;
    function mix(...sources: (object | Function)[]): (ctor: Function) => void;
    function Mixed<T, A>(
        base: Constructor<T>,
        source1: Constructor<A>
    ): Constructor<T> & Constructor<A>;
    function Mixed<T, A, B>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>
    ): Constructor<T> & Constructor<A> & Constructor<B>;
    function Mixed<T, A, B, C>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>
    ): Constructor<T> & Constructor<A> & Constructor<B> & Constructor<C>;
    function Mixed<T, A, B, C, D>(
        base: Constructor<T>,
        source1: Constructor<A>,
        source2: Constructor<B>,
        source3: Constructor<C>,
        source4: Constructor<D>
    ): Constructor<T> & Constructor<A> & Constructor<B> & Constructor<C> & Constructor<D>;
    function Mixed<T, K>(base: Constructor<T>, ...sources: Constructor<any>[]): Constructor<T> & Constructor<K>;
}

export = mixins;