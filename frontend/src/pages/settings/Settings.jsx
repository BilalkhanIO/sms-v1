import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'School Management System',
    supportEmail: 'support@sms.com',
    maintenanceMode: false,
    enableNotifications: true,
    defaultLanguage: 'English'
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true
    },
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5
  });

  const handleGeneralSettingsChange = (key, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecuritySettingsChange = (key, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = (type) => {
    // TODO: Implement API call to save settings
    toast({
      title: "Settings Updated",
      description: `${type} settings have been successfully updated.`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your system's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={generalSettings.systemName}
                  onChange={(e) => handleGeneralSettingsChange('systemName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => handleGeneralSettingsChange('supportEmail', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleGeneralSettingsChange('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              </div>
              <Button onClick={() => saveSettings('General')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minLength">Minimum Password Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={securitySettings.passwordPolicy.minLength}
                  onChange={(e) => handleSecuritySettingsChange('passwordPolicy', {
                    ...securitySettings.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingsChange('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireSpecialChars"
                  checked={securitySettings.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => handleSecuritySettingsChange('passwordPolicy', {
                    ...securitySettings.passwordPolicy,
                    requireSpecialChars: checked
                  })}
                />
                <Label htmlFor="requireSpecialChars">Require Special Characters in Password</Label>
              </div>
              <Button onClick={() => saveSettings('Security')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableNotifications"
                  checked={generalSettings.enableNotifications}
                  onCheckedChange={(checked) => handleGeneralSettingsChange('enableNotifications', checked)}
                />
                <Label htmlFor="enableNotifications">Enable System Notifications</Label>
              </div>
              {/* Add more notification settings as needed */}
              <Button onClick={() => saveSettings('Notification')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;