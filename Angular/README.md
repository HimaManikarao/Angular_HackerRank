# Angular: User Management

## Environment 

- Angular CLI Version: 10.0.4
- Angular Core Version: 10.0.4
- Node Version: 14(LTS)
- Default Port: 8000


**Application demo:**

![](https://hrcdn.net/s3_pub/istreet-assets/YxCaTysHB8iurlAabMN6Fw/userManagement.gif)


## Functionality Requirements

Given a partially completed Angular application with the HTML template built and ready, Certain core Angular functionalities have already been implemented. Complete the Angular application as shown in the demo in order to pass all the unit tests.

The application has 2 components:

1. The `UserListComponent` which has the user list table which includes edit/delete buttons as actions against the row.
2. The `AddEditUserComponent` which renders the form to enter the user details to be added or edited.

The app should implement the following functionalities:

1. `AddEditUserComponent`

- The initial view must not display any alert.
- Clicking the Cancel button should:
  - do nothing if the fields are empty.
  - if the fields are not empty, clear all the fields and reset them to empty.
  - clear the validation alert (if any).
  - (after clicking the Edit button) discard the changes in the form and add the original user values back to the table.
- Clicking the Add/Edit button should:
  - add field values as a row to the table with no validation alert and reset the form fields to empty.
  - after clicking the Edit button, add the user's updated data to the table or show a validation alert in case of any errors.

2. `UserListComponent`

- The initial view must display an empty list with no rows.
- Clicking the Delete button should delete the corresponding row from the table.
- Clicking the Edit button should remove the corresponding row from the table and pre-populate the form fields where updates can be made.

3. Validations for Add/Edit User view:

- Do not add a user to the list on clicking Add/Edit User and show a common 'Validation alert' if:
  - any of the input fields are empty.
  - 'phone number' field doesn't contain 10 digits or it starts with '0'.
  - The following alert needs to be shown - 'Error: All fields are required and the phone number must contain 10 digits.'

## Testing Requirements

The following data-testid attributes are required in the component for the tests to pass:

| Component | Attribute |
| :---: | :---: |
| First name input | firstNameInput |
| Last name input | lastNameInput |
| Phone input | phoneInput |
| Table of Users | userListTable |
| Cancel Button | cancelEditUserButton |
| Add/Edit  Button | addEditButton |
| Validation Alert | validationAlert |

Please note that the component has prewritten function definitions, data-testid attributes for test cases and certain classes and ids for rendering purposes. They should not be changed.


## Project Specifications

**Read-only Files**
- src/app/app.component.spec.ts

**Commands**

- run:

```bash
npm start
```

- install:

```bash
npm install
```

- test:

```bash
npm test
```
