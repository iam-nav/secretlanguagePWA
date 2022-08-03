import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SearchUsersDto } from './dto/searchUsers.dto';
import {
  Body,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Controller, UseFilters, Response } from '@nestjs/common';
import { GlobalResponse } from './interfaces/global-response.interface';
import { AddUserLeftSwipeDto } from './dto/add-user-left-swipe.dto';
import { AddUserLocationDto } from './dto/addUserLocation.dto';
import { HttpExceptionFilter } from './http-exception.filter';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './entity/user.entity';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { Get } from '@nestjs/common';
import { MyFriendsResponse } from './interfaces/my-friends.interface';
import { ReportedDto } from './dto/report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetSuggestionsDto } from './dto/getSuggestionsDto.dto';
import { GetSuggestionsInterface } from './interfaces/get-suggestions.interface';
import { SearchAllUsersDto } from './dto/searchAllUsers.dto';
import { ShowBirthdayReportDto } from './dto/showBirthdayReport.dto';
import { ShowRelationshipReportDto } from './dto/showRelationshipReport.dto';
import {
  Friends,
  Global,
  SearchAllUsersSW,
  SearchUsersSW,
  Me,
  UserProfile,
  BirthdayReport,
  Relationship_Report,
  GetSettingsSW,
} from '../swagger.response';
import { GetMe } from './interfaces/get-me.interface';
import { GetUserProfileInterface } from './interfaces/get-user-profile.interface';
import { AddPaidReportDto } from './dto/addPaidReport.dto';
import { AddDeviceTokenDto } from './dto/addDeviceToken.dto';
import { SharedUser } from '../swagger.response';
import { GetSettingsInterface } from './interfaces/get-settings.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private userService: UserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateUsersAge() {
    console.log('Started update users age expression...');
    await this.userService.updateUsersAge();
    console.log('Finished users age updating 🚀');
  }

  @Get('sitemap')
  async sitemap(@Response() res) {
    res.set('Content-Type', 'text/xml');
    const xml = await this.userService.generateXml();
    res.send(xml);
  }

  @Post('addDeviceToken')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addDeviceToken(
    @GetUser() user: User,
    @Body() body: AddDeviceTokenDto,
  ): Promise<GlobalResponse> {
    return this.userService.addDeviceToken(user, body);
  }

  @Get('logout')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async logout(@GetUser() user: User) {
    return this.userService.logout(user);
  }

  @Delete('deleteMe')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async deleteUser(@GetUser() user: User) {
    return this.userService.deleteUser(user);
  }

  @Post('addSwipeLeftUser')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addSwipeLeftUser(
    @GetUser() user: User,
    @Body() body: AddUserLeftSwipeDto,
  ): Promise<GlobalResponse> {
    return this.userService.addSwipeLeftUser(user, body);
  }

  @Post('addUserLocation')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addUserLocation(
    @GetUser() user: User,
    @Body() body: AddUserLocationDto,
  ): Promise<GlobalResponse> {
    return this.userService.addUserLocation(user, body);
  }

  @Post('searchUsers/:offset')
  @ApiCreatedResponse({ type: [SearchUsersSW] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async searchUsersWithPaginate(
    @Param('offset') offset: number,
    @GetUser() user: User,
    @Body() body: SearchUsersDto,
  ): Promise<User[]> {
    return this.userService.searchUsersWithPaginate(user, body, offset);
  }

  @Post('searchAllUsers')
  @ApiCreatedResponse({ type: [SearchAllUsersSW] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async searchAllUsers(
    @GetUser() user: User,
    @Body() body: SearchAllUsersDto,
  ): Promise<User[]> {
    return this.userService.searchAllUsers(user, body);
  }

  @Post('getSuggestions')
  @ApiCreatedResponse({ type: [SearchAllUsersSW] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getSuggestions(
    @GetUser() user: User,
    @Body() body: GetSuggestionsDto,
  ): Promise<GetSuggestionsInterface[]> {
    return this.userService.getSuggestions(user, body);
  }

  @Post('sendFriendRequest')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async sendFriendRequest(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    return this.userService.sendFriendRequest(user, body);
  }

  @Delete('deleteFriend')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async deleteFriend(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    return this.userService.deleteFriend(user, body);
  }

  @Post('withdrawFriendRequest')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async withdrawFriendRequest(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    return this.userService.withdrawFriendRequest(user, body);
  }

  @Post('acceptFriendRequest')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async acceptFriendRequest(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    return this.userService.acceptFriendRequest(user, body);
  }

  @Post('rejectFriendRequest')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async rejectFriendRequest(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    return this.userService.rejectFriendRequest(user, body);
  }

  // My Friends pagination
  @Get('myFriends/:page')
  @ApiCreatedResponse({ type: Friends })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async myFriendsWithPagination(
    @GetUser() user: User,
    @Param('page') page: number,
  ): Promise<MyFriendsResponse[]> {
    return this.userService.myFriendsWithPagination(user, page);
  }

  // Pending pagination
  @Get('pendingRequests/:page')
  @ApiCreatedResponse({ type: Friends })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async pendingRequestsWithPagination(
    @GetUser() user: User,
    @Param('page') page: number,
  ): Promise<MyFriendsResponse[]> {
    return this.userService.pendingRequestsWithPagination(user, page);
  }

  // Requests Pagination
  @Get('myRequests/:page')
  @ApiCreatedResponse({ type: Friends })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async myRequestsWithPagination(
    @GetUser() user: User,
    @Param('page') page: number,
  ): Promise<MyFriendsResponse[]> {
    return this.userService.myRequestsWithPagination(user, page);
  }

  @Get('me')
  @ApiCreatedResponse({ type: Me })
  @UseGuards(AuthGuard('jwt'))
  async getMe(@GetUser() user: User): Promise<GetMe> {
    return this.userService.getMe(user);
  }

  @Get('profileImages')
  @ApiCreatedResponse()
  @UseGuards(AuthGuard('jwt'))
  async getProfileImages(@GetUser() user: User) {
    return this.userService.getProfileImages(user);
  }

  @Post('addProfileImage')
  @ApiCreatedResponse()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard('jwt'))
  async uploadProfileImage(@GetUser() user: User, @UploadedFile() image: any) {
    return this.userService.addProfileImage(user, image);
  }

  @Post('setAvatar')
  @ApiCreatedResponse()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async setAvatar(@GetUser() user: User, @Body('id') id: number) {
    return this.userService.setAvatar(user, id);
  }

  @Post('deleteProfileImage')
  @ApiCreatedResponse()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async deleteProfileImage(@GetUser() user: User, @Body('id') id: number) {
    return this.userService.deleteProfileImage(user, id);
  }

  @Get('settings')
  @ApiCreatedResponse({ type: GetSettingsSW })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getUpdateFields(@GetUser() user: User): Promise<GetSettingsInterface> {
    return this.userService.getSettings(user);
  }

  @Patch('updateProfile')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateUser(
    @GetUser() user: User,
    @Body() body: UpdateUserDto,
  ): Promise<GlobalResponse> {
    return this.userService.updateUser(user, body);
  }

  @Patch('updateUserLocation')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateUserLocation(
    @GetUser() user: User,
    @Body() body: UpdateLocationDto,
  ): Promise<GlobalResponse> {
    return this.userService.updateUserLocation(user, body);
  }

  @Post('getUserProfile')
  @ApiCreatedResponse({ type: UserProfile })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getUserProfile(
    @GetUser() user: User,
    @Body() body: SendFriendRequestDto,
  ): Promise<GetUserProfileInterface> {
    return this.userService.getUserProfile(user, body);
  }

  @Post('showBirthdayReportWithYear')
  @ApiCreatedResponse({ type: BirthdayReport })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async showBirthdayReportWithYear(
    @GetUser() user: User,
    @Body() body: ShowBirthdayReportDto,
  ) {
    return this.userService.showBirthdayReportWithYear(user, body);
  }

  @Post('showBirthdayReport')
  @ApiCreatedResponse({ type: BirthdayReport })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async showBirthdayReport(
    @GetUser() user: User,
    @Body() body: ShowBirthdayReportDto,
  ) {
    return this.userService.showBirthdayReport(user, body);
  }

  @Post('showRelationshipReport')
  @ApiCreatedResponse({ type: Relationship_Report })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async showRelationshipReport(
    @GetUser() user: User,
    @Body() body: ShowRelationshipReportDto,
  ) {
    return this.userService.showRelationshipReport(user, body);
  }

  @Post('report')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async reportUser(
    @GetUser() user: User,
    @Body() body: ReportedDto,
  ): Promise<GlobalResponse> {
    return this.userService.reportUser(user, body);
  }

  @Post('block')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  async blockUser(
    @GetUser() user: User,
    @Body() body: ReportedDto,
  ): Promise<GlobalResponse> {
    return this.userService.blockUser(user, body);
  }

  @Post('flag')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  async flagUser(
    @GetUser() user: User,
    @Body() body: ReportedDto,
  ): Promise<GlobalResponse> {
    return this.userService.flagUser(user, body);
  }

  @Post('addPaidReport')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async addPaidReport(@GetUser() user: User, @Body() body: AddPaidReportDto) {
    return this.userService.addPaidReport(user, body);
  }

  @Get('getBirthdayReport/:id')
  @ApiCreatedResponse({ type: BirthdayReport })
  @UsePipes(new ValidationPipe())
  async getBirthdayReport(@Param('id') id: number) {
    return this.userService.getBirthdayReport(id);
  }

  @Get('getRelationshipReport/:id')
  @ApiCreatedResponse({ type: Relationship_Report })
  @UsePipes(new ValidationPipe())
  async getRelationshipReport(@Param('id') id: number) {
    return this.userService.getRelationshipReport(id);
  }

  @Get('sharedUser/:id')
  @ApiCreatedResponse({ type: SharedUser })
  @UsePipes(new ValidationPipe())
  async getSharedUser(@Param('id') id: number) {
    return this.userService.getSharedUser(id);
  }

  @Get('getDayReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getDayReport(@Param('id') id: number) {
    return this.userService.getDayReport(id);
  }

  @Get('getMonthReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getMonthReport(@Param('id') id: number) {
    return this.userService.getMonthReport(id);
  }

  @Get('getPathReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getPathReport(@Param('id') id: number) {
    return this.userService.getPathReport(id);
  }

  @Get('getSeasonReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getSeasonReport(@Param('id') id: number) {
    return this.userService.getSeasonReport(id);
  }

  @Get('getWayReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getWayReport(@Param('id') id: number) {
    return this.userService.getWayReport(id);
  }

  @Get('getWeekReport/:id')
  @ApiCreatedResponse()
  @UsePipes(new ValidationPipe())
  async getWeekReport(@Param('id') id: number) {
    return this.userService.getWeekReport(id);
  }
}
