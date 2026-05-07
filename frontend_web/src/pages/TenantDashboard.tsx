import { useEffect, useState } from 'react';
import { 
  CreditCard, Home, FileText,
  Bell, HelpCircle, Download
} from 'lucide-react';

type Payment = {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  dueDate: string;
  paidAt?: string;
};

const TenantDashboard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ description: '', category: 'MAINTENANCE' });

  const raiseComplaint = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/complaints', { 
        propertyId: 'demo-1', // Mock
        ...newComplaint 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewComplaint({ description: '', category: 'MAINTENANCE' });
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/complaints/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    // Mocking for now as full tenant-room assignment is a multi-step process
    setPayments([
      { id: '1', amount: 1200, status: 'PENDING', dueDate: '2026-05-01' },
      { id: '2', amount: 1200, status: 'PAID', dueDate: '2026-04-01', paidAt: '2026-03-28' }
    ]);
    setLoading(false);
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-links">
          <button onClick={() => setActiveTab('home')} className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={20} /> My Home
          </button>
          <button onClick={() => setActiveTab('payments')} className={`sidebar-link ${activeTab === 'payments' ? 'active' : ''}`}>
            <CreditCard size={20} /> Payments
          </button>
          <button onClick={() => setActiveTab('support')} className={`sidebar-link ${activeTab === 'support' ? 'active' : ''}`}>
            <HelpCircle size={20} /> Support
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        {loading && <div className="loading-bar">Loading tenant dashboard...</div>}
        <header className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>You have 1 pending payment this month.</p>
          </div>
        </header>

        {activeTab === 'home' && (
          <>
            <div className="tenant-grid">
              <div className="card next-payment">
                <div className="card-header">
                  <h3>Next Payment</h3>
                  <CreditCard className="icon-muted" />
                </div>
                <div className="payment-amount">$1,200</div>
                <p className="due-date">Due on May 1st, 2026</p>
                <button className="btn btn-primary btn-block mt-1">Pay Now</button>
              </div>

              <div className="card my-room">
                <div className="card-header">
                  <h3>My Room</h3>
                  <Home className="icon-muted" />
                </div>
                <div className="room-info">
                  <h4>Apt 4B - Green Valley</h4>
                  <p>123 Maple Street, Silicon Valley</p>
                </div>
                <div className="agreement-btn">
                  <button className="btn btn-secondary">
                    <Download size={18} /> Rent Agreement
                  </button>
                </div>
              </div>
            </div>

            <section className="dashboard-section card mt-2">
              <h2>Payment History</h2>
              <table className="data-table">
                {/* ... existing table ... */}
              </table>
            </section>
          </>
        )}

        {activeTab === 'support' && (
          <div className="support-section">
            <div className="card raise-ticket">
              <h3>Raise a Maintenance Ticket</h3>
              <div className="form-group mt-1">
                <label>Category</label>
                <select 
                  className="form-control"
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                >
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="CLEANING">Cleaning</option>
                  <option value="FOOD">Food Quality</option>
                  <option value="WIFI">WiFi/Internet</option>
                </select>
              </div>
              <div className="form-group mt-1">
                <label>Description</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  placeholder="Describe your issue..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                />
              </div>
              <button className="btn btn-primary mt-1" onClick={raiseComplaint}>Submit Ticket</button>
            </div>

            <section className="dashboard-section card mt-2">
              <h3>Your Tickets</h3>
              <div className="ticket-list">
                {complaints.length === 0 ? <p className="muted">No tickets raised yet.</p> : complaints.map((c: any) => (
                  <div key={c.id} className="ticket-item card mt-1">
                    <div className="ticket-header">
                      <span className="status-badge active">{c.category}</span>
                      <span className={`status-badge ${c.status === 'OPEN' ? 'pending' : 'paid'}`}>{c.status}</span>
                    </div>
                    <p className="mt-1">{c.description}</p>
                    <small className="muted">{new Date(c.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <style>{`
        .tenant-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .loading-bar {
          margin-bottom: 1rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .payment-amount {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }
        .due-date {
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .room-info h4 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .room-info p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .status-badge.pending { background: #fffbeb; color: #d97706; }
        .status-badge.paid { background: #ecfdf5; color: #059669; }
        .mt-1 { margin-top: 1rem; }
        .mt-2 { margin-top: 2rem; }
        .icon-muted { color: var(--text-muted); }
        
        @media (max-width: 768px) {
          .tenant-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TenantDashboard;
