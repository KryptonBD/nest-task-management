import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user });
    if (!result.affected) {
      throw new NotFoundException(`Task with ${id} Not Found`);
    }
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: string, status: TaskStatus, user): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
