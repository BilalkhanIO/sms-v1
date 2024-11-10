import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeeSettings } from '../../redux/features/feeSlice';
import Modal from '../../components/common/Modal';
import FeeStructureForm from '../../components/fee/FeeStructureForm';
import ReminderTemplateForm from '../../components/fee/ReminderTemplateForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BellIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';

const FeeSettingsPage = () => {
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const dispatch = useDispatch();
  const { structures, templates, settings } = useSelector((state) => state.fee);

  const handleSettingChange = (key, value) => {
    dispatch(updateFeeSettings({ [key]: value }));
  };

  const handleDeleteStructure = (structureId) => {
    // Implement delete logic
  };

  const handleDeleteTemplate = (templateId) => {
    // Implement delete logic
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Fee Settings</h1>

      {/* General Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableLateFees}
                  onChange={(e) =>
                    handleSettingChange('enableLateFees', e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Late Fees
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Late Fee Percentage
              </label>
              <input
                type="number"
                value={settings.lateFeePercentage}
                onChange={(e) =>
                  handleSettingChange('lateFeePercentage', e.target.value)
                }
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Grace Period (Days)
              </label>
              <input
                type="number"
                value={settings.gracePeriod}
                onChange={(e) =>
                  handleSettingChange('gracePeriod', e.target.value)
                }
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structures */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Fee Structures</h3>
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsStructureModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Structure
            </button>
          </div>

          <div className="space-y-4">
            {structures.map((structure) => (
              <div
                key={structure.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{structure.name}</h4>
                  <p className="text-sm text-gray-500">
                    {structure.type} - {structure.amount}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(structure);
                      setIsStructureModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStructure(structure.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder Templates */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Reminder Templates
            </h3>
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsTemplateModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Template
            </button>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  {template.type === 'EMAIL' ? (
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                  ) : (
                    <BellIcon className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.type}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItem(template);
                      setIsTemplateModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
        title={`${selectedItem ? 'Edit' : 'Create'} Fee Structure`}
      >
        <FeeStructureForm
          initialData={selectedItem}
          onClose={() => setIsStructureModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={`${selectedItem ? 'Edit' : 'Create'} Reminder Template`}
      >
        <ReminderTemplateForm
          initialTemplate={selectedItem}
          onClose={() => setIsTemplateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default FeeSettingsPage; 