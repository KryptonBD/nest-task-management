import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUser = {
  username: 'John',
  id: 'someId',
  password: 'TEST',
  task: [],
};

const mockTask = {
  id: 'test',
  title: 'Title',
  description: 'Test Description',
  status: TaskStatus.OPEN,
  user: mockUser,
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  it('should calls TaskRepository.getTask and return result', async () => {
    jest.spyOn(taskRepository, 'getTasks').mockResolvedValue([mockTask]);
    const res = await tasksService.getTasks(null, mockUser);

    expect(taskRepository.getTasks).toHaveBeenCalled();
    expect(res).toEqual([mockTask]);
  });

  it('should call TaskRepository.findOneBy and returns result', async () => {
    jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(mockTask);

    const res = await tasksService.getTaskById(mockTask.id, mockUser);
    expect(res).toEqual(mockTask);
  });

  it('should handle error on TaskRepository.findOneBy', async () => {
    jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(null);

    const res = tasksService.getTaskById(mockTask.id, mockUser);
    expect(res).rejects.toThrow(NotFoundException);
  });
});
