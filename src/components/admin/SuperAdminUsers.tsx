import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, ShieldCheck, Ban, Eye, User, Mail, Phone, MapPin, Activity } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const SuperAdminUsers: React.FC = () => {
  const { workers, bookings } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const allUsers = useMemo(() => {
    const workerUsers = workers.map(w => {
      const workerBookings = bookings.filter(b => b.workerId === w.id).length;
      return {
        id: w.id,
        name: w.name,
        role: 'Worker',
        email: 'N/A',
        phone: 'N/A',
        location: w.cooperativeName || 'N/A',
        status: statusOverrides[w.id] || (w.verificationStatus === 'rejected' ? 'Suspended' : 'Active'),
        verification: w.verificationStatus === 'verified' ? 'Verified' : w.verificationStatus === 'under_review' || w.verificationStatus === 'pending' ? 'Pending' : 'Unverified',
        joined: 'N/A',
        bookings: workerBookings,
      };
    });

    const customerMap = new Map<string, any>();
    bookings.forEach(b => {
      const customerKey = b.customerName || 'Unknown';
      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          id: `C-${customerKey.replace(/\\s+/g, '').substring(0, 5).toUpperCase()}`,
          name: customerKey,
          role: 'Customer',
          email: 'N/A',
          phone: b.customerPhone || 'N/A',
          location: b.customerAddress ? b.customerAddress.split(',').pop()?.trim() || 'N/A' : 'N/A',
          status: 'Active',
          verification: 'Unverified',
          joined: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : 'N/A',
          bookings: 1,
        });
      } else {
        const c = customerMap.get(customerKey);
        c.bookings += 1;
      }
    });
    
    const customerUsers = Array.from(customerMap.values()).map(c => ({
      ...c,
      status: statusOverrides[c.id] || c.status
    }));

    return [...workerUsers, ...customerUsers];
  }, [workers, bookings, statusOverrides]);

  const toggleStatus = (id: string) => {
    if (window.confirm("Are you sure you want to change this user's status?")) {
      const user = allUsers.find(u => u.id === id);
      if (user) {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        setStatusOverrides(prev => ({ ...prev, [id]: newStatus }));
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      }
    }
  };

  const filteredUsers = allUsers.filter(u => 
    (roleFilter === 'All Roles' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Manage Platform Users</h3>
          <p className="text-xs text-slate-500 font-medium">View and manage all users across the Sahakaar platform.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search users by name, email, or ID..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="relative min-w-[150px]">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
          >
            <option>All Roles</option>
            <option>Customer</option>
            <option>Worker</option>
            <option>Co-op Admin</option>
            <option>Federation Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status & Verification</th>
                <th className="p-4">Joined</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      u.role === 'Worker' ? 'bg-blue-100 text-blue-800' :
                      u.role === 'Customer' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <div className="flex flex-col gap-1">
                      <span>{u.phone}</span>
                      <span className="text-slate-400">{u.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-600">{u.location}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      {u.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase"><ShieldCheck className="w-3 h-3"/> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded uppercase"><Ban className="w-3 h-3"/> Suspended</span>
                      )}
                      {u.verification === 'Verified' && <span className="text-[10px] font-bold text-blue-600 uppercase">✓ Verified</span>}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500">{u.joined}</td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedUser(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(u.id)}
                        className={`p-1.5 rounded-lg transition ${u.status === 'Active' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                        title={u.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      >
                        {u.status === 'Active' ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-500">{selectedUser.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">{selectedUser.role}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail className="w-3 h-3"/> Email</span>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</span>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</span>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.location}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Activity className="w-3 h-3"/> Activity</span>
                  <p className="text-sm font-medium text-slate-900">{selectedUser.bookings} Related Bookings</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Account Status</h4>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedUser.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {selectedUser.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedUser.verification === 'Verified' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedUser.verification}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
              <button 
                onClick={() => toggleStatus(selectedUser.id)} 
                className={`px-4 py-2 text-sm font-bold rounded-xl transition ${selectedUser.status === 'Active' ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
              >
                {selectedUser.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
              </button>
              <button onClick={() => setSelectedUser(null)} className="px-6 py-2 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
