type DateDisplayProps = {
  date: string; // expects ISO string from Appwrite, like post.$createdAt
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "s"],       // seconds
    [60, "m"],       // minutes
    [24, "h"],       // hours
    [30, "d"],       // days (approx)
    [12, "mo"],      // months
    [Number.MAX_SAFE_INTEGER, "y"], // years
  ];

  let counter = seconds;
  for (let i = 0; i < intervals.length; i++) {
    const [limit, suffix] = intervals[i];
    if (counter < limit) {
      return Math.floor(counter) + suffix;
    }
    counter /= limit;
  }

  return Math.floor(counter) + "y";
}

function DisplayDate({ date }: DateDisplayProps) {
  return (
    <span className="text-gray-500 text-[16px]">{timeAgo(date)}</span>
  );
}

export default DisplayDate;
