import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IUser } from "../app.component";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent {
  @Input() users: IUser[] = [];

  @Output() onEdit = new EventEmitter<IUser>();
  @Output() onDelete = new EventEmitter<number>();

  onDeleteClicked(index: number) {
    this.onDelete.emit(index);
  }

  onEditClicked(user) {
    this.onEdit.emit(user);
  }
}
