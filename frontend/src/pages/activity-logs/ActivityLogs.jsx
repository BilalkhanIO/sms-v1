import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ActivityLogs = () => {
  const [filter, setFilter] = useState({
    type: 'all',
    search: '',
    dateRange: 'all'
  });

  // Mock data - replace with actual API call
  const logs = [
    {
      id: 1,
      timestamp: '2024-01-20 10:30:45',
      user: 'John Doe',
      action: 'User Login',
      type: 'auth',
      details: 'Successful login from IP: 192.168.1.1'
    },
    {
      id: 2,
      timestamp: '2024-01-20 11:15:22',
      user: 'Admin',
      action: 'Create User',
      type: 'user',
      details: 'Created new user account for Jane Smith'
    },
    {
      id: 3,
      timestamp: '2024-01-20 12:00:00',
      user: 'System',
      action: 'Backup',
      type: 'system',
      details: 'Daily backup completed successfully'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getActionColor = (type) => {
    const colors = {
      auth: 'text-blue-600',
      user: 'text-green-600',
      system: 'text-orange-600',
      error: 'text-red-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Activity Logs</CardTitle>
          <Button variant="outline">Export Logs</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                value={filter.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="user">User Management</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filter.dateRange}
                onValueChange={(value) => handleFilterChange('dateRange', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Search logs..."
                value={filter.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className={getActionColor(log.type)}>
                      {log.action}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-md truncate">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {logs.length} entries
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;