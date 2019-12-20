import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
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

    const models = await query.getMany();
    return models;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    let model = new Task;
    model.user = user;
    model.title = title;
    model.description = description;
    model.status = TaskStatus.OPEN;
    await model.save();

    // delete user field from response
    delete model.user;

    return model;
  }

}
