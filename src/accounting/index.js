const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BALANCE_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.0;

function readBalance(filePath = BALANCE_FILE) {
  try {
    if (!fs.existsSync(filePath)) {
      writeBalance(INITIAL_BALANCE, filePath);
      return INITIAL_BALANCE;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    const value = Number(parsed.balance);
    if (Number.isNaN(value) || value < 0) {
      throw new Error('Malformed balance data');
    }
    return value;
  } catch (error) {
    writeBalance(INITIAL_BALANCE, filePath);
    return INITIAL_BALANCE;
  }
}

function writeBalance(balance, filePath = BALANCE_FILE) {
  const safeBalance = Number(balance).toFixed(2);
  fs.writeFileSync(filePath, JSON.stringify({ balance: parseFloat(safeBalance) }, null, 2));
}

function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

function isValidAmount(amount) {
  const val = Number(amount);
  return Number.isFinite(val) && val > 0;
}

function handleMenuChoice(choice) {
  const trimmed = String(choice).trim();
  if (trimmed === '1') {
    return { continueFlag: true, operationType: 'TOTAL' };
  }
  if (trimmed === '2') {
    return { continueFlag: true, operationType: 'CREDIT' };
  }
  if (trimmed === '3') {
    return { continueFlag: true, operationType: 'DEBIT' };
  }
  if (trimmed === '4') {
    return { continueFlag: false, operationType: null };
  }
  return { continueFlag: true, operationType: null, error: 'Invalid choice, please select 1-4.' };
}

function runAccountOperation(operationType, currentBalance, amount) {
  if (operationType === 'TOTAL') {
    return { newBalance: currentBalance, message: `Current balance: ${formatAmount(currentBalance)}` };
  }

  if (operationType === 'CREDIT') {
    if (!isValidAmount(amount)) {
      return { error: 'Invalid credit amount. Must be a number > 0.' };
    }
    const newBalance = currentBalance + Number(amount);
    return { newBalance, message: `Amount credited. New balance: ${formatAmount(newBalance)}` };
  }

  if (operationType === 'DEBIT') {
    if (!isValidAmount(amount)) {
      return { error: 'Invalid debit amount. Must be a number > 0.' };
    }
    const debit = Number(amount);
    if (debit > currentBalance) {
      return { error: 'Insufficient funds for this debit.', newBalance: currentBalance };
    }
    const newBalance = currentBalance - debit;
    return { newBalance, message: `Amount debited. New balance: ${formatAmount(newBalance)}` };
  }

  return { error: 'Unknown operation type' };
}

async function askQuestion(rl, text) {
  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      resolve(answer);
    });
  });
}

async function operations(operationType, rl) {
  let balance = readBalance();

  if (operationType === 'TOTAL') {
    console.log(`Current balance: ${formatAmount(balance)}`);
    return;
  }

  if (operationType === 'CREDIT') {
    const entered = await askQuestion(rl, 'Enter credit amount: ');
    const result = runAccountOperation('CREDIT', balance, entered);
    if (result.error) {
      console.log(result.error);
      return;
    }
    balance = result.newBalance;
    writeBalance(balance);
    console.log(result.message);
    return;
  }

  if (operationType === 'DEBIT') {
    const entered = await askQuestion(rl, 'Enter debit amount: ');
    const result = runAccountOperation('DEBIT', balance, entered);
    if (result.error) {
      console.log(result.error);
      return;
    }
    balance = result.newBalance;
    writeBalance(balance);
    console.log(result.message);
    return;
  }

  console.log('Unknown operation:', operationType);
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = await askQuestion(rl, 'Enter your choice (1-4): ');

    switch (choice.trim()) {
      case '1':
        await operations('TOTAL', rl);
        break;
      case '2':
        await operations('CREDIT', rl);
        break;
      case '3':
        await operations('DEBIT', rl);
        break;
      case '4':
        continueFlag = false;
        console.log('Exiting the program. Goodbye!');
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }

    if (continueFlag) {
      console.log();
    }
  }

  rl.close();
}

module.exports = {
  readBalance,
  writeBalance,
  formatAmount,
  isValidAmount,
  runAccountOperation,
  handleMenuChoice,
  operations,
  main,
};

if (require.main === module) {
  main().catch((err) => {
    console.error('Unexpected error', err);
    process.exit(1);
  });
}
