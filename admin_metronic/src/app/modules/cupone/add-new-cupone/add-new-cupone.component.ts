import { Component, OnInit } from '@angular/core';
import { CuponeService } from '../_services/cupone.service';

@Component({
  selector: 'app-add-new-cupone',
  templateUrl: './add-new-cupone.component.html',
  styleUrls: ['./add-new-cupone.component.scss']
})
export class AddNewCuponeComponent implements OnInit {

  isLoading$: any

  constructor(
    public _cuponService:CuponeService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._cuponService.isLoading$;
  }

}
