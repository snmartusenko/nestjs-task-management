import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { consoleTestResultHandler } from 'tslint/lib/test';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {

  constructor(
    private taskRepository: TaskRepository,
  ) {
  }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   let { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //
  //   if (status) {
  //     tasks = tasks.filter(task => task.status === status);
  //   }
  //
  //   if (search) {
  //     tasks = tasks.filter(task =>
  //       task.title.includes(search) ||
  //       task.description.includes(search));
  //   }
  //
  //   return tasks;
  // }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //
  //   this.tasks.push(task);
  //   return task;
  // }

  async getTaskById(id: number): Promise<Task> {
    const model = await this.taskRepository.findOne(id);
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  // getTaskById(id: string): Task {
  //   const model = this.tasks.find(task => task.id === id);
  //   if (!model) {
  //     throw new NotFoundException();
  //   }
  //   return model;
  // }
  //
  // deleteTaskById(id: string): Task {
  //   console.log('id', id);
  //
  //   let i = this.tasks.findIndex(task => task.id === id);
  //   console.log('index', i);
  //
  //   if (i !== -1) {
  //     let deleted = this.tasks[i];
  //     this.tasks.splice(i, 1);
  //     return deleted;
  //   }
  //
  //   throw new NotFoundException();
  // }
  //
  // updateTaskPropertyByNameAndId(id: string, property: string, value: string): Task {
  //   let model = this.getTaskById(id);
  //   if (model) {
  //     model[property] = value;
  //     return model;
  //   }
  //
  //   return null;
  // }
}
