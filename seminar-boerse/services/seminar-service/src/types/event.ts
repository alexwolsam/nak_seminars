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
  | "SEMINAR_JOINED_FROM_QUEUE"
  | "NEW_SEMINAR_ADDED"
  | "ENROLLMENT_CONFIRMED"
  | "ENROLLMENT_CANCELLED";
