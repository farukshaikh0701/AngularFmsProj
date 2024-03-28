import {
  Component
} from '@angular/core';
import {
  DashboardComponent
} from "../dashboard/dashboard.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  imports: [DashboardComponent]
})
export class LayoutComponent {
  router: any;
  constructor() {
    debugger;
    if (localStorage.getItem("currentUser") == "false") {
      this.router.navigate(["/logout/"]); //, this.data[0].UserId]);

    }
  }
}
