import {
  Component
} from '@angular/core';

export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  user: IUser = { firstName: '', lastName: '', phone: '' };
  // adding mock values initially. Please remove this during implementation.
  users: IUser[] = [{
    firstName: 'A', lastName: 'B', phone: '9999999999' 
  }];

  editUser(user: IUser): void {
    
  }

  deleteUser(user: IUser): void {
    
  }

  upsertUser(user: IUser): void {
    
  }
}
