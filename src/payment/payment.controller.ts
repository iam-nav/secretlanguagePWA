import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../auth/http-exception.filter';
import { GlobalResponse } from '../auth/interfaces/global-response.interface';
import { PaymentService } from './payment.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entity/user.entity';
import { VerifyReceiptDto } from './dto/verifyReceipt.dto';
import { Global } from '../swagger.response';
import { AddPaidReportDto } from './dto/addPaidReport.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@UseFilters(new HttpExceptionFilter())
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('verifyReceipt')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async verifyReceipt(
    @GetUser() user: User,
    @Body() body: VerifyReceiptDto,
  ): Promise<GlobalResponse> {
    return this.paymentService.verifyReceipt(user, body);
  }

  @Post('addPaidReport')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addPaidReport(
    @GetUser() user: User,
    @Body() body: AddPaidReportDto,
  ): Promise<GlobalResponse> {
    return this.paymentService.addPaidReport(user, body);
  }

  @Get('verifyUserSubscriptionStatus')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async verifyUserSubscriptionStatus(
    @GetUser() user: User,
  ): Promise<GlobalResponse> {
    return this.paymentService.verifyUserSubscriptionStatus(user);
  }
}
