import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
declare var Notiflix: any;
@Component({
  selector: 'app-copy-dialog',
  templateUrl: './copy-dialog.component.html',
  styleUrls: ['./copy-dialog.component.scss']
})
export class CopyDialogComponent implements OnInit {

  copylink = '';

  constructor(
    public dialogRef: MatDialogRef<CopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.copylink = this.data.link;

  }

  copy(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    Notiflix.Notify.Success('Link Copied.')
  }

}
