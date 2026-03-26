import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { U } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Post()
  async create(@Request() req, @Body() createTripDto: CreateTripDto) {
    return this.tripService.createTrip(req.user.id, createTripDto);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post(':tripId/join')
  async joinTrip(@Request() req, @Param('tripId') tripId: number) {
    return this.tripService.joinTrip(req.user.id, tripId);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Delete(':tripId')
  async cancelTrip(@Request() req, @Param('tripId') tripId: number) {
    return this.tripService.cancelTrip(req.user.id, tripId);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post(':tripId/out')
  async outTrip(@Request() req, @Param('tripId') tripId: number) {
    return this.tripService.outTrip(req.user.id, tripId);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get()
  async getAllTrips(@Request() req) {
    return await this.tripService.getAllTrips(req.user.id);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post('findTrip')
  async findTrip(@Body() req, @Request() request) {
    return await this.tripService.findTripsByLocationAndTime(
      req.startLocation,
      req.destination,
      req.date,
      request.user.id
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get(':id')
  async currentTrip(@Param('id') id: number) {
    return await this.tripService.getCurrentTrip(id);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post(':tripId/approve/:customerId')
  async approveCustomer(
    @Request() req,
    @Param('tripId') tripId: number,
    @Param('customerId') customerId: number,
  ) {
    return await this.tripService.approveCustomer(req.user.id, tripId, customerId);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('detail/:tripId')
  async getTripById(@Param('tripId') tripId: number) {
    return await this.tripService.getTripById(tripId);
  }  
  
  @UseGuards(JwtAccessAuthGuard)
  @Patch(':tripId/complete')
  async completeTrip(@Request() req, @Param('tripId') tripId: number) {
    return this.tripService.setTripCompleted(req.user.id, tripId);
  }
}
