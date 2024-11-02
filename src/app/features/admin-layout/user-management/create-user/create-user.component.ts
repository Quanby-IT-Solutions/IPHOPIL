import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit{

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
}
