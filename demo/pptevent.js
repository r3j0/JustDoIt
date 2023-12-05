window.addEventListener("keydown", e => {
    let n = Number(e.key);
    if (n == 0) {
        data = []
        CalendarData = []
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
        createTasks();
        generateCalendar(nowYear, nowMonth);
    }
    else if (n == 1) {
        data = [
            {"calindex": -1, "index": 1, "text": "3H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 180},
            {"calindex": -1, "index": 2, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 3, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 4, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
        ];
        CalendarData = [
            {"index": 1, "text": "X", "date": "2023-12-04", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 2, "text": "X", "date": "2023-12-05", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 3, "text": "X", "date": "2023-12-06", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 4, "text": "X", "date": "2023-12-07", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 5, "text": "X", "date": "2023-12-08", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 6, "text": "X", "date": "2023-12-09", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 7, "text": "X", "date": "2023-12-10", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 8, "text": "X", "date": "2023-12-11", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            
            {"index": 9, "text": "07~10", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 3, "location": "", "startTime": "07:00", "endTime": "10:00"},
            {"index": 10, "text": "13~24", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 5, "location": "", "startTime": "13:00", "endTime": "24:00"},
            
            {"index": 11, "text": "09~12", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 4, "location": "", "startTime": "09:00", "endTime": "12:00"},
            {"index": 12, "text": "13~16", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 2, "location": "", "startTime": "13:00", "endTime": "16:00"},
        ];
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
        createTasks();
        generateCalendar(nowYear, nowMonth);
    }
    else if (n == 2) {
        data = [
            {"calindex": -1, "index": 1, "text": "3H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 180},
            {"calindex": -1, "index": 2, "text": "1H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 3, "text": "1H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 4, "text": "1H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 60},
        ];
        CalendarData = [
            {"index": 1, "text": "X", "date": "2023-12-04", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 2, "text": "X", "date": "2023-12-05", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 3, "text": "X", "date": "2023-12-06", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 4, "text": "X", "date": "2023-12-07", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 5, "text": "X", "date": "2023-12-08", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 6, "text": "X", "date": "2023-12-09", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 7, "text": "X", "date": "2023-12-10", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 8, "text": "X", "date": "2023-12-11", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            
            {"index": 9, "text": "07~10", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 3, "location": "", "startTime": "07:00", "endTime": "10:00"},
            {"index": 10, "text": "13~24", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 5, "location": "", "startTime": "13:00", "endTime": "24:00"},
            
            {"index": 11, "text": "09~12", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 4, "location": "", "startTime": "09:00", "endTime": "12:00"},
            {"index": 12, "text": "13~16", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 2, "location": "", "startTime": "13:00", "endTime": "16:00"},
        ];
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
        createTasks();
        generateCalendar(nowYear, nowMonth);
    }
    else if (n == 3) {
        data = [
            {"calindex": -1, "index": 1, "text": "3H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 180},
            {"calindex": -1, "index": 2, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 3, "text": "2H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 120},
            {"calindex": -1, "index": 4, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
        ];
        CalendarData = [
            {"index": 1, "text": "X", "date": "2023-12-04", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 2, "text": "X", "date": "2023-12-05", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 3, "text": "X", "date": "2023-12-06", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 4, "text": "X", "date": "2023-12-07", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 5, "text": "X", "date": "2023-12-08", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 6, "text": "X", "date": "2023-12-09", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 7, "text": "X", "date": "2023-12-10", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 8, "text": "X", "date": "2023-12-11", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            
            {"index": 9, "text": "07~10", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 3, "location": "", "startTime": "07:00", "endTime": "10:00"},
            {"index": 10, "text": "13~24", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 5, "location": "", "startTime": "13:00", "endTime": "24:00"},
            
            {"index": 11, "text": "09~12", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 4, "location": "", "startTime": "09:00", "endTime": "12:00"},
            {"index": 12, "text": "13~16", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 2, "location": "", "startTime": "13:00", "endTime": "16:00"},
        ];
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
        createTasks();
        generateCalendar(nowYear, nowMonth);
    }
    else if (n == 4) {
        data = [
            {"calindex": -1, "index": 1, "text": "3H High", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "high", "location": "", "executionTime": 180},
            {"calindex": -1, "index": 2, "text": "1H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 60},
            {"calindex": -1, "index": 3, "text": "2H Medium", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "medium", "location": "", "executionTime": 120},
            {"calindex": -1, "index": 4, "text": "1H Low", "date": "2023-12-21", "description": "", "color_category": "none", "priority": "low", "location": "", "executionTime": 60},
        ];
        CalendarData = [
            {"index": 1, "text": "X", "date": "2023-12-04", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 2, "text": "X", "date": "2023-12-05", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 3, "text": "X", "date": "2023-12-06", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 4, "text": "X", "date": "2023-12-07", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 5, "text": "X", "date": "2023-12-08", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 6, "text": "X", "date": "2023-12-09", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 7, "text": "X", "date": "2023-12-10", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            {"index": 8, "text": "X", "date": "2023-12-11", "description": "", "type": "Schedule", "color_category": 0, "location": "", "startTime": "00:00", "endTime": "23:59"},
            
            {"index": 9, "text": "07~10", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 3, "location": "", "startTime": "07:00", "endTime": "10:00"},
            {"index": 10, "text": "13~24", "date": "2023-12-12", "description": "", "type": "Schedule", "color_category": 5, "location": "", "startTime": "13:00", "endTime": "24:00"},
            
            {"index": 11, "text": "09~12", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 4, "location": "", "startTime": "09:00", "endTime": "12:00"},
            {"index": 12, "text": "13~16", "date": "2023-12-13", "description": "", "type": "Schedule", "color_category": 2, "location": "", "startTime": "13:00", "endTime": "16:00"},
        ];
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
        createTasks();
        generateCalendar(nowYear, nowMonth);
    }
  });