// vim: syntax=typescript

type Ok<T> = T;
type Err<E> = E;

interface Result<T, E> = Ok<T> | Err<E>;
