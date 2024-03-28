import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DayService } from '../../services/day/day.service'
import { HttpClient } from '@angular/common/http';
import * as constants from '../constants/constants';
// import { AssetService } from '../Services/asset/asset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { GlobalService } from '../Services/global/global.service'
// import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-day-details',
  standalone: true,
  templateUrl: './day-details.component.html',
  imports:[ReactiveFormsModule,MatFormField,MatLabel,MatOptionModule, MatHint,MatDatepickerModule,MatButton,MatDialogModule,MatCheckboxModule,MatRadioModule],
  styleUrls: ['./day-details.component.scss']
})
export class DayDetailsComponent implements OnInit {
  [x: string]: any;
  startDate = new Date();
  // startDate = new Date(2001, 0, 1);
  dayDetailsForm: FormGroup;
  user: any;
  relation: any;
  dayType: any;
  userId: number = 0;
  dayId: number = 0;
  selectedImage!: string | ArrayBuffer | null;
  selectedImageFile: File | null = null;
  fil: File | null = null;
  formData: FormData = new FormData();
  dayDetails: any;
  assetDetails: any;

  constructor(private _details: FormBuilder, private _dayService: DayService, private _httpClient: HttpClient, private route: ActivatedRoute,
    private router: Router, private _dialogRef: MatDialogRef<DayDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.dayDetailsForm = this._details.group<any>({
      dayId: 0,
      personName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z. ]{3,40}$/)]],
      dayTypeId: [0, Validators.required],
      birthdate: ['', Validators.required],
      relationId: [0, Validators.required],
      mobileNumber: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      contactNumber: ['', Validators.pattern(/^[0-9]{8,12}$/)],
      emailId: ['', Validators.pattern(/^[a-zA-Z_0-9.]{3,}@[a-zA-Z\-]{2,}[.]{1}[a-zA-Z.]{2,10}$/)],
      address: '',
      assetId: 0,
      gender: '',
      image: null

    })
  }

  onDragOver(event: any) {
    event.preventDefault();
  }
  onDrop(event: any) {
    event.preventDefault();
    this.handleImageDrop(event.dataTransfer.files);
  }
  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.handleImageDrop(inputElement.files);
  }

  private handleImageDrop(files: FileList | null): void {
    if (files && files.length > 0) {

      const file = files[0];
      this.selectedImageFile = files[0];
      if (file.type.startsWith('image/')) {
        this.formData.append('file', file);

        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  }

  ngOnInit(): void {
    if (this.data) {
      if (isNaN(this.data)) {
        this.patchValues(this.data);
      }
      else if (this.data == 0) {
      }
      else {
        this.getDayDetails(this.data);
        if (this.dayDetails && this.dayDetails.AssetId) {

        }
      }
    }
    else {
      this.dayDetailsForm.controls['birthdate'].patchValue(this.startDate);
    }
  }

  getDayDetails(dayId: number) {
    this._dayService.getDayDetails(dayId).subscribe((res: any) => {
      this.dayDetails = res[0];
      this.patchValues(res[0]);
      if (this.dayDetails.AssetId) {
        // this.getAssetDetails(this.dayDetails.AssetId);
      }
    }
    )
  }

  patchValues(res: any) {
    if (res != undefined) {
      this.dayDetailsForm.controls['dayId'].patchValue(res['BirthdayId']);
      this.dayDetailsForm.controls['personName'].patchValue(res['PersonName']);
      this.dayDetailsForm.controls['relationId'].patchValue(res['SuperAdminRelationId']);
      this.dayDetailsForm.controls['dayTypeId'].patchValue(res['DayTypeId']);
      this.dayDetailsForm.controls['birthdate'].patchValue(res['Birthdate']);
      this.dayDetailsForm.controls['mobileNumber'].patchValue(res['MobileNumber']);
      this.dayDetailsForm.controls['contactNumber'].patchValue(res['ContactNumber']);
      this.dayDetailsForm.controls['emailId'].patchValue(res['EmailId']);
      this.dayDetailsForm.controls['address'].patchValue(res['Address']);
      this.dayDetailsForm.controls['gender'].patchValue(res['Gender']);
      this.dayDetailsForm.controls['image'].patchValue(res['Image']);
      this.dayDetailsForm.controls['assetId'].patchValue(res['AssetId']);
    }
  }

  submitDayDetails() {
    if (!this.dayDetailsForm.valid) {
      alert('Some issue is there');
      return;
    }
    else {
      try {
        const selectedDate = new Date(this.dayDetailsForm.value['birthdate']);
        // this.dayDetailsForm.value['birthdate'] = this.datepipe.transform(selectedDate, 'yyyy-MM-ddTHH:mm:ss');
        if (this.formData) {
          this.addImage();
        }

      } catch (error) {
        alert("Error in adding data : " + error);
        console.error("Error in adding data : ", error);
      }
    }
  }


  addDayDetails() {
    this._dayService.addDay(this.dayDetailsForm.value).subscribe((result) => {
      if (result) {
        alert("Record added successfully");
        this._dialogRef.close(true);
      }
      else
        alert('some issue is in adding the data');
    });
  }
  updateDayDetails() {
    this._dayService.updateDay(this.dayDetailsForm.value).subscribe((result) => {
      if (result) {
        alert("Record updated successfully");
        this._dialogRef.close(true);
      }
      else
        alert('some issue is in updating the data');
    });
  }

  addOrUpdateDayDetails() {
    if (this.dayDetailsForm.value['dayId'] > 0) {
      this.updateDayDetails()
    }
    else {
      this.addDayDetails();
    }
  }
  addImage() {
    if (this.selectedImageFile) {
      this._dayService.uploadImage(this.dayDetailsForm.value['assetId'], constants.BIRTHDAYPERSONPIC, this.formData).subscribe((response) => {
        this.dayDetailsForm.value['assetId'] = response;
        this.addOrUpdateDayDetails();

      });
    }
    else {
      this.addOrUpdateDayDetails();
    }
  }

}