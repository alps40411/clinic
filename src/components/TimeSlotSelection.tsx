import React from 'react';
import { Clock } from 'lucide-react';
import { TimeSlot } from '../types/appointment';
import { timeSlots } from '../data/mockData';

interface TimeSlotSelectionProps {
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (timeSlot: string) => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({ selectedTimeSlot, onSelectTimeSlot }) => {
  const TimeSlotGroup: React.FC<{ title: string; slots: TimeSlot[] }> = ({ title, slots }) => (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => slot.available && onSelectTimeSlot(slot.time)}
            disabled={!slot.available}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTimeSlot === slot.time
                ? 'bg-cyan-500 text-white shadow-sm'
                : slot.available
                ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-500" />
        選擇時段
      </h2>
      
      <TimeSlotGroup title="上午診" slots={timeSlots.morning} />
      <TimeSlotGroup title="下午診" slots={timeSlots.afternoon} />
      <TimeSlotGroup title="夜診" slots={timeSlots.evening} />
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-50 rounded border"></div>
          <span>可預約</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded"></div>
          <span>已選擇</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>已滿號</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelection;