import React, { useState } from 'react';
import { User, Phone, Mail, CheckCircle } from 'lucide-react';
import { Doctor } from '../types/appointment';
import { formatDateDisplay, validateIdNumber } from '../utils/dateUtils';

interface BookingFormProps {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTimeSlot: string | null;
  onSubmit: (patientInfo: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDoctor,
  selectedDate,
  selectedTimeSlot,
  onSubmit
}) => {
  const [patientInfo, setPatientInfo] = useState({
    idNumber: '',
    name: '',
    phone: '',
    email: '',
    lineId: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!patientInfo.idNumber) {
      newErrors.idNumber = '請輸入身分證字號';
    } else if (!validateIdNumber(patientInfo.idNumber)) {
      newErrors.idNumber = '身分證字號格式不正確';
    }

    if (!patientInfo.name.trim()) {
      newErrors.name = '請輸入姓名';
    }

    if (!patientInfo.phone.trim()) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^09\d{8}$/.test(patientInfo.phone)) {
      newErrors.phone = '手機號碼格式不正確';
    }

    if (!patientInfo.email.trim()) {
      newErrors.email = '請輸入電子信箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInfo.email)) {
      newErrors.email = '電子信箱格式不正確';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...patientInfo,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isFormComplete = selectedDoctor && selectedDate && selectedTimeSlot;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-cyan-500" />
        預約資訊
      </h2>

      {isFormComplete && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-cyan-800 mb-2">預約摘要</h3>
          <div className="space-y-1 text-sm text-cyan-700">
            <p>醫師：{selectedDoctor.name} ({selectedDoctor.specialty})</p>
            <p>日期：{formatDateDisplay(selectedDate)}</p>
            <p>時間：{selectedTimeSlot}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
            身分證字號 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="idNumber"
            value={patientInfo.idNumber}
            onChange={(e) => handleInputChange('idNumber', e.target.value.toUpperCase())}
            placeholder="請輸入身分證字號"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
              errors.idNumber ? 'border-red-300' : 'border-gray-200'
            }`}
            maxLength={10}
          />
          {errors.idNumber && <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={patientInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="請輸入姓名"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
              errors.name ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            手機號碼 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={patientInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="請輸入手機號碼"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
              errors.phone ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            電子信箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={patientInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="請輸入電子信箱"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
              errors.email ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="lineId" className="block text-sm font-medium text-gray-700 mb-2">
            LINE ID（選填）
          </label>
          <input
            type="text"
            id="lineId"
            value={patientInfo.lineId}
            onChange={(e) => handleInputChange('lineId', e.target.value)}
            placeholder="請輸入 LINE ID（用於接收預約通知）"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className="w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              處理中...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              確認預約
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;