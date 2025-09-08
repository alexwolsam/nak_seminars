export type Event = {
  type: EventType;
  payload: {
    userId: string;
    userName: string;
    email: string;
    seminarId: Number;
    seminarName: string;
  };
};

export type EventType =
  | "NEW_SEMINAR_ADDED"
  | "ENROLLMENT_CONFIRMED"
  | "ENROLLMENT_CANCELLED"
  | "USER_ADDED_TO_QUEUE"
  | "USER_REMOVED_FROM_QUEUE"
  | "SEMINAR_JOINED_FROM_QUEUE";
