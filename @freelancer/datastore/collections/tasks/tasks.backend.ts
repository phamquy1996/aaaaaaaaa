import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { TaskSourceTypeApi } from 'api-typings/tasklist/tasklist';
import { Task } from './tasks.model';
import { TasksCollection } from './tasks.types';

export function tasksBackend(): Backend<TasksCollection> {
  return {
    defaultOrder: {
      field: 'createTime',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'tasks/tasks.php',
      isGaf: true,
      params: {
        tasks: ids,
        owners: getQueryParamValue(query, 'ownerId'),
        sources: getSourceIdsQueryParamValue(query),
        sourceType: getSourceTypeQueryParamValue(query),
        statuses: getQueryParamValue(query, 'status'),
      },
    }),
    push: (authUid, task) => ({
      endpoint: 'tasks/tasks.php',
      isGaf: true,
      asFormData: false,
      payload: {
        source: task.source.id,
        sourceType: task.source.type,
        status: task.status,
        list: task.list,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      },
    }),
    set: undefined,
    update: (authUid, partial, original) => {
      if (original.id === undefined) {
        throw new Error('Task ID must be provided to update a task.');
      }

      return {
        endpoint: 'tasks/tasks.php',
        isGaf: true,
        asFormData: false,
        method: 'PUT',
        payload: {
          id: original.id,
          status: partial.status,
          list: partial.list,
          title: partial.title,
          description: partial.description,
          dueDate: partial.dueDate,
        },
      };
    },
    remove: undefined,
  };
}
function getSourceTypeQueryParamValue(
  query: RawQuery<Task> | undefined,
): TaskSourceTypeApi | undefined {
  return getQueryParamValue(query, 'source', param =>
    param.condition === '==' ? param.value.type : undefined,
  )[0];
}

function getSourceIdsQueryParamValue(
  query: RawQuery<Task> | undefined,
): ReadonlyArray<number> {
  return getQueryParamValue(query, 'source', param =>
    param.condition === '==' ? param.value.id : undefined,
  ).filter(isDefined);
}
