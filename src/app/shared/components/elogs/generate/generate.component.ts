import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { CommonModule } from '@angular/common';

interface Category {
  category_id: string;
  name: string;
  description?: string;
  created_at?: string;
}

interface DocumentType {
  type_id: string;
  name: string;
  category_id: string;
  description?: string;
  created_at?: string;
}
@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {
  categories: Category[] = [];
  types: DocumentType[] = [];
  selectedCategoryId: string | null = null;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.fetchCategories();
  }

  async fetchCategories() {
    const categories = await this.supabaseService.fetchCategories();
    if (categories) {
      this.categories = categories;
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
