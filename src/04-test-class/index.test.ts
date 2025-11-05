import { random } from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const startValue = 10;
    const account = getBankAccount(startValue);
    expect(account.getBalance()).toBe(startValue);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const startValue = 10;
    const withdrawValue = 20;
    const account = getBankAccount(startValue);
    expect(() => account.withdraw(withdrawValue)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const startValue = 10;
    const transferValue = 20;
    const account = getBankAccount(startValue);
    const accountDestination = getBankAccount(startValue);
    expect(() => account.transfer(transferValue, accountDestination)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const startValue = 10;
    const transferValue = 20;
    const account = getBankAccount(startValue);

    expect(() => account.transfer(transferValue, account)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const startValue = 10;
    const depositValue = 20;
    const account = getBankAccount(startValue);
    account.deposit(depositValue);
    expect(account.getBalance()).toBe(startValue + depositValue);
  });

  test('should withdraw money', () => {
    const startValue = 10;
    const withdrawValue = 5;
    const account = getBankAccount(startValue);
    account.withdraw(withdrawValue);
    expect(account.getBalance()).toBe(startValue - withdrawValue);
  });

  test('should transfer money', () => {
    const startValue = 10;
    const withdrawValue = 5;
    const accountSource = getBankAccount(startValue);
    const accountTarget = getBankAccount(startValue);
    accountSource.transfer(withdrawValue, accountTarget);
    expect(accountSource.getBalance()).toBe(startValue - withdrawValue);
    expect(accountTarget.getBalance()).toBe(startValue + withdrawValue);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const startValue = 10;
    const account = getBankAccount(startValue);

    jest.mocked(random).mockReturnValue(1);
    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const startValue = 10;
    const newBalance = 15;
    const account = getBankAccount(startValue);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(newBalance);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const startValue = 10;
    const newBalance = null;
    const account = getBankAccount(startValue);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(newBalance);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
