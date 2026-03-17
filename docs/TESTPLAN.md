# School Accounting System Test Plan

This test plan covers the full business logic of the current COBOL app implementation in `src/cobol`.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|-------------|-----------------------|----------------|------------|-----------------|---------------|-------------------|----------|
| TC-01 | View initial balance | App starts; no transactions yet; initial balance 1000.00 | 1. Start app
2. Choose option 1 (View Balance)
3. Observe balance | Displays "Current balance: 1000.00" (or 1000.00) |  |  |  |
| TC-02 | Credit account with valid amount | Balance is 1000.00 | 1. Start app
2. Choose option 2 (Credit)
3. Enter 250.00
4. View balance | Balance updates to 1250.00; message "Amount credited. New balance: 1250.00" |  |  |  |
| TC-03 | Debit account with valid amount | Balance is 1250.00 | 1. Start app
2. Choose option 3 (Debit)
3. Enter 200.00
4. View balance | Balance updates to 1050.00; message "Amount debited. New balance: 1050.00" |  |  |  |
| TC-04 | Debit account with insufficient funds | Balance is 1050.00 | 1. Start app
2. Choose option 3 (Debit)
3. Enter 2000.00
4. View balance | Displays "Insufficient funds for this debit."; balance remains 1050.00 |  |  |  |
| TC-05 | Invalid menu option | App started | 1. Start app
2. Choose option 9 | Displays "Invalid choice, please select 1-4." |  |  |  |
| TC-06 | Exit option sets loop flag false | App started | 1. Start app
2. Choose option 4 | Displays "Exiting the program. Goodbye!" and terminates |  |  |  |

## Notes
- `Actual Result` and `Status` are filled after execution against the running environment.
- Use this plan for manual validation now, then map to unit/integration tests in node.js by reproducing the same operations and expected values.
