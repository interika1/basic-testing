import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously,
} from '06-mocking-node-api';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');
describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const intervalCount = 5;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    for (let i = 0; i < intervalCount; i++) {
      jest.runOnlyPendingTimers();
      expect(callback).toHaveBeenCalledTimes(i + 1);
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';

    jest.mocked(existsSync).mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'test content';
    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(readFile).mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
  });
});
