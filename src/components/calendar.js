import React, { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth,
    endOfMonth, startOfWeek, endOfWeek, addDays, isAfter, setMonth,
    setYear, startOfYear, endOfYear, eachMonthOfInterval, addYears, subYears
} from 'date-fns';


function Calendar() {
    // 색상 배열: 각 날짜에 대한 기분 색상을 지정하는 데 사용
    const colors = ['','#FFABAB', '#FFC3A0', '#FFF58E', '#CDE6A5','#ACD1EA','#9FB1D9','#C8BFE7'];

    // 상태 변수 정의
    const [currentMonth, setCurrentMonth] = useState(new Date()); // 현재 달력에 표시되는 월
    const [selectedDate, setSelectedDate] = useState(null); // 사용자가 선택한 날짜
    const [moodColors, setMoodColors] = useState({}); // 날짜별 기분 색상
    const [showColorPicker, setShowColorPicker] = useState(false); // 색상 선택기 표시 여부
    const [today, setToday] = useState(new Date()); // 오늘 날짜
    const [isEditingMonth, setIsEditingMonth] = useState(false); // 월 편집 모드 여부
    const [isEditingYear, setIsEditingYear] = useState(false); // 연도 편집 모드 여부
    const [inputMonth, setInputMonth] = useState(format(currentMonth, 'M')); // 입력된 월
    const [inputYear, setInputYear] = useState(format(currentMonth, 'yyyy')); // 입력된 연도
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림 여부
    const [isYearlyView, setIsYearlyView] = useState(false); // 연간 보기 모드 여부
    const [currentYear, setCurrentYear] = useState(new Date()); // 현재 연도
    const [isEditingYearInYearlyView, setIsEditingYearInYearlyView] = useState(false); // 연간 보기 모드에서 연도 편집 모드 여부

    // 컴포넌트가 마운트될 때 오늘 날짜를 업데이트
    useEffect(() => {
        setToday(new Date());
    }, []);

    // 이전 달로 이동
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    // 다음 달로 이동
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // 이전 연도로 이동 (연간 보기 모드에서 사용)
    const prevYear = () => setCurrentYear(subYears(currentYear, 1));

    // 다음 연도로 이동 (연간 보기 모드에서 사용)
    const nextYear = () => setCurrentYear(addYears(currentYear, 1));

    // 오늘 날짜로 이동
    const goToToday = () => {
        setCurrentMonth(startOfMonth(today));
        setIsYearlyView(false);
    };

    // 날짜 클릭 시 실행되는 함수: 날짜 선택 및 색상 선택기 표시
    const onDateClick = (day) => {
        if (!isAfter(day, today)) {
            setSelectedDate(day);
            setShowColorPicker(true);
        }
    };

    // 색상 선택 시 실행되는 함수: 선택된 날짜에 색상 적용
    const handleColorClick = (color) => {
        if (selectedDate) {
            setMoodColors(prevColors => ({
                ...prevColors,
                [format(selectedDate, 'yyyy-MM-dd')]: color,
            }));
        }
        setShowColorPicker(false); // 색상 선택기 숨기기
    };

    // 월 변경을 처리하는 함수
    const handleMonthChange = () => {
        const newMonth = parseInt(inputMonth, 10);
        if (newMonth >= 1 && newMonth <= 12) {
            setCurrentMonth(setMonth(currentMonth, newMonth - 1));
            setIsEditingMonth(false); // 월 편집 모드 종료
        }
    };

    // 연도 변경을 처리하는 함수
    const handleYearChange = () => {
        const newYear = parseInt(inputYear, 10);
        if (newYear >= 1900) {
            setCurrentMonth(setYear(currentMonth, newYear));
            setIsEditingYear(false); // 연도 편집 모드 종료
        }
    };

    // 연간 보기 모드에서 연도 변경을 처리하는 함수
    const handleYearChangeInYearlyView = () => {
        const newYear = parseInt(inputYear, 10);
        if (newYear >= 1900) {
            setCurrentYear(setYear(currentYear, newYear));
            setIsEditingYearInYearlyView(false); // 연도 편집 모드 종료
        }
    };

    // Enter 키를 눌렀을 때 호출되는 콜백 함수
    const handleKeyDown = (e, callback) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callback();
        }
    };

    // 달력 헤더 렌더링: 월 및 연도 표시 및 변경 버튼
    const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => (
        <div className="calendar-header">
            <button className="prev-button" onClick={prevMonth}>◀</button>
            <div className="month-year-container">
                {isEditingYear ? (
                    <input
                        type="number"
                        value={inputYear}
                        onChange={(e) => setInputYear(e.target.value)}
                        onBlur={handleYearChange}
                        onKeyDown={(e) => handleKeyDown(e, handleYearChange)}
                        autoFocus
                        className="month-year-input"
                    />
                ) : (
                    <span className="month-year" onClick={() => setIsEditingYear(true)}>
                        {format(currentMonth, 'yyyy년')}
                    </span>
                )}
                {isEditingMonth ? (
                    <input
                        type="number"
                        value={inputMonth}
                        onChange={(e) => setInputMonth(e.target.value)}
                        onBlur={handleMonthChange}
                        onKeyDown={(e) => handleKeyDown(e, handleMonthChange)}
                        autoFocus
                        className="month-year-input"
                    />
                ) : (
                    <span className="month-year" onClick={() => setIsEditingMonth(true)}>
                        {format(currentMonth, 'M월')}
                    </span>
                )}
            </div>
            <button className="next-button" onClick={nextMonth}>▶</button>
        </div>
    );

    // 요일 헤더 렌더링: 일월화수목금토
    const RenderDays = () => {
        const days = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col" key={i}>
                    {dayLabels[i]}
                </div>,
            );
        }

        return <div className="days row">{days}</div>;
    };

    // 달력의 날짜 셀 렌더링
    const RenderCells = ({ currentMonth, moodColors, onDateClick }) => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
    
        const rows = [];
        let day = startDate;
    
        while (day <= endDate) {
            const days = [];
    
            for (let i = 0; i < 7; i++) {
                const currentDay = day;
                const dayKey = format(currentDay, 'yyyy-MM-dd');
                const dayColor = moodColors[dayKey] || 'transparent';
    
                days.push(
                    <div
                        className={`col cell ${
                            !isSameMonth(currentDay, startOfMonth(currentMonth))
                                ? 'disabled'
                                : isSameDay(currentDay, today)
                                ? 'today'  // 오늘 날짜에 특별한 클래스를 추가
                                : isSameDay(currentDay, selectedDate)
                                ? 'selected'
                                : 'valid'
                        } ${isAfter(currentDay, today) ? 'disabled' : ''}`}
                        key={dayKey}
                        style={{ backgroundColor: dayColor }}
                        onClick={() => onDateClick(currentDay)}
                    >
                        <span className={
                            !isSameMonth(currentDay, startOfMonth(currentMonth))
                                ? 'text not-valid'
                                : ''
                        }>
                            {format(currentDay, 'd')}
                        </span>
                    </div>,
                );
    
                day = addDays(day, 1);
            }
            rows.push(
                <div className="row" key={format(day, 'yyyy-MM-dd')}>
                    {days}
                </div>,
            );
        }
        return <div className="body">{rows}</div>;
    };
    

