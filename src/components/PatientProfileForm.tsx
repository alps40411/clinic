import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Heart, AlertTriangle, FileText, Save, X, Calendar } from 'lucide-react';
import { PatientProfile, PatientFormData } from '../types/patient';
import { bloodTypes } from '../data/patientData';
import { validateIdNumber } from '../utils/dateUtils';

interface PatientProfileFormProps {
  editingProfile?: PatientProfile | null;
  onSave: (profileData: PatientFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PatientProfileForm: React.FC<PatientProfileFormProps> = ({
  editingProfile,
  onSave,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    idNumber: '',
    phone: '',
    email: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    allergies: '',
    medicalHistory: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProfile) {
      setFormData({
        name: editingProfile.name,
        idNumber: editingProfile.idNumber,
        phone: editingProfile.phone,
        email: editingProfile.email,
        birthDate: editingProfile.birthDate,
        address: editingProfile.address,
        emergencyContact: editingProfile.emergencyContact,
        emergencyPhone: editingProfile.emergencyPhone,
        bloodType: editingProfile.bloodType || '',
        allergies: editingProfile.allergies || '',
        medicalHistory: editingProfile.medicalHistory || ''
      });
    }
  }, [editingProfile]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名';
    }

    if (!formData.idNumber) {
      newErrors.idNumber = '請輸入身分證字號';
    } else if (!validateIdNumber(formData.idNumber)) {
      newErrors.idNumber = '身分證字號格式不正確';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入手機號碼';
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '手機號碼格式不正確';
    }

    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子信箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '電子信箱格式不正確';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '請輸入出生日期';
    } else if (!/^\d{8}$/.test(formData.birthDate)) {
      newErrors.birthDate = '請輸入8位數字的出生日期';
    }

    if (!formData.address.trim()) {
      newErrors.address = '請輸入地址';
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = '請輸入緊急聯絡人';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = '請輸入緊急聯絡人電話';
    } else if (!/^09\d{8}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = '緊急聯絡人電話格式不正確';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('提交表單時發生錯誤:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 text-cyan-500" />
            {editingProfile ? '編輯使用者資料' : '新增使用者資料'}
          </h1>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                基本資料
              </h3>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="請輸入姓名"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* ID Number */}
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  身分證字號 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value.toUpperCase())}
                  placeholder="請輸入身分證字號"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.idNumber ? 'border-red-300' : 'border-gray-200'
                  }`}
                  maxLength={10}
                />
                {errors.idNumber && <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  出生日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  placeholder="請輸入8碼西元生日，如19880808"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.birthDate ? 'border-red-300' : 'border-gray-200'
                  }`}
                  maxLength={8}
                />
                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                聯絡資訊
              </h3>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  手機號碼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="請輸入手機號碼"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  電子信箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="請輸入電子信箱"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  地址 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="請輸入地址"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.address ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                緊急聯絡人
              </h3>

              {/* Emergency Contact Name */}
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  緊急聯絡人姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="請輸入緊急聯絡人姓名"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.emergencyContact ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.emergencyContact && <p className="mt-1 text-sm text-red-600">{errors.emergencyContact}</p>}
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  緊急聯絡人電話 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="請輸入緊急聯絡人電話"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                    errors.emergencyPhone ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.emergencyPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>}
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                醫療資訊（選填）
              </h3>

              {/* Blood Type */}
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="w-4 h-4 inline mr-2" />
                  血型
                </label>
                <select
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange('bloodType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                >
                  {bloodTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Allergies */}
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  過敏史
                </label>
                <textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  placeholder="請輸入過敏史（如：花生過敏、藥物過敏等）"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Medical History */}
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  病史
                </label>
                <textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  placeholder="請輸入相關病史（如：高血壓、糖尿病等）"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  儲存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingProfile ? '更新資料' : '儲存資料'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* 為必填欄位</p>
          <p className="mt-1">資料將安全儲存，僅用於看診預約</p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileForm;