import { useState, useEffect } from 'react';

const initialForm = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  department: 'CNTT',
  position: 'Developer',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Đang làm việc'
};

function App() {
  // Tự động nhận biến môi trường, hoặc gọi trực tiếp tới link Render API chuẩn quy ước
  const API_URL = import.meta.env.VITE_API_URL || 'https://api-222908.onrender.com';

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const [selectedEmp, setSelectedEmp] = useState(null);

  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: '', text: '' }), 4000);
  };

  const fetchEmployees = async (search = '') => {
    setLoading(true);
    try {
      const url = search
        ? `${API_URL}/api/employees?search=${encodeURIComponent(search)}`
        : `${API_URL}/api/employees`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tải danh sách nhân viên');
      setEmployees(data);
    } catch (err) {
      showMessage('error', `Lỗi kết nối API: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_URL}/api/employees/${editingId}`
        : `${API_URL}/api/employees`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Thao tác thất bại');
      }

      showMessage('success', editingId ? 'Cập nhật hồ sơ thành công!' : 'Thêm nhân viên mới thành công!');
      setFormData(initialForm);
      setEditingId(null);
      fetchEmployees(searchTerm);
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      employeeId: emp.employeeId || '',
      fullName: emp.fullName || '',
      gender: emp.gender || 'Nam',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.substring(0, 10) : '',
      department: emp.department || '',
      position: emp.position || '',
      email: emp.email || '',
      phone: emp.phone || '',
      hireDate: emp.hireDate ? emp.hireDate.substring(0, 10) : '',
      status: emp.status || 'Đang làm việc'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên "${fullName}" không?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/employees/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Xóa thất bại');
      showMessage('success', 'Đã xóa hồ sơ nhân viên!');
      fetchEmployees(searchTerm);
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#222', backgroundColor: '#fff' }}>
      <header style={{ borderBottom: '2px solid #0d6efd', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#0d6efd' }}>HỆ THỐNG QUẢN LÝ NHÂN SỰ</h1>
        <p style={{ margin: '5px 0 0', fontWeight: 'bold', color: '#555' }}>
          Sinh viên thực hiện: Lê Dương Huỳnh Tín | MSSV: 222908 | Lớp: DH23TIN09
        </p>
      </header>

      {/* Thông báo trạng thái */}
      {notification.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '6px',
          color: '#fff',
          backgroundColor: notification.type === 'error' ? '#dc3545' : '#198754',
          fontWeight: 'bold'
        }}>
          {notification.text}
        </div>
      )}

      {/* Biểu mẫu Thêm / Cập nhật */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '18px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #dee2e6' }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? 'Cập nhật hồ sơ nhân viên' : 'Thêm hồ sơ nhân viên mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px' }}>
          <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Mã NV (VD: NV004) *" required style={{ padding: '8px' }} />
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Họ và tên *" required style={{ padding: '8px' }} />
          <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} title="Ngày sinh" style={{ padding: '8px' }} />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Phòng ban *" required style={{ padding: '8px' }} />
          <input name="position" value={formData.position} onChange={handleChange} placeholder="Chức vụ *" required style={{ padding: '8px' }} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required style={{ padding: '8px' }} />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" style={{ padding: '8px' }} />
          <input type="date" name="hireDate" value={formData.hireDate} onChange={handleChange} title="Ngày vào làm" style={{ padding: '8px' }} />
          <select name="status" value={formData.status} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Đang thử việc">Đang thử việc</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Đã nghỉ việc">Đã nghỉ việc</option>
          </select>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '5px' }}>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editingId ? 'Lưu cập nhật' : 'Thêm nhân viên'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Hủy chỉnh sửa
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Thanh tìm kiếm */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập mã nhân viên hoặc họ tên để tìm kiếm..."
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
        <button type="button" onClick={() => { setSearchTerm(''); fetchEmployees(''); }} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tải lại tất cả
        </button>
      </form>

      {/* Bảng danh sách nhân viên */}
      {loading ? (
        <p style={{ fontWeight: 'bold', color: '#0d6efd' }}>Đang tải dữ liệu nhân viên...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
          <thead>
            <tr style={{ backgroundColor: '#0d6efd', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Mã NV</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Họ tên</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Phòng ban</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Chức vụ</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>SĐT</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Trạng thái</th>
              <th style={{ padding: '10px', border: '1px solid #dee2e6', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '15px', textAlign: 'center' }}>Không tìm thấy hồ sơ nhân viên nào.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{emp.employeeId}</td>
                  <td style={{ padding: '10px' }}>{emp.fullName}</td>
                  <td style={{ padding: '10px' }}>{emp.department}</td>
                  <td style={{ padding: '10px' }}>{emp.position}</td>
                  <td style={{ padding: '10px' }}>{emp.email}</td>
                  <td style={{ padding: '10px' }}>{emp.phone}</td>
                  <td style={{ padding: '10px' }}>{emp.status}</td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => setSelectedEmp(emp)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#0dcaf0', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xem</button>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(emp._id, emp.fullName)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Khung Xem chi tiết nhân viên */}
      {selectedEmp && (
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #0dcaf0', borderRadius: '8px', backgroundColor: '#f0fcff' }}>
          <h3 style={{ marginTop: 0 }}>Chi tiết hồ sơ: {selectedEmp.fullName} ({selectedEmp.employeeId})</h3>
          <p><strong>Giới tính:</strong> {selectedEmp.gender} | <strong>Ngày sinh:</strong> {selectedEmp.dateOfBirth || 'Chưa cập nhật'}</p>
          <p><strong>Phòng ban:</strong> {selectedEmp.department} | <strong>Chức vụ:</strong> {selectedEmp.position}</p>
          <p><strong>Email:</strong> {selectedEmp.email} | <strong>Số điện thoại:</strong> {selectedEmp.phone || 'Chưa cập nhật'}</p>
          <p><strong>Ngày vào làm:</strong> {selectedEmp.hireDate || 'Chưa cập nhật'} | <strong>Trạng thái:</strong> {selectedEmp.status}</p>
          <button onClick={() => setSelectedEmp(null)} style={{ padding: '6px 15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đóng chi tiết</button>
        </div>
      )}
    </div>
  );
}

export default App;