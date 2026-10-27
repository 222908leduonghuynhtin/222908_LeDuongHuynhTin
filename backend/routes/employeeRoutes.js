const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 1. GET /api/employees (Lấy danh sách + Tìm kiếm theo mã hoặc họ tên)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách nhân viên', error: err.message });
  }
});

// 2. GET /api/employees/:id (Lấy 1 nhân viên theo _id hoặc employeeId)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let employee = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin nhân viên', error: err.message });
  }
});

// 3. POST /api/employees (Thêm mới nhân viên)
router.post('/', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    // Kiểm tra dữ liệu bắt buộc
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Mã nhân viên, Họ tên và Email!' });
    }
    // Kiểm tra trùng mã nhân viên
    const existing = await Employee.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: `Mã nhân viên ${employeeId} đã tồn tại!` });
    }
    const newEmployee = new Employee(req.body);
    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Thêm nhân viên thất bại', error: err.message });
  }
});

// 4. PUT /api/employees/:id (Cập nhật thông tin nhân viên)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Mã nhân viên, Họ tên và Email không được để trống!' });
    }
    // Kiểm tra nếu đổi mã nhân viên bị trùng với người khác
    const duplicate = await Employee.findOne({ employeeId, _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ message: `Mã nhân viên ${employeeId} đã thuộc về nhân viên khác!` });
    }

    const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Cập nhật thất bại', error: err.message });
  }
});

// 5. DELETE /api/employees/:id (Xóa nhân viên)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
    }
    res.status(200).json({ message: 'Đã xóa hồ sơ nhân viên thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Xóa nhân viên thất bại', error: err.message });
  }
});

module.exports = router;