
import React, { useState } from 'react';
import { Domain } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DomainsListProps {
  domains: Domain[];
  onEdit?: (domain: Domain) => void;
  onDelete?: (domainId: string) => void;
}
const DomainsList: React.FC<DomainsListProps> = ({ domains, onEdit, onDelete }) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  
  const toggleExpand = (id: string) => {
    setExpandedDomain(expandedDomain === id ? null : id);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Created Domains</CardTitle>
      </CardHeader>
      <CardContent>
        {domains.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No domains have been created yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain Name</TableHead>
                <TableHead>Custom Hostname</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {domains.map((domain) => (
                <TableRow 
                  key={domain.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(domain.id)}
                >
                  <TableCell className="font-medium">{domain.name ? domain.name : domain.id}</TableCell>
                  <TableCell>{domain.customHostname ? domain.customHostname : domain.subdomain}</TableCell>
                  <TableCell>{new Date(domain.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {onEdit && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(domain);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(domain.id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DomainsList;
