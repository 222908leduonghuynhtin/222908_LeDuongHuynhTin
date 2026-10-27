const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint kiểm tra trạng thái theo yêu cầu Câu 3
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    student: 'Lê Dương Huỳnh Tín - 222908 - DH23TIN09',
    message: 'HR Management Backend API is running'
  });
});

app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối thành công với MongoDB Atlas!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err.message));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});