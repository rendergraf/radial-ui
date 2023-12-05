import { useCallback } from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

export function setRef<T>(ref: PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T) => { refs.forEach((ref) => { setRef(ref, node); }); };
}

export function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void {
  return useCallback(composeRefs(...refs), refs);
}
