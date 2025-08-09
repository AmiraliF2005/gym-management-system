import { Component, OnInit } from '@angular/core';
import { Member } from '../../services/member';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-member-list',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  members: Member[] = [];

  constructor(private memberService: Member){ }

  ngOnInit(): void {
    
  }

  loadMembers() : void{
    this.memberService.getMembers().subscribe({
      next: (data) => this.members = data,
      error: (err) => console.error('Error loading members' , err)
    })
  }
}
