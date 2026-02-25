import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Signs the token with the user's ID and your secret, set to expire in 30 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  
  return token;
};

export default generateToken;