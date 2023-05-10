import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AppComponent, IUser } from './app.component';
import { UserListComponent } from './user-list/user-list.component';

const TEST_IDS = {
  input: {
    firstNameInput: 'firstNameInput',
    lastNameInput: 'lastNameInput',
    phoneInput: 'phoneInput',
  },
  list: {
    userListTable: 'userListTable',
  },
  button: {
    cancelEditUserButton: 'cancelEditUserButton',
    addEditButton: 'addEditButton',
  },
  views: {
    validationAlert: 'validationAlert',
  }
}

const VALIDATION_ERROR_MSG = 'Error: All fields are required and the phone number must contain 10 digits.';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let debugElement: DebugElement;
  let firstNameInput: HTMLInputElement;
  let lastNameInput: HTMLInputElement;
  let phoneNumberInput: HTMLInputElement;
  let addEditButtonInput: HTMLButtonElement;
  let cancelButtonInput: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
      ],
      declarations: [
        AppComponent,
        AddEditUserComponent,
        UserListComponent
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
    await fixture.whenStable();

    firstNameInput = getByTestId(TEST_IDS.input.firstNameInput).nativeElement;
    lastNameInput = getByTestId(TEST_IDS.input.lastNameInput).nativeElement;
    phoneNumberInput = getByTestId(TEST_IDS.input.phoneInput).nativeElement;
    addEditButtonInput = getByTestId(TEST_IDS.button.addEditButton).nativeElement;
    cancelButtonInput = getByTestId(TEST_IDS.button.cancelEditUserButton).nativeElement;
  });

  const getByTestId = (attrName: string) => {
    debugElement = fixture.debugElement;
    return debugElement.query(By.css(`[data-testid=${attrName}]`));
  }

  const checkTableListValues = (rows, firstName = undefined, lastName = undefined, phone = undefined) => {
    expect(getByTestId(TEST_IDS.list.userListTable).children[1].children.length).toEqual(rows)


    if (rows > 0) {
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[0].nativeElement.textContent.trim()).toEqual(firstName)
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[1].nativeElement.textContent.trim()).toEqual(lastName)
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[2].nativeElement.textContent.trim()).toEqual(phone)
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[0].nativeElement.textContent.trim()).toEqual('Edit')
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[1].nativeElement.textContent.trim()).toEqual('Delete')
    }
  }

  const checkFormValues = (firstName, lastName, phone) => {
    debugElement = fixture.debugElement;

    firstNameInput = getByTestId(TEST_IDS.input.firstNameInput).nativeElement;
    lastNameInput = getByTestId(TEST_IDS.input.lastNameInput).nativeElement;
    phoneNumberInput = getByTestId(TEST_IDS.input.phoneInput).nativeElement;

    expect(firstNameInput.value).toEqual(firstName)
    expect(lastNameInput.value).toEqual(lastName)
    expect(phoneNumberInput.value).toEqual(phone)
  }

  const addEditUser = async (firstName: string, lastName: string, phone: string, element = addEditButtonInput) => {
    debugElement = fixture.debugElement;

    firstNameInput = getByTestId(TEST_IDS.input.firstNameInput).nativeElement;
    lastNameInput = getByTestId(TEST_IDS.input.lastNameInput).nativeElement;
    phoneNumberInput = getByTestId(TEST_IDS.input.phoneInput).nativeElement;

    firstNameInput.value = firstName;
    firstNameInput.dispatchEvent(new Event('input'));
    firstNameInput.dispatchEvent(new Event('change'));

    lastNameInput.value = lastName;
    lastNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('change'));

    phoneNumberInput.value = phone;
    phoneNumberInput.dispatchEvent(new Event('input'));
    phoneNumberInput.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();
  }

  describe('App Initialization', () => {
    it('should initially show empty table list', () => {
      checkTableListValues(0)
    })

    it('should initially not show validation alert', () => {
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
    })
  })

  describe('Cancel Button', () => {
    it('should do nothing when user clicks cancel button with no data in the form', async() => {
      checkFormValues('', '', '')
      cancelButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
      checkTableListValues(0)
    })

    it('should clear all entered values when user clicks cancel button', async () => {
      checkFormValues('', '', '')

      addEditUser('someFirstName', 'someLastName', '1111');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkFormValues('someFirstName', 'someLastName', '1111')
      cancelButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkFormValues('', '', '');
      checkTableListValues(0);
    })

    it('should clear validation alert when user clicks cancel button', async() => {
      checkFormValues('', '', '')
      addEditUser('someFirstName', 'someLastName', '1111');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);
      cancelButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
        checkTableListValues(0)
    })
  })

  describe('Validation', () => {
    it('should not add the user record to the list if any input fields is empty and should show an alert on screen', async() => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('', 'someLastName', '8888888888')
      addEditButtonInput.click()
      fixture.detectChanges()
      await fixture.whenStable()
      checkTableListValues(0)
      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);

      addEditUser('someFirstName', '', '8888888888')
      addEditButtonInput.click()
      fixture.detectChanges()
      await fixture.whenStable();
      checkTableListValues(0)
      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);

      addEditUser('someFirstName', 'someLastName', '0');
      addEditButtonInput.click()
      fixture.detectChanges()
      await fixture.whenStable();
      checkTableListValues(0)
      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);
    })

    it('should not add the user record to the list if phone number is not 10 digits and should show an alert on screen', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '1111')
      addEditButtonInput.click()
      fixture.detectChanges()
      await fixture.whenStable();
      checkTableListValues(0)
      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);
    })

    it('should not add the user record to the list if phone number is 10 digits but starts with zero(0) and should show an alert on screen', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '0999999999')
      addEditButtonInput.click()
      fixture.detectChanges()
      await fixture.whenStable();
      checkTableListValues(0)
      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);
    })
  })

  describe('Add/Edit Button', () => {
    it('should show validation error when user clicks Add/Edit button with no data in the form', async() => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getByTestId(TEST_IDS.views.validationAlert).nativeElement.textContent.trim()).toEqual(VALIDATION_ERROR_MSG);
      checkTableListValues(0);
    });

    it('should not show validation alert when correct values are supplied with click of Add/Edit button', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999')
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
    })
  })

  describe('User List with Actions', () => {
    it('should check that after a user record is added all the fields are displayed along with the actions', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull();
      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999')
    })

    it('should delete the user from the list when delete button is clicked on the user row', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999')
      getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[1].nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getByTestId(TEST_IDS.list.userListTable).children[1].children.length).toEqual(0)
    })

    it('should populate the user details in the form for edit when edit button is clicked on the row', async () => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999')
      getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[0].nativeElement.click();
      fixture.detectChanges()
      await fixture.whenStable();
      checkFormValues('someFirstName', 'someLastName', '9999999999')
    })

    it('should add back the details of the user without any change if cancel button is clicked after edit button', async() => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999');
      getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[0].nativeElement.click();
      fixture.detectChanges()
      await fixture.whenStable();
      checkFormValues('someFirstName', 'someLastName', '9999999999');

      cancelButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999');
    })

    it('should update the user in the list with new values when Add/User is clicked', async() => {
      checkFormValues('', '', '')
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()

      addEditUser('someFirstName', 'someLastName', '9999999999');
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      checkTableListValues(1, 'someFirstName', 'someLastName', '9999999999')
      getByTestId(TEST_IDS.list.userListTable).children[1].children[0].children[3].children[0].nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();

      checkFormValues('someFirstName', 'someLastName', '9999999999')

      addEditUser('updatedFirstName', 'updatedLastName', '9999999998')
      addEditButtonInput.click();
      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(getByTestId(TEST_IDS.views.validationAlert)).toBeNull()
      checkTableListValues(1, 'updatedFirstName', 'updatedLastName', '9999999998')
    })
  })
});
