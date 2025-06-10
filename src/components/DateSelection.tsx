import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNextTwoWeeks, formatDate } from '../utils/dateUtils';

interface DateSelectionProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ selectedDate, onSelectDate }) => {
  const availableDates = getNextTwoWeeks();
  const [currentWeek, setCurrentWeek] = React.useState(0);
  
  const datesPerWeek = 7;
  const currentWeekDates = availableDates.slice(
    currentWeek * datesPerWeek,
    (currentWeek + 1) * datesPerWeek
  );

  const getDayName = (date: Date) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[date.getDay()];
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-500" />
          選擇日期
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek(0)}
            disabled={currentWeek === 0}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 px-2">
            第 {currentWeek + 1} 週
          </span>
          <button
            onClick={() => setCurrentWeek(1)}
            disabled={currentWeek === 1}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {currentWeekDates.map((date) => {
          const dateString = formatDate(date);
          const isSelected = selectedDate === dateString;
          const isWeekendDay = isWeekend(date);
          
          return (
            <button
              key={dateString}
              onClick={() => onSelectDate(dateString)}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : isWeekendDay
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              disabled={isWeekendDay}
            >
              <div className="text-xs text-current opacity-70 mb-1">
                {getDayName(date)}
              </div>
              <div className="text-sm font-medium">
                {date.getDate()}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        * 週末不提供門診服務
      </div>
    </div>
  );
};

export default DateSelection;