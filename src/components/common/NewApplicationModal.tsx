import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useApp } from '../../context/AppContext';
import { Building2, MapPin, Layers } from 'lucide-react';
import { ApplicationRecord } from '../../types';

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({ isOpen, onClose }) => {
  const { addApplication } = useApp();
  const [institutionName, setInstitutionName] = useState('');
  const [type, setType] = useState<ApplicationRecord['type']>('Engineering & Technology');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim()) {
      setErrors({ name: 'Institution name is required' });
      return;
    }

    addApplication({
      institutionName: institutionName.trim(),
      type,
      state,
      district,
    });

    setInstitutionName('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Institutional Application"
      subtitle="Create a demonstration application record to test AI document verification and compliance workflows."
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Application
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Institution Name *
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={institutionName}
              onChange={(e) => {
                setInstitutionName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="e.g. Somaiya Institute of Advanced Technology"
              className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:ring-red-100 text-red-900'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 text-slate-800'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Programme Discipline / Type
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ApplicationRecord['type'])}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Polytechnic Diploma">Polytechnic Diploma</option>
              <option value="Management Studies">Management Studies (MBA/PGDM)</option>
              <option value="Pharmacy & Health">Pharmacy & Health</option>
              <option value="Architecture & Town Planning">Architecture & Town Planning</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              State
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-lg">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>Demonstration Notice:</strong> Creating this application generates a simulated
            statutory application record in the local browser state. You can inspect documents, execute
            verification pipelines, and review compliance without requiring backend servers.
          </p>
        </div>
      </form>
    </Modal>
  );
};
