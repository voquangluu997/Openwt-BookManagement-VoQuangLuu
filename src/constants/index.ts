export enum VALIDATE_ERROR {
  PASSWORD_WEAK = 'Pasword is to weak',
  NEW_PASSWORD_WEAK = 'New pasword is to weak',
  INVALID_EMAIL = 'Invalid email',
  EMAIL_CONFLICT = 'Email already exists',
  EXISTS_EMAIL_CODE = '23505',
  PASSWORD_INCORRECT = 'Password incorrect',
  CONFIRM_PASSWORD_FAILED = 'new password and confirm password must be the same',
  CONFLICT_CODE = '23505',
}

export enum EXCEPTION_MESSAGE {
  UNAUTHORIZED = 'Please check your login credentials',
  USER_NOTFOUND = 'User not found',
  CONFLICT_BOOK_TITLE = 'Book title already exists',
}

export enum SUCCESS_MESSAGE {
  PASSWORD_CONFIRM_SUCCESSFULY = 'Update password succesfuly',
}
