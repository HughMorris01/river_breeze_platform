import Client from '../models/Client.js';
import Appointment from '../models/Appointment.js';

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

// @desc    Look up a client by address and email/phone
// @route   POST /api/clients/verify
// @access  Public (Verifies returning clients for the booking flow)
export const verifyClient = async (req, res) => {
  try {
    const { address, identity } = req.body;

    if (!address || !identity) {
      return res.status(400).json({ message: 'Please provide both an address and an email or phone number.' });
    }

    const cleanInputPhone = identity.replace(/\D/g, '');
    const isPhone = cleanInputPhone.length >= 7; 

    const allClients = await Client.find();

    const matchedClient = allClients.find(client => {
      const emailMatch = client.email?.toLowerCase() === identity.toLowerCase().trim();
      const phoneMatch = client.phone?.replace(/\D/g, '') === cleanInputPhone;
      
      if (emailMatch || (isPhone && phoneMatch)) {
         return client.address.toLowerCase().trim() === address.toLowerCase().trim();
      }
      return false;
    });

    if (!matchedClient) {
      return res.status(404).json({ message: 'No matching profile found.' });
    }

    // STRICT CHECK: Fetch their most recent completed appointment
    const lastAppointment = await Appointment.findOne({ 
      client: matchedClient._id,
      status: 'Completed' 
    }).sort({ createdAt: -1 });

    // NEW: Reject them if they don't have a completed job history
    if (!lastAppointment) {
      return res.status(404).json({ message: 'No completed services found. Please use the New Quote Calculator to get started.' });
    }

    const clientData = matchedClient.toObject();
    clientData.lastAppointment = lastAppointment;

    res.status(200).json(clientData);

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};