


const verifyGst = (gstNumber) => {
  // GST number validation pattern (15 characters: 2 digits, 10 alphanumeric, 1 digit, 1 character)
  const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstPattern.test(gstNumber);
};

const verifyGstNumber = async (req, res) => {
  const { gstNumber } = req.body;

  if (!gstNumber) {
    return res.status(400).json({ error: 'No GST Number' });
  }

  if (!verifyGst(gstNumber)) {
    return res.status(400).json({ error: 'Invalid GST Number format' });
  }

  try {
    // Send request to the API for GST verification
    const response = await fetch('https://gst-verification.p.rapidapi.com/v3/tasks/sync/verify_with_source/ind_gst_certificate', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPID_APIKEY_GST ,
        'x-rapidapi-host':  process.env.RAPID_APIHOST_GST,
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ 
        task_id: '74f4c926-250c-43ca-9c53-453e87ceacd1',
        group_id: '8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e',
        data: {
          gstin: gstNumber
        }
      }),
    });

    const dataResponse = await response.json();
    
    if (response.ok) {
      return res.status(200).json({ message: 'GST verified successfully', dataResponse });
    } else {
      return res.status(400).json({ error: dataResponse.message || 'GST verification failed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { verifyGstNumber };
