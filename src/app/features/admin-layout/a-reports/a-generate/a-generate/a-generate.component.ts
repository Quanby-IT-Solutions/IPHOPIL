import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-a-generate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a-generate.component.html',
  styleUrl: './a-generate.component.css'
})
export class AGenerateComponent implements OnInit {
  categories: any[] = [];
  types: any[] = [];
  offices: any[] = [];
  selectedCategoryId: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchOffices();
  }

  async fetchCategories() {
    const categories = await this.supabaseService.fetchCategories();
    if (categories) {
      this.categories = categories;
    }
  }

  async fetchOffices() { // New method to fetch office data
    const offices = await this.supabaseService.fetchOffices();
    if (offices) {
      this.offices = offices;
    }
  }

  async onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; 
    const categoryId = selectElement.value; 
    this.selectedCategoryId = categoryId; 
    await this.fetchTypes(categoryId); 
  }

  async fetchTypes(categoryId: string) {
    const types = await this.supabaseService.fetchTypes(categoryId);
    if (types) {
      this.types = types;
    }
  }
}
