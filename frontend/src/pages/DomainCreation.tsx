import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

interface Domain {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'error';
  cname?: string;
  createdAt: string;
}

const DomainCreation: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const handleCreateDomain = async () => {
    if (!newDomain) return;

    setLoading(true);
    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDomain }),
      });

      if (!response.ok) {
        throw new Error('Failed to create domain');
      }

      const data = await response.json();
      setDomains([...domains, data]);
      setNewDomain('');
    } catch (error) {
      console.error('Error creating domain:', error);
      alert('Error creating domain');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}/verify`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to verify domain');
      }

      const data = await response.json();
      setDomains(domains.map(d => d.id === domainId ? { ...d, ...data } : d));
    } catch (error) {
      console.error('Error verifying domain:', error);
      alert('Error verifying domain');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                placeholder="Enter domain name"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCreateDomain}
                disabled={loading || !newDomain}
              >
                {loading ? 'Creating...' : 'Create Domain'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CNAME Record</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map(domain => (
                <TableRow key={domain.id}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      domain.status === 'active' ? 'bg-green-100 text-green-800' :
                      domain.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {domain.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {domain.cname ? (
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        {domain.cname}
                      </code>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(domain.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {domain.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyDomain(domain.id)}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainCreation; 