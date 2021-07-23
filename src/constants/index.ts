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
  GET_AUTHORS_FAIL = 'Failed to get authors',
  CREATE_AUTHOR_FAIL = 'Failed to create author',
  GET_CATEGORIES_FAIL = 'Failed to get categories',
  CREATE_CATEGORY_FAIL = 'Failed to get category',
  GET_BOOKS_FAIL = 'Failed to get books',
  CREATE_BOOK_FAIL = 'Failed to create book',
  CATEGORY_CONFLICT = 'category already exists',
  BOOK_CONFLICT = 'book already exists',
  CATEGORY_NOT_FOUND = 'category not found',
  AUTHOR_NOT_FOUND = 'author not found',
  BOOK_NOT_FOUND = 'book not found',
  QUERY_FAIL = 'Query failed, please check your query',
}

export enum SUCCESS_MESSAGE {
  PASSWORD_CONFIRM_SUCCESSFULY = 'Update password succesfuly',
}
