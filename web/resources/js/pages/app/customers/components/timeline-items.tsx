
export default function TimelineItem({ color, date, text }: { color: string, date: string, text: string }) {
    return (
        <li>
            <div className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-${color}`} />
            <time className="text-sm font-semibold">{date}</time>
            <p className="text-sm text-gray-300">{text}</p>
        </li>
    );
}