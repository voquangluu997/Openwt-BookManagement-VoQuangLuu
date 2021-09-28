import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
const { VALIDATE_ERROR } = require('../../constants');

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: VALIDATE_ERROR.PASSWORD_WEAK,
  })
  password: string;
}
