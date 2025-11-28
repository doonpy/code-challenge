// Assume that the input is always a positive integer


/**
 * Sum of the first n natural numbers using a loop
 * Time complexity: O(n)
 * Space complexity: O(1)
 * 
 * @param {number} n 
 * @returns number
 */
function sumToNLoop(n) {
  if(n < 1) return 0;

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Sum of the first n natural numbers using a recursive function
 * Time complexity: O(n)
 * Space complexity: O(n) - due to the call stack
 * 
 * @param {number} n 
 * @returns number
 */
function sumToNRecursive(n) {
  if (n === 0) return 0;

  return n + sumToNRecursive(n - 1);
}

/**
 * Sum of the first n natural numbers using a formula
 * Time complexity: O(1)
 * Space complexity: O(1)
 * 
 * @param {number} n 
 * @returns number
 */
function sumToNFormula(n) {
  if(n < 1) return 0;

  return (n * (n + 1)) / 2;
}
