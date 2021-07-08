import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { VALIDATE_ERROR } from '../../constants';
export class UpdatePasswordDto {
  @IsString()
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: VALIDATE_ERROR.NEW_PASSWORD_WEAK,
  })
  newPassword: string;

  @IsString()
  confirmNewPassword: string;
}
