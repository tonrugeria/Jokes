import { DateTime } from "luxon";

export function timeAgo(jokeDate) {
    const formattedJokeDate = DateTime.fromJSDate(jokeDate)
    const dateNow = DateTime.now()
    const diff = dateNow.diff(formattedJokeDate, ['days', 'hours', 'minutes', 'seconds']).toObject()
      
    if (diff.days !== undefined && diff.days > 0) {
        return `${diff.days} day${diff.days === 1 ? '' : 's'} ago`;
    } else if (diff.hours !== undefined && diff.hours > 0) {
        return `${diff.hours} hour${diff.hours === 1 ? '' : 's'} ago`;
    } else if (diff.minutes !== undefined && diff.minutes > 0) {
        return `${diff.minutes} minute${diff.minutes === 1 ? '' : 's'} ago`;
    } else if (diff.seconds !== undefined && diff.seconds > 0) {
        return 'Just now'
    } else {
        return 'Just now';
    }
  }  