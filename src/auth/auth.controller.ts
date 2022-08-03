import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { CheckCodeDto } from './dto/check-code.dto';
import { SignUpConfirmDto } from './dto/sign-up-confirm.dto';
import { GlobalResponse } from './interfaces/global-response.interface';
import { SignInDto } from './dto/sign-in.dto';
import { TokenResponse } from './interfaces/token.interface';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { HttpExceptionFilter } from './http-exception.filter';
import { User } from './entity/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Global, Token } from '../swagger.response';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({ type: Global })
  @UsePipes(new ValidationPipe())
  async signUp(@Body() body: SignUpDto): Promise<TokenResponse> {
    return this.authService.signUp(body);
  }

  @Post('sign-up/check-code')
  @ApiCreatedResponse({ type: Token })
  @UsePipes(new ValidationPipe())
  async checkCode(@Body() body: CheckCodeDto): Promise<GlobalResponse> {
    return this.authService.checkCode(body);
  }

  @Post('sign-up/confirm')
  @ApiCreatedResponse({ type: Token })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async signUpConfirm(
    @GetUser() user: User,
    @Body() body: SignUpConfirmDto,
  ): Promise<TokenResponse> {
    return this.authService.signUpConfirm(user, body);
  }

  @Post('sign-in')
  @ApiCreatedResponse({ type: Global })
  @UsePipes(new ValidationPipe())
  async signIn(@Body() body: SignInDto): Promise<GlobalResponse> {
    return this.authService.signIn(body);
  }

  @Post('sign-in/check-code')
  @ApiCreatedResponse({ type: Token })
  @UsePipes(new ValidationPipe())
  async checkSignInCode(@Body() body: CheckCodeDto): Promise<TokenResponse> {
    return this.authService.checkSignInCode(body);
  }

  @Post('resend-code')
  @ApiCreatedResponse({ type: Global })
  @UsePipes(new ValidationPipe())
  async resendCode(@Body() body: SignInDto): Promise<GlobalResponse> {
    return this.authService.resendCode(body);
  }
}
