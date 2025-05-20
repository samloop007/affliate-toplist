import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DomainsList from '@/components/domains/DomainsList';
import { Domain } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import DomainForm from '@/components/domains/DomainForm';

const DomainsPage = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetch('/admin/api/domains', { headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` } })
      .then(res => res.json())
      .then(data => setDomains(data.domains));
  }, []);

  const handleCreate = async (values) => {
    const res = await fetch('/admin/api/domains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` },
      body: JSON.stringify(values),
    });

    let data = null;
    const text = await res.text();
    if (text) {
      data = JSON.parse(text);
    }
    console.log(data, domains, 'data');
    if (res.ok && data) setDomains([data.domain, ...domains]);
    else alert((data && data.error) || 'Failed to create domain');
  };

  const handleEdit = async (values) => {
    console.log(values, 'values');
    const res = await fetch(`/api/domains/${editingDomain?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (res.ok) setDomains(domains.map(d => d.id === data.domain.id ? data.domain : d));
    else alert(data.error || 'Failed to update domain');
    setEditingDomain(null);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/domains/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_jwt')}` },
    });
    if (res.ok) setDomains(domains.filter(d => d.id !== id));
    else alert('Failed to delete domain');
  };

  return (
    <MainLayout title="Domain Setup">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Domain Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            {editingDomain ? (
              <DomainForm
                initialValues={editingDomain}
                onSubmit={handleEdit}
                mode="edit"
              />
            ) : (
              <DomainForm onSubmit={handleCreate} mode="create" />
            )}
          </div>
          
          <div className="lg:col-span-2">
            <DomainsList 
              domains={domains} 
              onEdit={(domain) => {
                setEditingDomain(domain);
              }} 
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DomainsPage;
