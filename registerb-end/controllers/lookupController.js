

// Function to validate pincode (6-digit number)
const validatePincode = (pinCode) => {
  const pinPattern = /^[1-9][0-9]{5}$/;
  return pinPattern.test(pinCode);
};

const lookupAddress = async (req, res) => {
  const { pinCode } = req.body;
  
  if (!pinCode) {
    return res.status(400).json({ error: 'No Pincode provided' });
  }

  if (!validatePincode(pinCode)) {
    return res.status(400).json({ error: 'Invalid Pincode format' });
  }

  try {
    // Send request to the API for pincode lookup
    const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const dataResponse = await response.json();
    console.log(dataResponse);

    if (response.ok) {
      return res.status(200).json({ message: 'Pincode lookup successful', dataResponse });
    } else {
      return res.status(400).json({ error: dataResponse.message || 'Pincode lookup failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { lookupAddress };
