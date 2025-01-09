import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  viewMode = new FormControl('month');
  currentDate = new Date();
  selectedDate = new Date();
  weeks: Date[][] = [];
  events: CalendarEvent[] = [];
  
  constructor() {}

  ngOnInit() {
    this.generateCalendar();
    // Exemplo de eventos
    this.events = [
      {
        id: 1,
        title: 'Reunião',
        start: new Date(2025, 0, 15, 10, 0),
        end: new Date(2025, 0, 15, 11, 0),
        description: 'Reunião de equipe'
      }
    ];
  }

  generateCalendar() {
    this.weeks = [];
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    while (startDate <= lastDay) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
      this.weeks.push(week);
    }
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getWeekDates(): Date[] {
    const dates: Date[] = [];
    const startOfWeek = new Date(this.selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(startOfWeek));
      startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
    return dates;
  }

  getDayEvents(date: Date): CalendarEvent[] {
    return this.events.filter(event => 
      event.start.toDateString() === date.toDateString()
    );
  }

  selectDate(date: Date) {
    this.selectedDate = date;
  }

  isToday(date: Date): boolean {
    return new Date().toDateString() === date.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.selectedDate.toDateString() === date.toDateString();
  }
}