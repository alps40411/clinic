import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Phone, Mail, MapPin, Clock, Users, FileText, ChevronDown, Send, CheckCircle, List, AlertTriangle } from 'lucide-react';
import { ConsultationForm as ConsultationFormType, DropdownOption, ConsultationRecord } from '../types/consultation';
import { 
  clinicLocations, 
  consultationTopics, 
  availableTimes, 
  howDidYouKnowOptions, 
  consultants 
} from '../data/consultationData';
import { useConsultations } from '../hooks/useConsultations';

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder, 
  required = false, 
  icon,
  error 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="inline-flex items-center gap-2">{icon}{label}</span>}
        {!icon && label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between ${
            error ? 'border-red-300' : 'border-gray-200'
          } ${selectedOption ? 'text-gray-800' : 'text-gray-500'}`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface ConsultationFormProps {
  onViewRecords: () => void;
  editingRecord?: ConsultationRecord | null;
  onClearEdit?: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ 
  onViewRecords, 
  editingRecord, 
  onClearEdit 
}) => {
  const { createConsultation, updateConsultation, loading, error, clearError } = useConsultations();
  
  const [formData, setFormData] = useState<ConsultationFormType>({
    birthDate: '',
    phone: '',
    email: '',
    clinicLocation: '',
    consultationTopic: '',
    availableTime: '',
    howDidYouKnow: '',
    preferredConsultant: '',
    notes: '',
    status: 'pending',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load editing record data
  useEffect(() => {
    if (editingRecord) {
      setFormData({
        ...editingRecord,
        id: editingRecord.id,
        updatedAt: new Date().toISOString()
      });
    }
  }, [editingRecord]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.birthDate) {
      newErrors.birthDate = '請輸入出生日期';
    } else if (!/^\d{8}$/.test(formData.birthDate)) {
      newErrors.birthDate = '請輸入8位數字的出生日期';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入電話號碼';
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '電話號碼格式不正確';
    }

    if (!formData.email.trim()) {
      newErrors.email = '請輸入電子信箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '電子信箱格式不正確';
    }

    if (!formData.clinicLocation) {
      newErrors.clinicLocation = '請選擇預約院區';
    }

    if (!formData.consultationTopic) {
      newErrors.consultationTopic = '請選擇諮詢項目';
    }

    if (!formData.availableTime) {
      newErrors.availableTime = '請選擇可聯絡時段';
    }

    if (!formData.howDidYouKnow) {
      newErrors.howDidYouKnow = '請選擇如何得知本站';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ConsultationFormType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // 清除之前的錯誤
      clearError();

      // 將表單資料轉換為 API 格式
      const consultationData = {
        consultationDetails: {
          type: formData.consultationTopic,
          status: 'pending' as const,
          notes: formData.notes || undefined,
          // 可以根據需要添加其他欄位
        }
      };

      if (editingRecord) {
        // 更新現有諮詢
        await updateConsultation(editingRecord.id, consultationData);
      } else {
        // 建立新諮詢
        await createConsultation(consultationData);
      }

      console.log('Consultation form submitted:', formData);
      setIsSubmitted(true);
      
      // Clear editing state if applicable
      if (editingRecord && onClearEdit) {
        onClearEdit();
      }
    } catch (err) {
      console.error('提交諮詢失敗:', err);
      // 錯誤已經在 hook 中處理，這裡不需要額外處理
    }
  };

  const resetForm = () => {
    setFormData({
      birthDate: '',
      phone: '',
      email: '',
      clinicLocation: '',
      consultationTopic: '',
      availableTime: '',
      howDidYouKnow: '',
      preferredConsultant: '',
      notes: '',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    setIsSubmitted(false);
    if (onClearEdit) {
      onClearEdit();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {editingRecord ? '諮詢資料已更新！' : '諮詢申請已送出！'}
            </h2>
            <p className="text-gray-600 mb-4">
              {editingRecord 
                ? '您的諮詢資料已成功更新。' 
                : '感謝您的諮詢申請，我們將在24小時內與您聯繫。'
              }
            </p>
            <p className="text-sm text-gray-500 mb-6">
              如有緊急需求，請直接撥打診所電話。
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
              >
                填寫新的諮詢
              </button>
              <button
                onClick={onViewRecords}
                className="flex-1 px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200"
              >
                查看紀錄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-500" />
            {editingRecord ? '編輯諮詢' : '客戶諮詢'}
          </h1>
          <button
            onClick={onViewRecords}
            className="flex items-center gap-2 px-4 py-2 border border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200"
          >
            <List className="w-4 h-4" />
            查看紀錄
          </button>
        </div>

        {editingRecord && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>編輯模式：</strong>您正在編輯諮詢編號 {editingRecord.recordNumber} 的資料
            </p>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-gray-600">請填寫以下資訊，我們將盡快與您聯繫</p>
        </div>

        {/* API Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">
                <strong>提交失敗：</strong>{error}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                請輸入8碼西元生日，如19880808 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="birthDate"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                placeholder="19880808"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                  errors.birthDate ? 'border-red-300' : 'border-gray-200'
                }`}
                maxLength={8}
              />
              {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                請輸入電話 <span className="text-red-500">*</span>
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
                請輸入 email <span className="text-red-500">*</span>
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

            {/* Clinic Location */}
            <Dropdown
              label="預約院區"
              value={formData.clinicLocation}
              options={clinicLocations}
              onChange={(value) => handleInputChange('clinicLocation', value)}
              placeholder="請選擇預約院區"
              required
              icon={<MapPin className="w-4 h-4" />}
              error={errors.clinicLocation}
            />

            {/* Consultation Topic */}
            <Dropdown
              label="諮詢項目"
              value={formData.consultationTopic}
              options={consultationTopics}
              onChange={(value) => handleInputChange('consultationTopic', value)}
              placeholder="請選擇諮詢項目"
              required
              icon={<MessageSquare className="w-4 h-4" />}
              error={errors.consultationTopic}
            />

            {/* Available Time */}
            <Dropdown
              label="可聯絡時段"
              value={formData.availableTime}
              options={availableTimes}
              onChange={(value) => handleInputChange('availableTime', value)}
              placeholder="請選擇可聯絡時段"
              required
              icon={<Clock className="w-4 h-4" />}
              error={errors.availableTime}
            />

            {/* How Did You Know */}
            <Dropdown
              label="如何得知本站"
              value={formData.howDidYouKnow}
              options={howDidYouKnowOptions}
              onChange={(value) => handleInputChange('howDidYouKnow', value)}
              placeholder="請選擇如何得知本站"
              required
              error={errors.howDidYouKnow}
            />

            {/* Preferred Consultant */}
            <Dropdown
              label="諮詢人員"
              value={formData.preferredConsultant}
              options={consultants}
              onChange={(value) => handleInputChange('preferredConsultant', value)}
              placeholder="如有指定諮詢人員請填寫諮詢人員姓名，若無請留空"
              icon={<Users className="w-4 h-4" />}
            />

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                備註
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="請輸入其他需要說明的事項"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editingRecord ? '更新中...' : '送出中...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {editingRecord ? '更新諮詢' : '送出諮詢'}
                </>
              )}
            </button>

            {editingRecord && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
              >
                取消編輯
              </button>
            )}
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* 為必填欄位</p>
          <p className="mt-1">我們將在24小時內與您聯繫</p>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;