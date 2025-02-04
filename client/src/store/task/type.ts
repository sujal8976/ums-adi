type EventType = {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  month_year: string;
  assignedBy: string;
  category: string;
  priority: string;
  status: string;
  participants: string[];
};

interface TaskMetaData {
  categories: string[];
  priorityList: string[];
  statusList: string[];
}

interface TaskState {
  TaskInitialData: TaskMetaData;
  Events: EventType[];
}

export type { EventType, TaskMetaData, TaskState };
