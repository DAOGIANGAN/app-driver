// filepath: e:\AppDriver\app-driver\src\modules\fixed-trip-request\fixed-trip-request.controller.ts
import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { FixedTripRequestService } from './fixed-trip-request.service';
import { U } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq';

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
      requestedDays: string[];
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
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { approvedDays: string[] },
  ) {
    return this.requestService.approveRequest(id, req.user.id, body.approvedDays);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAccessAuthGuard)
  rejectRequest(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.requestService.rejectRequest(id, req.user.id);
  }
}