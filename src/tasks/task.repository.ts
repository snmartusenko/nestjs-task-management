import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (user) {
      query.andWhere('task.userId = :userId', { userId: user.id });
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }
    // console.log(query);

    try {
      const models = await query.getMany();
      return models;
    } catch (e) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filter: ${JSON.stringify(filterDto)}`, e.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    let model = new Task;
    model.user = user;
    model.title = title;
    model.description = description;
    model.status = TaskStatus.OPEN;

    try {
      await model.save();
    } catch (e) {
      this.logger.error(`Failed to create task for user "${user.username}". Data: ${JSON.stringify(createTaskDto)}`, e.stack);
      throw new InternalServerErrorException();
    }

    // delete user field from response
    delete model.user;

    return model;
  }

}
