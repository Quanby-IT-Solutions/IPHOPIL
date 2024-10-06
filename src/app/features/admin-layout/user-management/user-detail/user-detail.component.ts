import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DummyDataService, User } from '../../../../core/services/dummy-data/dummy-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private dummyDataService: DummyDataService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back(); // This method will navigate back to the previous page
  }

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.dummyDataService.getUsers().find(user => user.id === userId);
  }
}
