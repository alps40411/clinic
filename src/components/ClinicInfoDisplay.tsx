import React, { useState } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Star,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { DoctorInfo } from '../types/doctor';
import { useClinicInfo } from '../hooks/useClinicInfo';

const ClinicInfoDisplay: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const { clinicInfo, doctorsInfo, loading, error } = useClinicInfo();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const formatSchedule = (schedule: { [key: string]: string[] }) => {
    return Object.entries(schedule).map(([day, times]) => ({
      day,
      times: times.join(', ')
    }));
  };

  if (selectedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
            >
              ← 返回醫師列表
            </button>
            <h1 className="text-xl font-bold text-gray-800">醫師詳情</h1>
            <div className="w-16"></div>
          </div>

          {/* Doctor Detail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Doctor Basic Info */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedDoctor.name}</h2>
              <p className="text-gray-600">{selectedDoctor.title}</p>
            </div>

            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">醫師簡介</h3>
                <p className="text-gray-600 leading-relaxed">{selectedDoctor.description}</p>
              </div>

              {/* Credentials */}
              {(selectedDoctor.credentials && selectedDoctor.credentials.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('credentials')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-500" />
                      專業資歷
                    </div>
                    {expandedSections.credentials ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.credentials && (
                    <div className="space-y-2">
                      {selectedDoctor.credentials.map((credential, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">{credential}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specialties - 向後相容 */}
              {(selectedDoctor.specialty && selectedDoctor.specialty.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-cyan-500" />
                    專科領域
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.specialty.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education - 向後相容 */}
              {(selectedDoctor.education && selectedDoctor.education.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('education')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-cyan-500" />
                      學歷
                    </div>
                    {expandedSections.education ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.education && (
                    <div className="space-y-2">
                      {selectedDoctor.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">{edu}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Schedule - 向後相容 */}
              {(selectedDoctor.schedule && Object.keys(selectedDoctor.schedule).length > 0) && (
                <div>
                  <button
                    onClick={() => toggleSection('schedule')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cyan-500" />
                      門診時間
                    </div>
                    {expandedSections.schedule ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.schedule && (
                    <div className="space-y-2">
                      {formatSchedule(selectedDoctor.schedule).map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{item.day}</span>
                          <span className="text-gray-600 text-sm">{item.times}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        

        {/* Clinic Information */}
        {clinicInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">診所資訊</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">地址</p>
                  <p className="text-gray-600">{clinicInfo.address}</p>
                </div>
              </div>

              {clinicInfo.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">電話</p>
                    <p className="text-gray-600">{clinicInfo.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">門診時間</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">上午</span>
                      <span className="text-gray-600">{clinicInfo.officeHours.morning}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">下午</span>
                      <span className="text-gray-600">{clinicInfo.officeHours.afternoon}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">晚上</span>
                      <span className="text-gray-600">{clinicInfo.officeHours.evening}</span>
                    </div>
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                      <p className="text-yellow-800">{clinicInfo.officeHours.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        {clinicInfo && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">診療項目</h2>
              <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-lg">
                <p className="text-cyan-700">{clinicInfo.services}</p>
              </div>
            </div>
        )}

        {/* Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">醫師團隊</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mr-2" />
              <span className="text-gray-600">載入醫師資訊中...</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center py-4 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
              <span className="text-yellow-800 text-sm">
                無法載入最新醫師資訊：{error}
              </span>
            </div>
          )}
          
          <div className="space-y-4">
            {doctorsInfo.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => setSelectedDoctor(doctor)}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm hover:border-cyan-200 transition-all duration-200 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{doctor.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialty && doctor.specialty.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-100 text-cyan-600 rounded text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                    {doctor.specialty && doctor.specialty.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{doctor.specialty.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-cyan-500">
                  <User className="w-5 h-5" />
                </div>
              </div>
            ))}
            
            {!loading && !error && doctorsInfo.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                暫無醫師資訊
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>點擊醫師卡片查看詳細資訊</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfoDisplay;