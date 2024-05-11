const { CreateTransaction, FetchTransactions, FetchIncome, FetchExpense, getTransactionsByBiz, getTransactionsByDateRangeHandler, calculateTotalAmount, fetchAmounts, FetchTransactionsById } = require('../Controllers/transactionController');


const router = require('express').Router()

//routes
router.post('/create', CreateTransaction);

router.get('/transactions', FetchTransactions);
router.get('/transactions/i/:id', FetchTransactionsById )

router.get('/income', FetchIncome)
router.get('/expenses', FetchExpense)

router.get('/transactions/:businessId', getTransactionsByBiz )
router.get('/total-amount/:businessId', calculateTotalAmount);

router.get('/amount/:businessId', fetchAmounts);




module.exports = router