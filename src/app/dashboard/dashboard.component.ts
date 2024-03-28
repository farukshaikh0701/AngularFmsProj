import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DayDetailsComponent } from '../day-details/day-details.component';
import { DayService } from '../../services/day/day.service';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule,MatFormFieldControl } from '@angular/material/form-field';
import { Dialog } from '@angular/cdk/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { MatIconAnchor, MatIconButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule,MatSelectModule,MatCheckboxModule,MatIconButton,
    MatIconAnchor,MatPaginatorModule,ReactiveFormsModule,MatIconModule,MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    displayedColumns: string[] = ['birthdate', 'personName', 'emailId', 'address', 'mobileNumber', 'type', 'approve','edit','delete'];
    //    'contactNumber', 'isVerified', 'dayTypeId', 'type', 'createdBy', 'createdOn', 'isRestricted', 'isDeleted', 'isEditable', 'isApprovable'];
    //, 'personName', 'emailId', 'assetId', 'superAdminRelationId', 'relationShipName',
  
    index: number = 0;
    dataSource!: MatTableDataSource<any>;
    // allowed: boolean = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    monthList: any;
    dayTypeList: any = '';
    month: any = '';
    dayType: any = '';
    searchText: string = '';
    isToday: boolean = false;
    isTomorrow: boolean = false;
    isYesterday: boolean = false;
    selectedData!: { value: any; text: any; };
    loggedInPersonName:any;
    constructor(private _dayService: DayService, private dialog: MatDialog,
      private _dialog: MatDialog,private _httpClient: HttpClient) {
    this.loggedInPersonName=localStorage.getItem("firstName");

    }
  
  
    ngOnInit() {
      this.getDayList();
    }
  
    getDayList() {
      this._dayService.getDayList(this.month, this.dayType, this.searchText, this.isToday, this.isTomorrow, this.isYesterday).subscribe((res) => {
        this.dataSource = res;
        // this.dataSource = new MatTableDataSource(res);
        // this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;
      },
      )
    }
  
    dayDetails(data: any) {
      const dialogRef = this._dialog.open(DayDetailsComponent, { data });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getDayList();
          }
        }
      })
    }
  
  
    deleteDay(dayId: number) {
  
      // const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      const dialogRef = prompt("Are you sure to delete it");
  
          this._dayService.deleteDay(dayId).subscribe((res) => {
            if (res) {
              alert('Deleted successfully')
              this.getDayList();
            }
          })  
    }
  
    addDay(day: any, user: any) {
      this._dayService.addDay(day).subscribe((res) => {
        if (res) {
          this.getDayList();
        }
      },
      )
    }
  
  
    filterGridByMonth(data: MatSelectChange) {
      // this.selectedData = {
      //   value: data.value,
      //   text: data.source.triggerValue
      // };
      this.month = data.value;
      this.getDayList();
    }
  
    filterGridByType(data: any) {
      this.dayType = data;
      this.getDayList();
    }
  
    filterGridSearchText(data: any) {
      this.searchText = data.target.value;
      this.getDayList();
    }
  
  
    task: Task = {
      name: 'Show all records',
      completed: false,
      color: 'primary',
      subtasks: [
        { name: 'Today', completed: false, color: 'primary' },
        { name: 'Yesterday', completed: false, color: 'primary' },
        { name: 'Tomorrow', completed: false, color: 'primary' },
      ],
    };
    allComplete: boolean = false;
  
    updateAllComplete() {
      this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  
      this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
      this.isYesterday = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
      this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
  
  
      this.getDayList();
  
    }
  
    someComplete(): boolean {
      this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
      this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
      this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
      if (this.task.subtasks == null) {
        return false;
      }
      return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    }
  
    setAll(completed: boolean) {
      this.allComplete = completed;
      if (this.task.subtasks == null) {
        return;
      }
      this.task.subtasks.forEach(t => (t.completed = completed));
      this.isToday = (this.task.subtasks != null && this.task.subtasks[0].completed);//(t => t.completed);
      this.isTomorrow = (this.task.subtasks != null && this.task.subtasks[1].completed);//(t => t.completed);
      this.isYesterday = (this.task.subtasks != null && this.task.subtasks[2].completed);//(t => t.completed);
  
      this.getDayList();
    }
  
}
