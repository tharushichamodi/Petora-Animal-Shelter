// api/grooming_packages_controller.js
const GroomingPackage = require("./grooming_packages_model.js");

// ✅ Get all packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await GroomingPackage.find();
    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: "No packages found" });
    }
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get package by ID
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await GroomingPackage.findById(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Package not found" });
    res.json(pkg);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Add new package (with image upload)
exports.addPackage = async (req, res) => {
  try {
    console.log("📩 Incoming package data:", req.body);
    console.log("📸 Uploaded file:", req.file?.filename);

    // Build full photo path if file uploaded
    const photoPath = req.file ? `${req.file.filename}` : "";

    // Construct new package
    const newPackage = new GroomingPackage({
      packageName: req.body.packageName,
      servicesIncluded: req.body.servicesIncluded,
      description: req.body.description,
      price: req.body.price,
      species: req.body.species ? JSON.parse(req.body.species) : [],
      photo: photoPath, // ✅ Save uploaded image filename
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("❌ Error adding package:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update package by ID (with optional image upload)
exports.updatePackageById = async (req, res) => {
  try {
    console.log("✏️ Updating package:", req.params.id);
    console.log("📩 Incoming fields:", req.body);
    console.log("📸 Uploaded file:", req.file?.filename);

    const photoPath = req.file ? `${req.file.filename}` : undefined;

    // Build update object manually
    const updateData = {
      packageName: req.body.packageName,
      servicesIncluded: req.body.servicesIncluded,
      description: req.body.description,
      price: req.body.price,
      species: req.body.species ? JSON.parse(req.body.species) : undefined,
    };

    // Only include new photo if uploaded
    if (photoPath) {
      updateData.photo = photoPath;
    }

    const updatedPackage = await GroomingPackage.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.json(updatedPackage);
  } catch (error) {
    console.error("❌ Error updating package:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete package by ID
exports.deletePackageById = async (req, res) => {
  try {
    const deletedPackage = await GroomingPackage.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
