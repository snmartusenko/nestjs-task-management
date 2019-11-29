import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  private status: any;
  private readonly allowedStatus = Object.values(TaskStatus);

  transform(value: any, metadata: ArgumentMetadata) {
    this.status = value;
    console.log('value', value);
    console.log('this.status', this.status);
    console.log('metadata', metadata);
    console.log('this.allowedStatus', this.allowedStatus);

    if (this.isValidStatus()) {
      return value;
    }

    throw new BadRequestException(`"${this.status}" is an invalid status`);
  }

  private isValidStatus() {
    return this.allowedStatus.includes(this.status);
  }
}
