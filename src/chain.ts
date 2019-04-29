/**
 * @license
 *
 * Copyright (c) 2019 Leung Ho Pan Alvin. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface Chain<T> {
    readonly value: T;
    do<U>(func: ChainMethod<T, U>): Chain<U>;
}

export interface ChainMethod<T, U> {
    (val: T): U;
}

export const chain = <T>(val: T): Chain<T> => ({
    get value() {
        return val;
    },
    do(func) {
        return chain(func(val));
    }
});



export interface Todo<T, U> extends ChainMethod<T, U> {
    readonly wrapped: (arg: T) => U;
    do<V>(next: ChainMethod<U, V>): Todo<T, V>;
}

export const todo = <T, U>(func: ChainMethod<T, U>): Todo<T, U> => Object.assign(
    (val: T) => func(val),
    {
        get wrapped() {
            return func;
        },
        do<V>(next: ChainMethod<U, V>) {
            return todo((val: T) => next(func(val)));
        }
    } as const
);
