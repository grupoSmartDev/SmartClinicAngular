// calendar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from '../_components/_calendar/calendar/calendar.component';


@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [CalendarComponent]
})
export class CalendarModule { }