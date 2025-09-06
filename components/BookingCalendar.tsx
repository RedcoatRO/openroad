
import React, { useState } from 'react';
import { ChevronRightIcon } from './icons';

interface BookingCalendarProps {
    onDateSelect: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizează la începutul zilei

    const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Luni = 0, Duminică = 6
    const daysInMonth = lastDayOfMonth.getDate();

    const calendarDays = [];
    // Adaugă zile goale pentru a alinia prima zi a lunii
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    // Adaugă zilele lunii curente
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isPast = date < today;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isSelected = selectedDate?.getTime() === date.getTime();
        const isDisabled = isPast || isWeekend;

        let classes = "w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors ";
        if (isDisabled) {
            classes += "text-gray-400 dark:text-gray-600 cursor-not-allowed";
        } else if (isSelected) {
            classes += "bg-primary text-white font-bold";
        } else {
            classes += "text-text-main dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer";
        }

        calendarDays.push(
            <div
                key={day}
                className={classes}
                onClick={() => !isDisabled && handleDayClick(date)}
            >
                {day}
            </div>
        );
    }
    
    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        onDateSelect(date);
    }

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-border dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                    <ChevronRightIcon className="w-5 h-5 transform rotate-180" />
                </button>
                <div className="font-semibold text-text-main dark:text-white capitalize">
                    {currentDate.toLocaleString('ro-RO', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-muted dark:text-gray-400 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {calendarDays}
            </div>
        </div>
    );
};

export default BookingCalendar;
