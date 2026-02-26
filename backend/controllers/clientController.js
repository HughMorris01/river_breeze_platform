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

// @desc    Look up a client by address and email/phone
// @route   POST /api/clients/verify
// @access  Public (Verifies returning clients for the booking flow)
export const verifyClient = async (req, res) => {
  try {
    const { address, identity } = req.body;

    if (!address || !identity) {
      return res.status(400).json({ message: 'Please provide both an address and an email or phone number.' });
    }

    // 1. Clean the input so we can easily compare phone numbers (strips everything but numbers)
    const cleanInputPhone = identity.replace(/\D/g, '');
    const isPhone = cleanInputPhone.length >= 7; 

    // 2. Find clients by exact address (Google Places Autocomplete makes this highly reliable)
    // We use a regex to make it case-insensitive just to be safe
    const clientsAtAddress = await Client.find({ 
      address: { $regex: new RegExp(`^${address.trim()}$`, 'i') } 
    });

    if (clientsAtAddress.length === 0) {
      // Generic error so bad actors can't scrape address data
      return res.status(404).json({ message: 'No matching profile found.' });
    }

    // 3. Post-process to find the exact identity match
    const matchedClient = clientsAtAddress.find(client => {
      const emailMatch = client.email?.toLowerCase() === identity.toLowerCase().trim();
      const phoneMatch = client.phone?.replace(/\D/g, '') === cleanInputPhone;
      
      return emailMatch || (isPhone && phoneMatch);
    });

    if (!matchedClient) {
      return res.status(404).json({ message: 'No matching profile found.' });
    }

    // 4. Success! Return the client data needed for the booking flow
    res.status(200).json(matchedClient);

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};