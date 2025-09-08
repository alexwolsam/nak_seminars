export function handleNotification(
  type:
    | "USER_ADDED_TO_QUEUE"
    | "USER_DELETE_FROM_QUEUE"
    | "ENROLLMENT_CONFIRMED"
    | "ENROLLMENT_CANCELLED"
    | "SEMINAR_JOINED_FROM_QUEUE",
  seminar: {
    email: string;
    seminarId: number;
    seminarName: string;
    userId: string;
    userName: string;
  }
) {
  switch (type) {
    case "USER_ADDED_TO_QUEUE":
      return `Du bist der Warteliste für das Seminar "${seminar.seminarName}" beigetreten.`;
      break;
    case "USER_DELETE_FROM_QUEUE":
      return `Du wurdest von der Warteliste für das Seminar "${seminar.seminarName}" entfernt.`;
      break;
    case "ENROLLMENT_CONFIRMED":
      return `Deine Anmeldung für das Seminar "${seminar.seminarName}" war erfolgreich.`;
      break;
    case "ENROLLMENT_CANCELLED":
      return `Deine Anmeldung für das Seminar "${seminar.seminarName}" wurde storniert.`;
      break;
    case "SEMINAR_JOINED_FROM_QUEUE":
      return `Du hast dem Seminar "${seminar.seminarName}" von der Warteliste beigetreten.`;
      break;
  }
}
