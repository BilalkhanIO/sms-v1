import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const SchoolList = ({ schools, onSelectSchool, selectedSchool }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Managed Schools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {schools.map((school) => (
            <Button
              key={school._id}
              variant={selectedSchool?._id === school._id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onSelectSchool(school)}
            >
              {school.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolList;
