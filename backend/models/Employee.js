const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  gender: { type: String, default: 'Nam' },
  dateOfBirth: { type: String, default: '' },
  department: { type: String, required: true, default: 'CNTT' },
  position: { type: String, required: true, default: 'Nhân viên' },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  hireDate: { type: String, default: '' },
  status: { type: String, default: 'Đang làm việc' }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema, 'employees');