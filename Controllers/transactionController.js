const Transaction = require("../Models/transaction");

// Create a transaction
const CreateTransaction = async (req, res) => {
  try {
    const { business, type, amount, category, description, icon, selectedBusiness, ImageUrl } = req.body;
    
    const transaction = new Transaction({
      business,
      selectedBusiness,
      type,
      amount,
      category,
      description,
      icon,
      ImageUrl
    });

    const savedTransaction = await transaction.save();
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch a transaction
const FetchTransactions = async (req, res) => {
  try {
    const { business } = req.query;
    let query = {};

    console.log(business)

    if (business && business !== '663859dc336ce3c847094777') {
      query.business = business;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//fetch income
const FetchIncome = async (req, res) => {
  try {
    const { business } = req.query;
    let query = {};

    if (business && business !== 'All Businesses' && business !== '663859dc336ce3c847094777' && business !== 'All') {
      query.business = business;
    }

    const transactions = await Transaction.find(query);
    const incomeTransactions = transactions.filter(transaction => transaction.type === 'Income');

    res.status(200).json(incomeTransactions);
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//fetch expense
const FetchExpense = async (req, res) => {
  try {
    const { business } = req.query;
    let query = {};

    if (business && business !== 'All Businesses' && business !== '663859dc336ce3c847094777' && business !== 'All') {
      query.business = business;
    }

    const transactions = await Transaction.find(query);
    const expenseTransactions = transactions.filter(transaction => transaction.type === 'Expense');

    res.status(200).json(expenseTransactions);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getTransactionsByBiz = async (req, res) => {
  try {
    let query = {};
    const { businessId } = req.params;
    let { dateRange, filter, sort, category } = req.query;


    if (businessId !== '663859dc336ce3c847094777') {
      query.business = businessId;
    }

    if (!dateRange || dateRange === 'All') {
      // Default to current year if dateRange is not provided or invalid
      const currentYear = new Date().getFullYear();
      dateRange = `${currentYear}-01-01-${currentYear}-12-31`;
    }

    // Check if dateRange is in the expected format
    if (dateRange.match(/^\d{4}-\d{2}-\d{2}-\d{4}-\d{2}-\d{2}$/)) {
      const [startYear, startMonth, startDay, endYear, endMonth, endDay] = dateRange.split('-');

      // Rearrange the date parts to match "YYYY-MM-DD" format
      const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
      const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

      query.createdAt = { $gte: startDate, $lte: endDate };
    } else {
      throw new Error('Invalid dateRange format');
    }

    if (filter === 'income' || filter === 'expense') {
      query.type = filter.charAt(0).toUpperCase() + filter.slice(1); // Capitalize filter value
    }

    if (category) {
      query.category = category;
    }

    let sortCriteria = {};

    if (sort === 'highest') {
      sortCriteria.amount = -1;
    } else if (sort === 'lowest') {
      sortCriteria.amount = 1;
    } else if (sort === 'newest') {
      sortCriteria.createdAt = -1;
    } else if (sort === 'oldest') {
      sortCriteria.createdAt = 1;
    }
    

    const transactions = await Transaction.find(query).sort(sortCriteria);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Calculate total amount based on filters
const calculateTotalAmount = async (req, res) => {
    try {
        const { businessId } = req.params;
        let { dateRange, filter, category } = req.query;

        let query = {};
        if (businessId !== '663859dc336ce3c847094777') {
            query.business = businessId;
        }

        // Apply filters
        if (!dateRange || dateRange === 'All') {
            const currentYear = new Date().getFullYear();
            dateRange = `${currentYear}-01-01-${currentYear}-12-31`;
        }

        if (dateRange.match(/^\d{4}-\d{2}-\d{2}-\d{4}-\d{2}-\d{2}$/)) {
            const [startYear, startMonth, startDay, endYear, endMonth, endDay] = dateRange.split('-');
            const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
            const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);
            query.createdAt = { $gte: startDate, $lte: endDate };
        } else {
            throw new Error('Invalid dateRange format');
        }

        if (filter === 'income' || filter === 'expense') {
            query.type = filter.charAt(0).toUpperCase() + filter.slice(1);
        }

        if (category) {
            query.category = category;
        }

        // Fetch transactions based on filters
        const transactions = await Transaction.find(query);

        // Calculate total amount
        let totalAmount = 0;
        transactions.forEach(transaction => {
            totalAmount += transaction.amount;
        });

        res.json({ totalAmount });
    } catch (error) {
        console.error('Error calculating total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchAmounts = async (req, res) => {
  try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      let query = {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      };

      // If businessId is not equal to '663859dc336ce3c847094777', include it in the query
      if (businessId !== '663859dc336ce3c847094777') {
        query.business = businessId;
      }

      // Query transactions based on the adjusted query condition
      const transactions = await Transaction.find(query);

      // Calculate total amounts for Cash, Credit Card, and Delivery Options
      let cashAmount = 0;
      let creditCardAmount = 0;
      let deliveryOptionsAmount = 0;

      transactions.forEach(transaction => {
          if (transaction.category === 'Cash') {
              cashAmount += transaction.amount;
          } else if (transaction.category === 'Credit Card') {
              creditCardAmount += transaction.amount;
          } else if (transaction.category === 'UberEats' || transaction.category === 'DoorDash' || transaction.category === 'Slice' || transaction.category === 'Grubhub') {
              deliveryOptionsAmount += transaction.amount;
          }
      });

      res.json({
          cashAmount,
          creditCardAmount,
          deliveryOptionsAmount
      });
  } catch (error) {
      console.error('Error fetching amounts:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


const FetchTransactionsById = async (req, res) => {
  try {
    const { id } = req.params; 
    const transaction = await Transaction.findById(id);
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




module.exports = {
    CreateTransaction,
    FetchTransactions,
    FetchIncome,
    FetchExpense,
    getTransactionsByBiz,
    calculateTotalAmount,
    fetchAmounts,
    FetchTransactionsById
}