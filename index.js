// index.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Email typo corrections
const emailCorrections = {
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'fmail.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'homail.com': 'hotmail.com',
  'hitmail.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'icloudc.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclod.com': 'icloud.com',
  'aolc.com': 'aol.com',
  'aoll.com': 'aol.com',
  'protonmailc.com': 'protonmail.com',
  'protomail.com': 'protonmail.com',
  'zoho.cm': 'zoho.com',
  'zohomail.com': 'zoho.com'
};

function correctEmail(inputEmail) {
  if (!inputEmail || typeof inputEmail !== 'string' || !inputEmail.includes('@')) {
    return inputEmail;
  }
  const [localPart, domainPart] = inputEmail.split('@');
  return emailCorrections[domainPart.toLowerCase()]
    ? `${localPart}@${emailCorrections[domainPart.toLowerCase()]}`
    : inputEmail;
}

app.post('/correct-email', async (req, res) => {
  const { inputEmail, contactId, apiKey } = req.body;
  if (!inputEmail || !contactId || !apiKey) {
    return res.status(400).json({ success: false, message: 'Missing inputEmail, contactId, or apiKey' });
  }

  const correctedEmail = correctEmail(inputEmail);
  if (correctedEmail === inputEmail) {
    return res.json({ success: true, message: 'No correction needed', email: inputEmail });
  }

  try {
    const response = await axios.put(
      `https://rest.gohighlevel.com/v1/contacts/${contactId}`,
      { email: correctedEmail },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.json({
      success: true,
      message: 'Contact updated',
      updatedEmail: correctedEmail,
      status: response.status
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

