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
import { clinicInfo } from '../data/doctorData';
import { useDoctors } from '../hooks/useDoctors';

const ClinicInfoDisplay: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const { doctorsInfo, loading, error } = useDoctors();

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
            {/* Doctor Photo & Basic Info */}
            <div className="relative">
              <img
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl font-bold">{selectedDoctor.name} 醫師</h2>
                <p className="text-sm opacity-90">{selectedDoctor.title}</p>
              </div>
            </div>

            <div className="p-6">
              {/* Specialties */}
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

              {/* Introduction */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">醫師簡介</h3>
                <p className="text-gray-600 leading-relaxed">{selectedDoctor.introduction}</p>
              </div>

              {/* Education */}
              {(selectedDoctor.education.length > 0) && (
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

              {/* Experience */}
              {(selectedDoctor.experience.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('experience')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-cyan-500" />
                      經歷
                    </div>
                    {expandedSections.experience ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.experience && (
                    <div className="space-y-2">
                      {selectedDoctor.experience.map((exp, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-700">{exp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Certifications */}
              {(selectedDoctor.certifications.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('certifications')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-500" />
                      專業證照
                    </div>
                    {expandedSections.certifications ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.certifications && (
                    <div className="space-y-2">
                      {selectedDoctor.certifications.map((cert, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Award className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-700">{cert}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Expertise */}
              {(selectedDoctor.expertise.length > 0) && (
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection('expertise')}
                    className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-cyan-500" />
                      專精項目
                    </div>
                    {expandedSections.expertise ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.expertise && (
                    <div className="space-y-2">
                      {selectedDoctor.expertise.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Star className="w-4 h-4 text-cyan-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Schedule */}
              {(Object.keys(selectedDoctor.schedule).length > 0) && (
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Stethoscope className="w-8 h-8 text-cyan-500" />
            {clinicInfo.name}
          </h1>
          <p className="text-gray-600">{clinicInfo.description}</p>
        </div>

        {/* Clinic Information */}
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

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">電話</p>
                <p className="text-gray-600">{clinicInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">信箱</p>
                <p className="text-gray-600">{clinicInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">門診時間</p>
                <div className="space-y-1">
                  {Object.entries(clinicInfo.hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-700">{day}</span>
                      <span className="text-gray-600">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">診療項目</h2>
          <div className="grid grid-cols-2 gap-3">
            {clinicInfo.services.map((service, index) => (
              <div
                key={index}
                className="p-3 bg-cyan-50 border border-cyan-100 rounded-lg text-center"
              >
                <span className="text-cyan-700 font-medium text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>

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
                無法載入最新醫師資訊，顯示本地資料
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
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{doctor.name} 醫師</h3>
                  <p className="text-sm text-gray-600 mb-1">{doctor.title}</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialty.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-100 text-cyan-600 rounded text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                    {doctor.specialty.length > 2 && (
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