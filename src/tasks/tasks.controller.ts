import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const model = this.tasksService.createTask(createTaskDto);
    return model;
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTaskById(id);
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
                       @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
    return this.tasksService.updateTaskPropertyByNameAndId(id, 'status', status);
  }
}