// 연간 보기에서 개별 월 렌더링
const RenderMiniMonth = ({ month, moodColors, onMonthClick }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = day;
            const dayKey = format(currentDay, 'yyyy-MM-dd');
            const dayColor = moodColors[dayKey] || 'transparent';

            days.push(
                <div
                    className={`monthly-calendar-cell ${
                        !isSameMonth(currentDay, monthStart) ? 'disabled' : ''
                    } ${
                        isSameDay(currentDay, today) ? 'today' : ''  // 오늘 날짜에 특별한 스타일 추가
                    }`}
                    key={dayKey}
                    onClick={() => onMonthClick(month)}
                >
                    <div className="day-circle" style={{ backgroundColor: dayColor }}>
                        {format(currentDay, 'd')}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={format(day, 'yyyy-MM-dd')}>
                {days}
            </div>
        );
    }

    return (
        <div className="monthly-calendar" onClick={() => onMonthClick(month)}>
            <div className="month-box">
                <div className="month-title">{format(month, 'M월')}</div>
                {rows}
            </div>
        </div>
    );
};

    // 연간 보기 모드 렌더링
    const RenderYearView = ({ currentYear, moodColors }) => {
        const yearStart = startOfYear(currentYear);
        const yearEnd = endOfYear(currentYear);
        const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

        // 월 클릭 시 해당 월로 이동
        const handleMonthClick = (month) => {
            setCurrentMonth(month);  // 클릭한 월로 이동
            setIsYearlyView(false);  // 연간 보기 모드 종료
        };

        return (
            <div className="year-view">
                <div className="year-header">
                    <button onClick={prevYear} className="prev-button">◀</button>
                    {isEditingYearInYearlyView ? (
                        <input
                            type="number"
                            value={inputYear}
                            onChange={(e) => setInputYear(e.target.value)}
                            onBlur={handleYearChangeInYearlyView}
                            onKeyDown={(e) => handleKeyDown(e, handleYearChangeInYearlyView)}
                            autoFocus
                            className="year-input"
                        />
                    ) : (
                        <span className="year-display" onClick={() => setIsEditingYearInYearlyView(true)}>
                            {format(currentYear, 'yyyy년')}
                        </span>
                    )}
                    <button onClick={nextYear} className="next-button">▶</button>
                </div>
                <div className="months-container">
                    {months.map((month, index) => (
                        <RenderMiniMonth
                            key={index}
                            month={month}
                            moodColors={moodColors}
                            onMonthClick={handleMonthClick}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // 사이드바 토글
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    // 연간 보기 모드로 전환
    const handleYearlyViewClick = () => setIsYearlyView(true);
    // 월별 보기 모드로 전환
    const handleCurrentViewClick = () => setIsYearlyView(false);

    return (
        <div className="calendar-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {!isSidebarOpen && (
                    <div className="sidebar-icon" onClick={toggleSidebar}>
                        <span className="material-symbols-outlined">calendar_today</span>
                    </div>
                )}
                {isSidebarOpen && (
                    <div className="sidebar-content">
                        <button className="close-button" onClick={toggleSidebar}>◀</button>
                        <button className="sidebar-button" onClick={handleYearlyViewClick}>연간 달력 보기</button>
                        <button className="sidebar-button" onClick={handleCurrentViewClick}>월별 달력 보기</button>
                        <span className="material-symbols-outlined" onClick={goToToday}>refresh</span>
                    </div>
                )}
            </div>
            {!isYearlyView ? (
                <>
                    <RenderHeader
                        currentMonth={currentMonth}
                        prevMonth={prevMonth}
                        nextMonth={nextMonth}
                    />
                    <div className="calendar">
                        <RenderDays />
                        <RenderCells
                            currentMonth={currentMonth}
                            moodColors={moodColors}
                            onDateClick={onDateClick}
                        />
                    </div>
                </>
            ) : (
                <RenderYearView currentYear={currentYear} moodColors={moodColors} />
            )}
            {showColorPicker && (
                <div className="color-picker">
                    {colors.map(color => (
                        <div
                            key={color}
                            className="color-option"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorClick(color)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Calendar;