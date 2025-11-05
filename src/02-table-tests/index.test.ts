import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 10, b: 13, action: Action.Add, expected: 23 },
  { a: 10, b: 13, action: Action.Subtract, expected: -3 },
  { a: 10, b: 13, action: Action.Multiply, expected: 130 },
  { a: 13, b: 10, action: Action.Divide, expected: 1.3 },
  { a: 13, b: 10, action: Action.Exponentiate, expected: 137858491849 },
  { a: 13, b: 10, action: 'INVALID_ACTION', expected: null },
  { a: 'n', b: 10, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return ${expected} when action: ${action}, a: ${a} and b: ${b}',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
