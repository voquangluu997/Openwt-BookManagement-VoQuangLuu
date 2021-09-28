import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// export const GetUser = createParamDecorator(
//   (_data, ctx: ExecutionContext): User => {
//     const req = ctx.switchToHttp().getRequest();
//     return req.user;
//   },
// );

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  console.log('Req : ', req.user);
  return req.user;
});
