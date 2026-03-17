const fs = require('fs');
const path = require('path');
const {
  readBalance,
  writeBalance,
  runAccountOperation,
  handleMenuChoice,
} = require('./index');

const TEST_BALANCE_FILE = path.join(__dirname, 'test-balance.json');

beforeEach(() => {
  if (fs.existsSync(TEST_BALANCE_FILE)) {
    fs.unlinkSync(TEST_BALANCE_FILE);
  }
});

afterEach(() => {
  if (fs.existsSync(TEST_BALANCE_FILE)) {
    fs.unlinkSync(TEST_BALANCE_FILE);
  }
});

test('TC-01 View initial balance is 1000.00', () => {
  const initialBalance = readBalance(TEST_BALANCE_FILE);
  expect(initialBalance).toBe(1000.0);
});

test('TC-02 Credit account with valid amount updates balance', () => {
  writeBalance(1000.0, TEST_BALANCE_FILE);
  const current = readBalance(TEST_BALANCE_FILE);
  const result = runAccountOperation('CREDIT', current, 250.0);
  expect(result.error).toBeUndefined();
  expect(result.newBalance).toBe(1250.0);
  expect(result.message).toBe('Amount credited. New balance: 1250.00');
  writeBalance(result.newBalance, TEST_BALANCE_FILE);
  expect(readBalance(TEST_BALANCE_FILE)).toBe(1250.0);
});

test('TC-03 Debit account with valid amount updates balance', () => {
  writeBalance(1250.0, TEST_BALANCE_FILE);
  const current = readBalance(TEST_BALANCE_FILE);
  const result = runAccountOperation('DEBIT', current, 200.0);
  expect(result.error).toBeUndefined();
  expect(result.newBalance).toBe(1050.0);
  expect(result.message).toBe('Amount debited. New balance: 1050.00');
  writeBalance(result.newBalance, TEST_BALANCE_FILE);
  expect(readBalance(TEST_BALANCE_FILE)).toBe(1050.0);
});

test('TC-04 Debit account with insufficient funds does not change balance', () => {
  writeBalance(1050.0, TEST_BALANCE_FILE);
  const current = readBalance(TEST_BALANCE_FILE);
  const result = runAccountOperation('DEBIT', current, 2000.0);
  expect(result.error).toBe('Insufficient funds for this debit.');
  expect(result.newBalance).toBe(1050.0);
  expect(readBalance(TEST_BALANCE_FILE)).toBe(1050.0);
});

test('TC-05 Invalid menu option returns error from menu handler', () => {
  const result = handleMenuChoice(9);
  expect(result.continueFlag).toBe(true);
  expect(result.operationType).toBeNull();
  expect(result.error).toBe('Invalid choice, please select 1-4.');
});

test('TC-06 Exit option sets continueFlag false', () => {
  const result = handleMenuChoice(4);
  expect(result.continueFlag).toBe(false);
  expect(result.operationType).toBeNull();
  expect(result.error).toBeUndefined();
});
