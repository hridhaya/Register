const User = require('../models/userModel'); 


const verifyPAN = (panNumber) => {
  // PAN number validation pattern (5 letters, 4 digits, 1 letter)
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panPattern.test(panNumber);
};

const verifyPanNumber = async (req, res) => {
  const { panNumber } = req.body;
  
  if (!panNumber) {
    return res.status(400).json({ error: 'No PAN Number' });
  }

  if (!verifyPAN(panNumber)) {
    return res.status(400).json({ error: 'Invalid PAN Number format' });
  }

  try {
    // Send request to the API for PAN verification
    const response = await fetch('https://aadhaar-number-verification-api-using-pan-number.p.rapidapi.com/api/validation/pan_to_aadhaar', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '2c3c526e62mshfa8e03dab15338cp1bae18jsnb5e62bc7fca7',
    'x-rapidapi-host': 'aadhaar-number-verification-api-using-pan-number.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      body: 
        JSON.stringify({ pan: panNumber ,
        consent: 'y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API'
        })
    });

    const dataResponse = await response.json();
    console.log(dataResponse);

    if (response.ok) {
      return res.status(200).json({ message: 'PAN verified successfully', dataResponse });
    } else {
      return res.status(400).json({ error: dataResponse.message || 'PAN verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { verifyPanNumber };
