import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    let model = new Task;
    model.title = title;
    model.description = description;
    model.status = TaskStatus.OPEN;
    await model.save();

    return model;
  }

}
