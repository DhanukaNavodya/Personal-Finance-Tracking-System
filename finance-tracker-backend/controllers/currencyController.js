import Currency from "../models/Currency.js";
import { getExchangeRates } from "../utils/exchangeRates.js"


// Set or update user's base currency
export const setUserCurrency = async (req, res) => {
  try {
    const { baseCurrency } = req.body;
    const userId = req.user.id;

    let userCurrency = await Currency.findOne({ userId });

    if (userCurrency) {
      userCurrency.baseCurrency = baseCurrency;
    } else {
      userCurrency = new Currency({ userId, baseCurrency });
    }

    await userCurrency.save();
    res.status(200).json({ message: "Currency preference updated", baseCurrency });
  } catch (error) {
    res.status(500).json({ message: `Error setting currency: ${error.message}` });
  }
};

// Get user's preferred currency
export const getUserCurrency = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCurrency = await Currency.findOne({ userId });

    if (!userCurrency) {
      return res.status(404).json({ message: "Currency preference not set" });
    }

    res.status(200).json(userCurrency);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving currency: ${error.message}` });
  }
};

export const convertCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const rates = await getExchangeRates(fromCurrency);
    if (!rates || !rates[toCurrency]) {
      return res.status(400).json({ message: "Invalid currency conversion request" });
    }

    const convertedAmount = amount * rates[toCurrency];

    res.status(200).json({
      fromCurrency,
      toCurrency,
      amount,
      convertedAmount,
      exchangeRate: rates[toCurrency],
    });
  } catch (error) {
    res.status(500).json({ message: `Error converting currency: ${error.message}` });
  }
};