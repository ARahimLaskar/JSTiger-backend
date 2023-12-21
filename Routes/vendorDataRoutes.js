const { Router } = require("express");
const VendorModel = require("../models/VendorModel");

const vendorDataRoutes = Router();

vendorDataRoutes.post("/add", async (req, res) => {
  const {
    vendorName,
    bankAccountNo,
    bankName,
    addressLine1,
    addressLine2,
    city,
    country,
    zip,
  } = req.body;

  try {
    const newVendor = new VendorModel({
      vendorName,
      bankAccountNo,
      bankName,
      addressLine1,
      addressLine2,
      city,
      country,
      zip,
    });

    await newVendor.save();
    return res.status(201).json({ message: "Vendor data added successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add Vendor data" });
  }
});

// Get all vendor data
vendorDataRoutes.get("/get", async (req, res) => {
  try {
    const vendorData = await VendorModel.find();
    return res.status(200).json(vendorData);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching vendor data" });
  }
});

// Delete a specific vendor by ID
vendorDataRoutes.delete("/delete/:id", async (req, res) => {
  const vendorId = req.params.id;

  try {
    const deletedVendor = await VendorModel.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    return res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete vendor" });
  }
});

// Update a specific vendor by ID
vendorDataRoutes.put("/edit/:id", async (req, res) => {
  const vendorId = req.params.id;
  const {
    vendorName,
    bankAccountNo,
    bankName,
    addressLine1,
    addressLine2,
    city,
    country,
    zip,
  } = req.body;

  try {
    const existingVendor = await VendorModel.findById(vendorId);

    if (!existingVendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    existingVendor.vendorName = vendorName || existingVendor.vendorName;
    existingVendor.bankAccountNo =
      bankAccountNo || existingVendor.bankAccountNo;
    existingVendor.bankName = bankName || existingVendor.bankName;
    existingVendor.addressLine1 = addressLine1 || existingVendor.addressLine1;
    existingVendor.addressLine2 = addressLine2 || existingVendor.addressLine2;
    existingVendor.city = city || existingVendor.city;
    existingVendor.country = country || existingVendor.country;
    existingVendor.zip = zip || existingVendor.zip;

    await existingVendor.save();

    return res.status(200).json({ message: "Vendor updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update vendor" });
  }
});

module.exports = vendorDataRoutes;
