/** Task JSON from Habitica server. */
export interface Task {
    id: string;
    text: string;
    type: string;
    value: number;
    priority: number;
    history: History[];
    createdAt: string;
    nextDue: string[],
    // Todo only
    notes?: string;
    dateCompleted?: string;
}

export interface History {
    date: number;
    value: number;
    // Habits only
    scoredUp?: number;
    scoredDown?: number;
}