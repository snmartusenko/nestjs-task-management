import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { consoleTestResultHandler } from 'tslint/lib/test';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {

  constructor(
    private taskRepository: TaskRepository,
  ) {
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const model = await this.taskRepository.findOne(id);
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  async deleteTaskById(id: number) {
    // 1
    // const model = await Task.findOne(id);
    // if (!model) {
    //   throw new NotFoundException();
    // }
    // return await model.remove(); // return deleted model

    // 2
    // return await Task.delete(id); // return affected rows
    // return await this.taskRepository.delete(id); // return affected rows

    // 3
    let result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    } else {
      return result;
    }

  }

  async updateTaskPropertyByNameAndId(id: number, property: string, value: string): Promise<Task> {
    let model = await this.getTaskById(id);
    if (model) {
      model[property] = value;
      await model.save();
      return model;
    }

    return null;
  }
}
