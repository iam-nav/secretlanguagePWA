import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminSignInDto } from './dto/adminSignIn.dto';
import { AdminAuthGuard } from './admin-guard';
import { HttpExceptionFilter } from './http-exception.filter';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  GetNotifications,
  GlobalResponse,
  Token,
  UserProfile,
  UsersImages,
  GetMe,
  UserResponse,
} from './swagger.response';
import { ImageIdDto } from './dto/imageId.dto';
import { ManageUsers, SearchUsers } from './swagger.response';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { GetAdmin } from './get-admin.decorator';
import { Admin } from './entity/admin.entity';
import { Delete } from '@nestjs/common';
import { AddDeviceTokenDto } from './dto/addDeviceToken.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags('Admin')
@Controller('admin')
@UseFilters(new HttpExceptionFilter())
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('signIn')
  @ApiCreatedResponse({ type: Token })
  @UsePipes(new ValidationPipe())
  async signIn(@Body() body: AdminSignInDto): Promise<Token> {
    return this.adminService.signIn(body);
  }

  // @Post('signUp')
  // @ApiCreatedResponse({ type: Token })
  // @UsePipes(new ValidationPipe())
  // async signUp(@Body() body: AdminSignInDto): Promise<Token> {
  //   return this.adminService.signUp(body);
  // }

  @Get('usersImages/:page')
  @ApiCreatedResponse({ type: [UsersImages] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getUsersImages(@Param('page') page: number): Promise<UsersImages[]> {
    return this.adminService.getUsersImages(page);
  }

  @Post('rejectImage')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async rejectImage(@Body() body: ImageIdDto): Promise<GlobalResponse> {
    return this.adminService.rejectImage(body);
  }

  @Get('notifications/:page')
  @ApiCreatedResponse({ type: [GetNotifications] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getNotifications(
    @Param('page') page: number,
  ): Promise<GetNotifications[]> {
    return this.adminService.getNotifications(page);
  }

  @Get('manageUserProfile/:userId')
  @ApiCreatedResponse({ type: ManageUsers })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async manageUserProfile(
    @Param('userId') userId: number,
  ): Promise<ManageUsers> {
    return this.adminService.manageUserProfile(Number(userId));
  }

  @Get('userProfile/:userId')
  @ApiCreatedResponse({ type: UserProfile })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async userProfile(@Param('userId') userId: number): Promise<UserProfile> {
    return this.adminService.userProfile(Number(userId));
  }

  @Patch('userProfile/:userId')
  @ApiCreatedResponse({ type: UserProfile })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserProfile> {
    return this.adminService.updateUserProfile(Number(userId), body);
  }

  @Post('blockUser/:userId')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async blockUser(@Param('userId') userId: number): Promise<GlobalResponse> {
    return this.adminService.blockUser(Number(userId));
  }

  @Post('unBlockUser/:userId')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async unBlockUser(@Param('userId') userId: number): Promise<GlobalResponse> {
    return this.adminService.unBlockUser(Number(userId));
  }

  @Post('search/:page')
  @ApiCreatedResponse({ type: [SearchUsers] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async searchUsers(
    @Body() body: SearchUsersDto,
    @Param('page') page: number,
  ): Promise<SearchUsers[]> {
    return this.adminService.searchUsers(body, page);
  }

  @Get('getRecentSearch')
  @ApiCreatedResponse({ type: [SearchUsers] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getRecentSearch(@GetAdmin() admin: Admin): Promise<SearchUsers[]> {
    return this.adminService.getRecentSearch(admin);
  }

  @Post('addRecentSearch/:userId')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async addRecentSearch(
    @GetAdmin() admin: Admin,
    @Param('userId') userId: number,
  ): Promise<GlobalResponse> {
    return this.adminService.addRecentSearch(admin, userId);
  }

  @Delete('removeRecentSearch/:userId')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async removeRecentSearch(
    @Param('userId') userId: number,
  ): Promise<GlobalResponse> {
    return this.adminService.removeRecentSearch(userId);
  }

  @Get('me')
  @ApiCreatedResponse({ type: GetMe })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getMe(@GetAdmin() admin: Admin): Promise<GetMe> {
    return this.adminService.getMe(admin);
  }

  @Get('bannedUsers/:page')
  @ApiCreatedResponse({ type: [UserResponse] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getBlockedUsers(@Param('page') page: number): Promise<UserResponse[]> {
    return this.adminService.getBannedUsers(page);
  }

  @Get('reportedUsers/:page')
  @ApiCreatedResponse({ type: [UserResponse] })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async getReportedUsers(@Param('page') page: number): Promise<UserResponse[]> {
    return this.adminService.getReportedUsers(page);
  }

  @Post('addDeviceToken')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async addDeviceToken(
    @GetAdmin() admin: Admin,
    @Body() body: AddDeviceTokenDto,
  ): Promise<GlobalResponse> {
    return this.adminService.addDeviceToken(admin, body);
  }

  @Get('logout')
  @ApiCreatedResponse({ type: GlobalResponse })
  @ApiBearerAuth()
  @UseGuards(new AdminAuthGuard('admin'))
  @UsePipes(new ValidationPipe())
  async logout(@GetAdmin() admin: Admin) {
    return this.adminService.logout(admin);
  }
}
