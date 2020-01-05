import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param, ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    const model = this.tasksService.createTask(createTaskDto, user);
    return model;
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.tasksService.deleteTaskById(id, user);
  }

  // @Patch('/:id/:property')
  // updateTaskStatusById(@Param('id') id: string,
  //                      @Param('property') property: string,
  //                      @Body('status') status: TaskStatus): Task {
  //   console.log('id', id);
  //   console.log('property', property);
  //
  //   return this.tasksService.updateTaskPropertyByNameAndId(id, property, status);
  // }

  @Patch('/:id/status')
  updateTaskStatusById(@Param('id', ParseIntPipe) id: number,
                       @Body('status', TaskStatusValidationPipe) status: TaskStatus,
                       @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskPropertyByNameAndId(id, 'status', status, user)
      ;
  }
}
