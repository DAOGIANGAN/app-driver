
import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { FixedTripRequestService } from './fixed-trip-request.service';

@UseGuards(JwtAccessAuthGuard)
@Controller('fixed-trip-requests')
export class FixedTripRequestController {
  constructor(private readonly requestService: FixedTripRequestService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  createRequest(
    @Request() req,
    @Body()
    body: {
      requesteeId: number;
      requestedDay: string;
      startTime: string;
      endTime: string;
      startLocation: string;
      destination: string;
    },
  ) {
    const { requesteeId, ...data } = body;
    return this.requestService.createRequest(req.user.id, requesteeId, data);
  }

  @Get('received')
  @UseGuards(JwtAccessAuthGuard)
  getReceivedRequests(@Request() req) {
    return this.requestService.getReceivedRequests(req.user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAccessAuthGuard)
  approveRequest(
    @Request() req,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.requestService.approveRequest(id, req.user.id);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAccessAuthGuard)
  rejectRequest(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.requestService.rejectRequest(id, req.user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAccessAuthGuard)
  cancelRequest(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.requestService.cancelRequest(id, req.user.id);
  }

  @Get('my-approved-requests')
  @UseGuards(JwtAccessAuthGuard)
  getFixedTrip(@Request() req) {
    return this.requestService.getFixedTrip(req.user.id);
  }

}