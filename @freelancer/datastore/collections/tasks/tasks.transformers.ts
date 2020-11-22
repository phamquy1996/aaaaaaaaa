import { TaskApi } from 'api-typings/tasklist/tasklist';
import { Task } from './tasks.model';

export function transformTasks(task: TaskApi): Task {
  return {
    id: task.id,
    ownerId: task.owner_id,
    createTime: task.create_time * 1000,
    source: task.source,
    status: task.status,
    list: task.task_list,
    assigneeId: task.assignee_id,
    dueDate: task.due_date ? task.due_date * 1000 : undefined,
    title: task.title,
    description: task.description,
  };
}
