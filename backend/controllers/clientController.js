import Client from '../models/Client.js';

// @desc    Create a new client
// @route   POST /api/clients
// @access  Public (Allows the quote calculator to submit leads)
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Invalid client data', error: error.message });
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Requires Admin JWT)
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching clients', error: error.message });
  }
};