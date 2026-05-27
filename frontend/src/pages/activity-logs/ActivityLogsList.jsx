import React, { useState } from 'react';
import { useGetActivitiesQuery } from '../../api/activityApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCw, Filter } from 'lucide-react';

const ActivityLogsList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');
  const [contextFilter, setContextFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // For user or description search

  const { data, isLoading, isError, error, refetch } = useGetActivityLogsQuery({
    page,
    limit,
    type: typeFilter,
    context: contextFilter,
    severity: severityFilter,
    // Backend search filter needs to be implemented. For now, assuming it searches user/description
    // search: searchQuery,
  });

  const activityLogs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return <ErrorMessage>Error: {error.data?.message || error.error || 'Failed to load activity logs'}</ErrorMessage>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="Activity Logs">
        <Button variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" /> Filters
          </CardTitle>
          <CardDescription>Filter activity logs by type, context, or severity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search user/description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-full md:col-span-1"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {/* Populate with actual activity types from backend or enum */}
                <SelectItem value="USER_LOGIN">User Login</SelectItem>
                <SelectItem value="USER_CREATED">User Created</SelectItem>
                <SelectItem value="SCHOOL_CREATED">School Created</SelectItem>
                {/* ... other types */}
              </SelectContent>
            </Select>
            <Select value={contextFilter} onValueChange={setContextFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Contexts</SelectItem>
                {/* Populate with actual contexts */}
                <SelectItem value="authentication">Authentication</SelectItem>
                <SelectItem value="user-management">User Management</SelectItem>
                <SelectItem value="school-management">School Management</SelectItem>
                <SelectItem value="system-settings">System Settings</SelectItem>
                {/* ... other contexts */}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Activity Log ({totalItems} entries)</CardTitle>
          <CardDescription>
            A chronological record of system activities and user actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.length > 0 ? (
                  activityLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.role})` : 'System'}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>{log.context}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadgeClass(log.severity)}>{log.severity}</Badge>
                      </TableCell>
                      <TableCell>{log.ip}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogsList;