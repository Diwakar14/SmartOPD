import { debounceTime } from 'rxjs/operators';
import { StateService } from './../../services/state.service';
import { Department } from './../../models/department.model';
import { DialogComponent } from './../dialog/dialog.component';
import { DepartmentService } from './../../services/department.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare var Notiflix: any;

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  departments: any[];
  page:number = 1;
  loading = true;
  filteredDepartment: any[] = [];
  dept: Department = new Department();
  loadingSearchDataDept: boolean;
  constructor(private departmentService: DepartmentService, 
    private stateService: StateService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.departmentService.getDepartment(true).subscribe((dept: any) => {
      this.departments = dept.departments;
      this.filteredDepartment = this.departments;
      // console.log(this.departments);
      this.loading = false;
    })
  }


  search(searchData){
    this.loadingSearchDataDept = true;
    let data = searchData.target.value.toLowerCase();
    this.departmentService.searchDepartment(data).pipe(
      debounceTime(1000),
    ).subscribe(
      (res:any) => {
        // console.log(res);
        this.filteredDepartment = res.departments;
        this.loadingSearchDataDept = false;
      }
    );
    // console.log(this.filteredDepartments);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {name: this.dept.name}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dept.name = result;
        this.departmentService.createDepartment(this.dept).subscribe(
          (res: any) => {
            Notiflix.Notify.Success("Department Added !");
            this.ngOnInit();
          },
          err => {
            console.log(err);
            Notiflix.Notify.Failure(err.message);
          }
        )
      }
    });
  }


}
