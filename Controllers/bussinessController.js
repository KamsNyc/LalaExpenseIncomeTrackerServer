const Business = require("../Models/business");


const FetchBusiness = async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
}

const FetchBusinessByName = async (req, res) => {
  try {
      const businessName = req.params.name;
      const business = await Business.findOne({ name: businessName });
      if (!business) {
          return res.status(404).json({ error: 'Business not found' });
      }
      res.status(200).json(business);
  } catch (error) {
      console.error('Error fetching business by name:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    FetchBusiness,
    FetchBusinessByName
}