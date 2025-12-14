import React, { useState, useEffect } from 'react';
import { useGetSettingsQuery, useUpdateSettingByNameMutation, useCreateSettingMutation, useDeleteSettingByNameMutation } from '../../api/settingsApi';
import Spinner from '../../components/common/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import PageHeader from '../../components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch'; // Assuming a shadcn Switch component
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Trash2, Loader2, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Assuming shadcn AlertDialog

const SystemSettings = () => {
  const { data: settings, isLoading, isError, error, refetch } = useGetSettingsQuery();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingByNameMutation();
  const [createSetting, { isLoading: isCreating }] = useCreateSettingByNameMutation();
  const [deleteSetting, { isLoading: isDeleting }] = useDeleteSettingByNameMutation();

  const [localSettings, setLocalSettings] = useState([]);
  const [newSettingName, setNewSettingName] = useState('');
  const [newSettingValue, setNewSettingValue] = useState('');
  const [newSettingDescription, setNewSettingDescription] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (settings) {
      // Initialize local state with fetched settings, converting values from string if necessary
      setLocalSettings(settings.map(s => ({
        ...s,
        settingValue: parseSettingValue(s.settingValue) // Helper to parse string back to original type
      })));
    }
  }, [settings]);

  // Helper function to safely parse setting values
  const parseSettingValue = (value) => {
    try {
      // Attempt to parse as JSON first (for booleans, numbers, objects)
      const parsed = JSON.parse(value);
      return parsed;
    } catch (e) {
      // If not JSON, return as string
      return value;
    }
  };

  // Helper function to prepare value for backend (stringifies non-strings)
  const prepareSettingValue = (value) => {
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  };

  const handleValueChange = (settingName, value) => {
    setLocalSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.settingName === settingName ? { ...setting, settingValue: value } : setting
      )
    );
  };

  const handleUpdate = async (setting) => {
    try {
      await updateSetting({
        settingName: setting.settingName,
        settingValue: prepareSettingValue(setting.settingValue),
        description: setting.description // Ensure description is sent
      }).unwrap();
      alert(`Setting '${setting.settingName}' updated successfully.`);
      refetch(); // Refetch to ensure data is fresh
    } catch (err) {
      console.error("Failed to update setting:", err);
      alert(`Failed to update setting: ${err.data?.message || err.error}`);
    }
  };

  const handleCreateNewSetting = async () => {
    if (!newSettingName.trim() || !newSettingValue.trim()) {
      alert('Setting Name and Value cannot be empty.');
      return;
    }
    try {
      await createSetting({
        settingName: newSettingName,
        settingValue: prepareSettingValue(newSettingValue),
        description: newSettingDescription,
      }).unwrap();
      alert(`Setting '${newSettingName}' created successfully.`);
      setNewSettingName('');
      setNewSettingValue('');
      setNewSettingDescription('');
      setIsAddingNew(false);
      refetch();
    } catch (err) {
      console.error("Failed to create setting:", err);
      alert(`Failed to create setting: ${err.data?.message || err.error}`);
    }
  };

  const handleDelete = async (settingName) => {
    if (window.confirm(`Are you sure you want to delete the setting '${settingName}'?`)) {
      try {
        await deleteSetting(settingName).unwrap();
        alert(`Setting '${settingName}' deleted successfully.`);
        refetch();
      } catch (err) {
        console.error("Failed to delete setting:", err);
        alert(`Failed to delete setting: ${err.data?.message || err.error}`);
      }
    }
  };


  if (isLoading) {
    return <Spinner size="large" />;
  }

  if (isError) {
    return <ErrorMessage>Error: {error.data?.message || error.error || 'Failed to load settings'}</ErrorMessage>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader title="System Settings" />
      
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddingNew(!isAddingNew)} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          {isAddingNew ? 'Cancel Add New' : 'Add New Setting'}
        </Button>
      </div>

      {isAddingNew && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Setting</CardTitle>
            <CardDescription>Add a new system configuration setting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newSettingName">Setting Name</Label>
              <Input
                id="newSettingName"
                value={newSettingName}
                onChange={(e) => setNewSettingName(e.target.value)}
                placeholder="e.g., enableUserRegistration"
              />
            </div>
            <div>
              <Label htmlFor="newSettingValue">Setting Value</Label>
              <Input
                id="newSettingValue"
                value={newSettingValue}
                onChange={(e) => setNewSettingValue(e.target.value)}
                placeholder="e.g., true, 10, 'some string'"
              />
              <CardDescription className="text-xs text-muted-foreground mt-1">
                Value will be parsed as JSON if possible (e.g., true/false, numbers). Otherwise, it's treated as a string.
              </CardDescription>
            </div>
            <div>
              <Label htmlFor="newSettingDescription">Description (Optional)</Label>
              <Textarea
                id="newSettingDescription"
                value={newSettingDescription}
                onChange={(e) => setNewSettingDescription(e.target.value)}
                placeholder="A brief description of this setting"
              />
            </div>
            <Button onClick={handleCreateNewSetting} disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Create Setting
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(localSettings || []).map((setting) => (
          <Card key={setting.settingName}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{setting.settingName}</CardTitle>
              <div className="flex space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the 
                        <span className="font-bold text-red-500 ml-1">{setting.settingName}</span> setting.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(setting.settingName)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              {typeof setting.settingValue === 'boolean' ? (
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`switch-${setting.settingName}`}>Status:</Label>
                  <Switch
                    id={`switch-${setting.settingName}`}
                    checked={setting.settingValue}
                    onCheckedChange={(checked) => handleValueChange(setting.settingName, checked)}
                    disabled={isUpdating}
                  />
                  <span className="text-sm text-muted-foreground">
                    {setting.settingValue ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={`value-${setting.settingName}`}>Value</Label>
                  <Input
                    id={`value-${setting.settingName}`}
                    value={setting.settingValue}
                    onChange={(e) => handleValueChange(setting.settingName, e.target.value)}
                    type={typeof setting.settingValue === 'number' ? 'number' : 'text'}
                    disabled={isUpdating}
                  />
                </div>
              )}
              {setting.description && (
                <CardDescription className="mt-2">{setting.description}</CardDescription>
              )}
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleUpdate(setting)} disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {localSettings.length === 0 && !isAddingNew && (
          <p className="text-muted-foreground col-span-full text-center">No settings found. Click "Add New Setting" to create one.</p>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
