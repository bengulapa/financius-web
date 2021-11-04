import { Component, OnInit } from '@angular/core';
import {
  Account,
  FinanciusBackup,
} from 'src/app/shared/models/financius.models';
import * as data from 'src/assets/data.json';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss'],
})
export class DashboardShellComponent implements OnInit {
  data: FinanciusBackup = data;

  constructor() {}

  ngOnInit(): void {}
}
