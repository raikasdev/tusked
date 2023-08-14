export function formatDate(date: Date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = months[formattedDate.getMonth()];
  const day = formattedDate.getDate();
  const hours = formattedDate.getHours().toString().padStart(2, '0');
  const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

  return `${month} ${day}, ${year}, ${hours}:${minutes}`;
}
