import {TemplateRef, ViewChild} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {User} from './user';
import {UserService} from './user.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  @ViewChild('readOnlyTemplate') readOnlyTemplate: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate: TemplateRef<any>;

  editedUser: User;
  users: Array<User>;
  isNewRecord: boolean;
  statusMessage: string;

  constructor(private serv: UserService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.serv.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  addUser() {
    this.editedUser = new User(0,"",0);
    this.users.push(this.editedUser);
    this.isNewRecord = true;
  }


  editUser(user: User) {
    this.editedUser = new User(user.Id, user.Name, user.Age);
  }

  loadTemplate(user: User) {
    if (this.editedUser && this.editedUser.Id == user.Id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  saveUser() {
    if (this.isNewRecord) {

      this.serv.createUser(this.editedUser).subscribe(data => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadUsers();
      });
      this.isNewRecord = false;
      this.editedUser = null;
    } else {

      this.serv.updateUser(this.editedUser.Id, this.editedUser).subscribe(data => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadUsers();
      });
      this.editedUser = null;
    }
  }

  cancel() {

    if (this.isNewRecord) {
      this.users.pop();
      this.isNewRecord = false;
    }
    this.editedUser = null;
  }

  deleteUser(user: User) {
    this.serv.deleteUser(user.Id).subscribe(data => {
      this.statusMessage = 'Данные успешно удалены',
        this.loadUsers();
    });
  }
}
