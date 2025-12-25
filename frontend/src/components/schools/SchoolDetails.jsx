import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import SchoolAdminManagement from './SchoolAdminManagement';

const SchoolDetails = ({ school }) => {
  if (!school) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No School Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please select a school from the list to view its details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{school.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Address</h4>
              <p>{school.address}</p>
            </div>
            <div>
              <h4 className="font-semibold">Email</h4>
              <p>{school.email}</p>
            </div>
            <div>
              <h4 className="font-semibold">Phone</h4>
              <p>{school.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold">Principal</h4>
              <p>{school.principal}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <SchoolAdminManagement school={school} />
    </div>
  );
};

export default SchoolDetails;
