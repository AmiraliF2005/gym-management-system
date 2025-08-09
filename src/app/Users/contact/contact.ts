import { Component } from '@angular/core';
import { Api } from '../../api';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  users: string[] = [];

  constructor(private apiService: Api) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
