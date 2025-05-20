import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const API_HEADERS = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('admin_jwt')}`,
});

const AdminPanel: React.FC = () => {
  const [form, setForm] = useState({
    partnername: '', whitelabel: false, mainColor: '#2563eb', subdomain: '', email: '', username: '', password: ''
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [dnsStatus, setDnsStatus] = useState<{[id:string]: string}>({});
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  const fetchPartners = async () => {
    setFetching(true);
    setPartners([]);
    try {
      const res = await fetch('/admin/api/partners', { headers: API_HEADERS() });
      if (!res.ok) throw new Error('Failed to fetch partners');
      const data = await res.json();
      data.partners.forEach((partner: any) => {
        setPartners((prev) => [...prev, {
          name: partner.id,
          username: partner.username,
          subdomain: partner.subdomain,
          whitelabel: partner.whitelabel,
          mainColor: partner.color,
          email: partner.email,
          id: partner.id,
        }]);
      });
    } catch (err: any) {
      setError('Failed to load offers: ' + (err.message || 'Unknown error'));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/admin/api/partners', {
        method: 'POST',
        headers: API_HEADERS(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create partner');
      console.log(data, 'data'); 
      setResult(data);
      fetchPartners();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateDNS = async (id: string) => {
    setDnsStatus((s) => ({ ...s, [id]: 'checking' }));
    try {
      const res = await fetch(`/admin/api/partners/${id}/validate-dns`, { method: 'POST', headers: API_HEADERS() });
      const data = await res.json();
      setDnsStatus((s) => ({ ...s, [id]: data.valid ? 'valid' : 'invalid' }));
    } catch {
      setDnsStatus((s) => ({ ...s, [id]: 'error' }));
    }
  };

  return (
    <MainLayout title="Domain Setup">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center py-10">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur rounded-xl shadow-xl p-8 border border-slate-700 mb-10">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <span>Admin Panel</span>
            <span className="text-base font-normal text-slate-300">Create Partner</span>
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-200 font-medium mb-1">Partner Name</label>
              <input name="partnername" value={form.partnername} onChange={handleChange} className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500" required placeholder="e.g. Resor AB" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="whitelabel" checked={form.whitelabel} onChange={handleChange} className="accent-blue-600" id="whitelabel" />
              <label htmlFor="whitelabel" className="text-slate-200">Whitelabel</label>
            </div>
            <div>
              <label className="block text-slate-200 font-medium mb-1">Main Color</label>
              <input type="color" name="mainColor" value={form.mainColor} onChange={handleChange} className="w-12 h-8 p-0 border-none rounded" />
              <span className="ml-2 text-slate-300">{form.mainColor}</span>
            </div>
            <div>
              <label className="block text-slate-200 font-medium mb-1">Subdomain</label>
              <input name="subdomain" value={form.subdomain} onChange={handleChange} className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500" required placeholder="e.g. partner1" />
              <span className="text-xs text-slate-400">Will be used as: <b>{form.subdomain || 'subdomain'}.travel.example.com</b></span>
            </div>
            <div>
              <label className="block text-slate-200 font-medium mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500" required placeholder="partner@email.com" />
            </div>
            <div>
              <label className="block text-slate-200 font-medium mb-1">Username</label>
              <input name="username" value={form.username} onChange={handleChange} className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500" required placeholder="Login username" />
            </div>
            <div>
              <label className="block text-slate-200 font-medium mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-500" required placeholder="Login password" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition" disabled={loading}>
              {loading ? 'Creating...' : 'Create Partner'}
            </button>
          </form>
          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-900/30 p-3 rounded">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {result && (
            <div className="mt-6 bg-green-900/30 p-4 rounded text-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">Partner Created!</span>
              </div>
            </div>
          )}
        </div>
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur rounded-xl shadow-xl p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">All Partners</h2>
            <button onClick={fetchPartners} className="flex items-center gap-1 text-blue-400 hover:text-blue-200"><RefreshCw className="w-4 h-4 animate-spin" style={{ animationPlayState: fetching ? 'running' : 'paused' }} />Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-200 text-center">
              <thead>
                <tr className="bg-slate-800">
                  <th className="p-2">Name</th>
                  <th className="p-2">Subdomain</th>
                  <th className="p-2">Whitelabel</th>
                  <th className="p-2">Main Color</th>
                  <th className="p-2">Username</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">CNAME</th>
                  <th className="p-2">DNS</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} className="border-b border-slate-700 text-center">
                    <td className="p-2 font-semibold">{p.name}</td>
                    <td className="p-2">{p.subdomain}</td>
                    <td className="p-2">{p.whitelabel ? 'Yes' : 'No'}</td>
                    <td className="p-2"><span className="inline-block w-6 h-4 rounded" style={{ background: p.mainColor }} /> {p.mainColor}</td>
                    <td className="p-2">{p.username}</td>
                    <td className="p-2">{p.email}</td>
                    <td className="p-2">{p.id} CNAME travel.example.com</td>
                    <td className="p-2">
                      <button onClick={() => validateDNS(p.id)} className="bg-slate-700 px-2 py-1 rounded text-xs hover:bg-blue-700">
                        Check
                      </button>
                      {dnsStatus[p.id] === 'checking' && <span className="ml-2 text-blue-300">Checking...</span>}
                      {dnsStatus[p.id] === 'valid' && <span className="ml-2 text-green-400">Valid</span>}
                      {dnsStatus[p.id] === 'invalid' && <span className="ml-2 text-red-400">Invalid</span>}
                      {dnsStatus[p.id] === 'error' && <span className="ml-2 text-red-400">Error</span>}
                    </td>
                  </tr>
                ))}
                {partners.length === 0 && (
                  <tr><td colSpan={9} className="p-4 text-center text-slate-400">No partners found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPanel; 