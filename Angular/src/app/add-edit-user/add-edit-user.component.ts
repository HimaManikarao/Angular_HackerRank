import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IUser } from "../app.component";

@Component({
  selector: "app-add-edit-user",
  templateUrl: "./add-edit-user.component.html",
  styleUrls: ["./add-edit-user.component.scss"],
})
export class AddEditUserComponent {
  @Input() user: IUser = { firstName: "", lastName: "", phone: "" };
  @Input() isEditing = false;
  @Output() onSave = new EventEmitter<IUser>();
  @Output() onCancel = new EventEmitter();

  userForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phone: ["", [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
    });
  }

  onSaveClicked() {
    if (this.userForm.invalid) {
      alert(
        "Error: All fields are required and the phone number must contain 10 digits."
      );
      return;
    }

    const { firstName, lastName, phone } = this.userForm.value;
    const user: IUser = { firstName, lastName, phone };
    this.onSave.emit(user);
    this.userForm.reset();
  }

  onCancelClicked() {
    if (this.userForm.dirty) {
      if (confirm("Discard changes?")) {
        this.userForm.reset();
        this.onCancel.emit();
      }
    } else {
      this.userForm.reset();
      this.onCancel.emit();
    }
  }
}
