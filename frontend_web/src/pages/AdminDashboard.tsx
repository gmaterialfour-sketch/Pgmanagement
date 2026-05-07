import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, Building, DollarSign, Clock, 
  Plus, Search, MoreVertical, LayoutDashboard,
  Home, FileText, Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staff, setStaff] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
    fetchStaff();
    fetchTenants();
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/complaints/property/demo-1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) { console.error(err); }
  };

  const updateComplaint = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/complaints/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  const fetchStaff = async () => {
// ... existing fetchStaff code ...
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/staff/property/demo-1', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tenants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
    } catch (err) { console.error(err); }
  };

  const markStaffAttendance = async (staffId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/staff/attendance', { staffId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, propsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payments/stats', config),
        axios.get('http://localhost:5000/api/properties', config)
      ]);
      
      setStats(statsRes.data);
      setProperties(propsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-links">
          <button onClick={() => setActiveTab('dashboard')} className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('properties')} className={`sidebar-link ${activeTab === 'properties' ? 'active' : ''}`}>
            <Building size={20} /> Properties
          </button>
          <button onClick={() => setActiveTab('tenants')} className={`sidebar-link ${activeTab === 'tenants' ? 'active' : ''}`}>
            <Users size={20} /> Tenants
          </button>
          <button onClick={() => setActiveTab('staff')} className={`sidebar-link ${activeTab === 'staff' ? 'active' : ''}`}>
            <Users size={20} /> Staff
          </button>
          <button onClick={() => setActiveTab('complaints')} className={`sidebar-link ${activeTab === 'complaints' ? 'active' : ''}`}>
            <FileText size={20} /> Complaints
          </button>
          <button onClick={() => setActiveTab('payments')} className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`}>
            <DollarSign size={20} /> Payments
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        {loading && <div className="loading-bar">Loading dashboard...</div>}
        <header className="dashboard-header">
          <div>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Manage your PG operations efficiently.</p>
          </div>
          <button className="btn btn-primary">
            <Plus size={18} /> Add {activeTab === 'staff' ? 'Staff' : 'Property'}
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <div className="stats-grid">
              {/* ... existing stats ... */}
            </div>
            
            <div className="charts-grid">
              <div className="chart-card card">
                <h3>Occupancy Trend</h3>
                <div className="bar-chart">
                  {[65, 70, 75, 80, 85, 90, 88].map((v, i) => (
                    <div key={i} className="bar-wrapper">
                      <div className="bar" style={{ height: `${v}%` }}>
                        <span className="tooltip">{v}%</span>
                      </div>
                      <span className="label">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-card card">
                <h3>Revenue Growth</h3>
                <div className="line-chart-mock">
                  <svg viewBox="0 0 100 40" className="sparkline">
                    <path d="M0 35 Q 20 10, 40 25 T 80 5 L 100 20" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  </svg>
                  <p>+12.5% from last month</p>
                </div>
              </div>
            </div>
          </>
        )}

        <section className="dashboard-section card">
          {activeTab === 'properties' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Location</th>
                  <th>Rooms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop: any) => (
                  <tr key={prop.id}>
                    <td><strong>{prop.name}</strong></td>
                    <td>{prop.location}</td>
                    <td>{prop.rooms?.length || 0} Rooms</td>
                    <td><span className="status-badge active">Active</span></td>
                    <td><button className="icon-btn"><MoreVertical size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'tenants' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Room</th>
                  <th>Aadhaar Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t: any) => (
                  <tr key={t.id}>
                    <td><strong>{t.user.name}</strong></td>
                    <td>{t.room?.roomNumber}</td>
                    <td>
                      <span className={`status-badge ${t.user.aadhaarHash ? 'active' : 'pending'}`}>
                        {t.user.aadhaarHash ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td><span className="status-badge active">Paid</span></td>
                    <td><button className="icon-btn"><MoreVertical size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'staff' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Today's Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s: any) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.role}</td>
                    <td>{s.phone}</td>
                    <td>
                      <div className="attendance-btns">
                        <button 
                          className={`btn-sm ${s.attendance?.[0]?.status === 'PRESENT' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => markStaffAttendance(s.id, 'PRESENT')}
                        >
                          P
                        </button>
                        <button 
                          className={`btn-sm ${s.attendance?.[0]?.status === 'ABSENT' ? 'btn-danger' : 'btn-outline'}`}
                          onClick={() => markStaffAttendance(s.id, 'ABSENT')}
                        >
                          A
                        </button>
                      </div>
                    </td>
                    <td><button className="icon-btn"><MoreVertical size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'complaints' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c: any) => (
                  <tr key={c.id}>
                    <td><strong>{c.user.name}</strong></td>
                    <td><span className="status-badge">{c.category}</span></td>
                    <td>{c.description}</td>
                    <td>
                      <span className={`status-badge ${c.status === 'OPEN' ? 'pending' : 'active'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'OPEN' && (
                        <button className="btn-sm btn-primary" onClick={() => updateComplaint(c.id, 'RESOLVED')}>
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'payments' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Amount Due</th>
                  <th>Status</th>
                  <th>Mode</th>
                  <th>Paid At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t: any) => (
                  <tr key={t.id}>
                    <td><strong>{t.user.name}</strong></td>
                    <td>{formatCurrency(t.room?.rent || 0)}</td>
                    <td>
                      <span className={`status-badge ${t.payments?.[0]?.status === 'PAID' ? 'active' : 'pending'}`}>
                        {t.payments?.[0]?.status || 'PENDING'}
                      </span>
                    </td>
                    <td>{t.payments?.[0]?.mode || 'N/A'}</td>
                    <td>{t.payments?.[0]?.paidAt ? new Date(t.payments[0].paidAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="flex-actions">
                        <button className="btn-sm btn-outline">Record Payment</button>
                        <button className="btn-sm btn-primary">Receipt</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <style>{`
        .dashboard-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: calc(100vh - 70px);
        }
        .sidebar {
          background: white;
          border-right: 1px solid var(--border);
          padding: 2rem 1rem;
        }
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: var(--text-muted);
          font-weight: 500;
          transition: all 0.2s;
        }
        .sidebar-link:hover, .sidebar-link.active {
          background: #eef2ff;
          color: var(--primary);
        }
        .dashboard-content {
          padding: 2.5rem;
          background: var(--bg-main);
        }
        .loading-bar {
          margin-bottom: 1rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }
        .dashboard-header h1 {
          font-size: 1.875rem;
          margin-bottom: 0.25rem;
        }
        .dashboard-header p {
          color: var(--text-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .revenue { background: #ecfdf5; color: #059669; }
        .pending { background: #fffbeb; color: #d97706; }
        .properties { background: #eff6ff; color: #2563eb; }
        .tenants { background: #f5f3ff; color: #7c3aed; }
        
        .stat-info p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .stat-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-box svg {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }
        .search-box input {
          padding-left: 2.5rem;
          width: 250px;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        .data-table th {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.875rem;
        }
        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.active {
          background: #ecfdf5;
          color: #059669;
        }
        .icon-btn {
          background: none;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
          .sidebar {
            display: none;
          }
        }
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          height: 150px;
          padding-top: 2rem;
        }
        .bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .bar {
          width: 100%;
          background: var(--primary);
          border-radius: 4px 4px 0 0;
          position: relative;
          min-height: 5px;
        }
        .bar .tooltip {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .bar:hover .tooltip { opacity: 1; }
        .label { font-size: 0.7rem; color: var(--text-muted); }
        .sparkline { width: 100%; height: 80px; }
        .flex-actions { display: flex; gap: 0.5rem; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
