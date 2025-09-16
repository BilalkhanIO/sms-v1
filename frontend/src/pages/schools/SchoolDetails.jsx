import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Users,
  GraduationCap,
  Phone,
  Mail,
  Globe,
  MapPin,
} from 'lucide-react';

const SchoolDetails = () => {
  const { id } = useParams();

  // Mock data - replace with actual API call
  const schoolData = {
    id: 1,
    name: 'Global Education Academy',
    status: 'active',
    address: '123 Education Street',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    phone: '+1 234-567-8900',
    email: 'admin@globaledu.com',
    website: 'https://www.globaledu.com',
    adminName: 'John Smith',
    studentCount: 1200,
    teacherCount: 80,
    classCount: 40,
    founded: '2010',
    lastUpdated: '2024-01-20',
    description: 'A leading educational institution committed to excellence in teaching and learning.',
    stats: {
      totalStudents: 1200,
      activeStudents: 1150,
      totalTeachers: 80,
      activeTeachers: 75,
      totalClasses: 40,
      averageAttendance: '95%',
      feesCollection: '92%',
    },
    recentActivities: [
      {
        id: 1,
        date: '2024-01-20',
        activity: 'New teacher hired',
        details: 'Mathematics Department'
      },
      {
        id: 2,
        date: '2024-01-19',
        activity: 'Parent meeting conducted',
        details: 'Grade 10 section'
      },
      {
        id: 3,
        date: '2024-01-18',
        activity: 'System maintenance',
        details: 'Software update'
      }
    ]
  };

  const StatCard = ({ icon: Icon, title, value, description }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="rounded-full bg-primary/10 p-3 mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{schoolData.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={schoolData.status === 'active' ? 'success' : 'destructive'}>
              {schoolData.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              ID: {schoolData.id}
            </span>
          </div>
        </div>
        <Link to={`/dashboard/schools/edit/${id}`}>
          <Button>Edit School</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={Users}
          title="Total Students"
          value={schoolData.stats.totalStudents}
          description={`${schoolData.stats.activeStudents} active`}
        />
        <StatCard
          icon={GraduationCap}
          title="Total Teachers"
          value={schoolData.stats.totalTeachers}
          description={`${schoolData.stats.activeTeachers} active`}
        />
        <StatCard
          icon={Building2}
          title="Total Classes"
          value={schoolData.stats.totalClasses}
        />
      </div>

      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {schoolData.address}, {schoolData.city}, {schoolData.state}, {schoolData.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{schoolData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{schoolData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={schoolData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {schoolData.website}
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground">
                  {schoolData.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>School Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-4">Academic Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Attendance</span>
                      <span className="font-medium">{schoolData.stats.averageAttendance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees Collection</span>
                      <span className="font-medium">{schoolData.stats.feesCollection}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolData.recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.activity}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolDetails;