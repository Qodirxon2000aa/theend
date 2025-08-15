const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Employee = require("../models/Employee");

// Multer sozlamalari (fayl upload uchun)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().populate("category");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new employee
router.post("/", upload.single("images"), async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };
    const employee = new Employee(employeeData);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update employee
router.put("/:id", upload.single("images"), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    Object.keys(req.body).forEach(key => {
      employee[key] = req.body[key];
    });

    if (req.file) {
      employee.image = `/uploads/${req.file.filename}`;
    }

    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE employee
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
