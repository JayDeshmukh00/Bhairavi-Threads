const User = require('../models/User');

// Get user profile by email or create a default guest profile if not found
exports.getProfile = async (req, res) => {
  try {
    const email = req.query.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required." });
    }

    let user = await User.findOne({ email });
    
    // If user doesn't exist in MongoDB yet, create a provisional one so frontend doesn't crash
    if (!user) {
      user = await User.create({
        name: email.split('@')[0],
        email: email,
        address: { fullName: '', phone: '', street: '', city: '', state: '', pincode: '' }
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update user address or profile details safely with upsert
exports.updateAddress = async (req, res) => {
  try {
    const { email, address, phone, fullName, name } = req.body;
    const targetEmail = email || req.query.email || req.user?.email;

    if (!targetEmail) {
      return res.status(400).json({ message: "User email is required to update profile." });
    }

    // Build update payload dynamically
    const updateData = {};
    if (fullName || name) updateData.name = fullName || name;
    if (phone) updateData.phone = phone;
    if (address) {
      updateData.address = {
        fullName: address.fullName || '',
        phone: address.phone || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || ''
      };
    }

    // Upsert: updates if exists, creates if it doesn't
    const updatedUser = await User.findOneAndUpdate(
      { email: targetEmail },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ 
      message: "Profile and address updated successfully!", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};