import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    console.log('filterDto', filterDto);
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    const model = this.tasksService.createTask(createTaskDto);
    return model;
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Task {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/:property')
  updateTaskStatusById(@Param('id') id: string,
                       @Param('property') property: string,
                       @Body('status') status: TaskStatus): Task {
    console.log('id', id);
    console.log('property', property);

    return this.tasksService.updateTaskPropertyByNameAndId(id, property, status);
  }
}
