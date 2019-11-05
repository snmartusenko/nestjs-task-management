import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { consoleTestResultHandler } from 'tslint/lib/test';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    let { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search));
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  deleteTaskById(id: string): Task {
    console.log('id', id);

    let i = this.tasks.findIndex(task => task.id === id);
    console.log('index', i);

    if (i !== -1) {
      let deleted = this.tasks[i];
      this.tasks.splice(i, 1);
      return deleted;
    }

    return null;
  }

  updateTaskPropertyByNameAndId(id: string, property: string, value: string): Task {
    let model = this.getTaskById(id);
    if (model) {
      model[property] = value;
      return model;
    }

    return null;
  }
}