import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TrainerService } from '../../services/trainerService';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Trainer } from '../../Models/trainer.model';

@Component({
  selector: 'app-trainer-list',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './trainer-list.html',
  styleUrl: './trainer-list.css'
})
export class TrainerList implements OnInit {
  displayedColumns: string[] = ['name', 'specialization', 'phone', 'schedule','actions'];
  dataSource = new MatTableDataSource<Trainer>();

  constructor(private trainerService: TrainerService) { }

  ngOnInit(): void {

  }

  loadTrainers(): void {
    this.trainerService.getTrainers().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('خطا در دریافت مربیان:', err)
    });
  }
}
