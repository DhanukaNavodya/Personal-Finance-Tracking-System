import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EXCHANGE_API_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = process.env.EXCHANGE_API_KEY;

export const getExchangeRates = async (baseCurrency = "USD") => {
  try {
    const response = await axios.get(`${EXCHANGE_API_URL}/${API_KEY}/latest/${baseCurrency}`);
    return response.data.conversion_rates; // Returns exchange rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
};
