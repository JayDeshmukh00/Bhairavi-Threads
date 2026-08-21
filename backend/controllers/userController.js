const User = require('../models/User').User;

exports.getProfile = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email }, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { email, address } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { address },
      { new: true, upsert: true }
    );
    res.json({ message: "Address saved successfully!", address: updatedUser.address });
  } catch (error) {
    res.status(500).json({ message: "Error saving address" });
  }
};