// backend/seeders/clients.js
import Client from '../models/Client.js';

const realClaytonAddresses = [
  '330 Riverside Dr, Clayton, NY 13624, USA',
  '413 Riverside Dr, Clayton, NY 13624, USA',
  '514 James St, Clayton, NY 13624, USA',
  '300 State St, Clayton, NY 13624, USA',
  '401 Mary St, Clayton, NY 13624, USA',
  '205 Webb St, Clayton, NY 13624, USA'
];
const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Katherine'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'];

export const seedClients = async () => {
  await Client.deleteMany();
  console.log('🟡 Old Clients cleared.');

  const clients = [];
  for (let i = 0; i < 40; i++) {
    clients.push({
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `client${i}@example.com`,
      phone: `555-010-${Math.floor(1000 + Math.random() * 9000)}`,
      address: realClaytonAddresses[Math.floor(Math.random() * realClaytonAddresses.length)],
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      squareFootage: Math.floor(Math.random() * 2500) + 800,
      isReturning: true
    });
  }
  await Client.insertMany(clients);
  console.log('🟢 Clients Seeded.');
};