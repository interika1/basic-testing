import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({
      a: 10,
      b: 13,
      action: Action.Add,
    });
    expect(result).toBe(23);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({
      a: 10,
      b: 13,
      action: Action.Subtract,
    });
    expect(result).toBe(-3);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({
      a: 10,
      b: 13,
      action: Action.Multiply,
    });
    expect(result).toBe(130);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({
      a: 13,
      b: 10,
      action: Action.Divide,
    });
    expect(result).toBe(1.3);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 13,
      b: 10,
      action: Action.Exponentiate,
    });
    expect(result).toBe(137858491849);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({
      a: 13,
      b: 10,
      action: 'INVALID_ACTION',
    });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({
      a: 'n',
      b: 10,
      action: Action.Add,
    });
    expect(result).toBeNull();
  });
});
