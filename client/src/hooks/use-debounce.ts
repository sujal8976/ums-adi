import { useCallback, useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  // Store the callback in a ref to maintain its identity
  const callbackRef = useRef(callback);

  // Update the ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Store the timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Return memoized debounced callback
  return useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay], // Only recreate if delay changes
  );
}
