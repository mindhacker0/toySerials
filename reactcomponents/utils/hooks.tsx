import { useCallback, useRef } from "react";

type FunctionWithDeps<Args extends any[], Return> = (...args: Args) => Return;

export const useMemorizedFn = <Args extends any[], Return>(
  fn: FunctionWithDeps<Args, Return>,
  dependencies: React.DependencyList,
): FunctionWithDeps<Args, Return> => {
  const fnRef = useRef<FunctionWithDeps<Args, Return> | undefined>();
  fnRef.current = fn;

  return useCallback((...args: Args) => {
    if (fnRef.current) {
      return fnRef.current(...args) as Return;
    }
    return undefined as Return;
  }, dependencies);
};