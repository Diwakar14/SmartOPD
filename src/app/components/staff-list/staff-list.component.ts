import { CookieService } from 'ngx-cookie-service';
import { debounceTime, delay, take } from 'rxjs/operators';
import { StaffService } from './../../services/staff.service';
import { DocProfileDialogComponent } from 'src/app/components/doc-profile-dialog/doc-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { Component, OnInit } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  p:number = 1;

  filteredStaff = [];
  total: number;
  role = '';
  public config: PaginationInstance = {
    id: 'server',
    itemsPerPage: 20,
    currentPage: 1  
  };
  loading: boolean = true;

  constructor(private dialog: MatDialog, 
    private cookie: CookieService,
    private staff: StaffService) { }

  ngOnInit(): void {
    this.getPage(1);
    var decoded = jwt_decode(this.cookie.get('auth_token')); 
    this.role = decoded.allowed[0];
  }

  searchStaff(searchData){
    this.loading = true;
    let data = searchData.target.value.toLowerCase();
    this.staff.searchStaff(data).pipe(take(1)).pipe(
      debounceTime(1000),
    ).subscribe(
      (res:any) => {
        this.filteredStaff = res.users.data;
        this.loading = false;
        this.config.totalItems = res.users.total;
      },
      err => {
        this.loading = false;
      }
    );
  }

  addStaff(){
    this.dialog.open(DocProfileDialogComponent, {
      width:'400px',
      data:{origin: 'Staff List'},
      disableClose:true,
      id:'addStaff'
    }).afterClosed().subscribe((res: any) => {
      this.ngOnInit();
    });
  }

  editStaff(staff){
    if(this.role == 'Admin'){
      this.dialog.open(DocProfileDialogComponent, { 
        width:'400px',
        data:{ origin: 'Staff List', staff: staff },
        disableClose:true,
        id:'editStaff'
      });
      this.dialog.getDialogById("editStaff").afterClosed().subscribe((res) => {
          if(res == 1)
            this.ngOnInit();
      });
    }
  }

  getPage(page: number) {
    this.loading = true;
    this.staff.getPage(page).pipe(take(1)).subscribe(
      (res: any) => {
        this.config.totalItems = res.users.total;
        this.config.itemsPerPage = res.users.per_page;
        this.p = page;
        this.loading = false;
        this.filteredStaff = res.users.data;
        
      },
      err => {
        this.loading = false;
      }
    );
  }

}
