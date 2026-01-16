/**
 * Ref: How to Implement Debounce and Throttle with JavaScript
 * https://webdesign.tutsplus.com/tutorials/javascript-debounce-and-throttle--cms-36783
 */
export const debounce = <R, A extends unknown[]>(
  callback: (...args: A) => R,
  time = 300,
) => {
  let debounceTimer: undefined | number;

  const debouncer = (...args: A) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      callback(...args);
    }, time);
  };

  return debouncer;
};