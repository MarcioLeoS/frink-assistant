export default function SidebarQuickLink({ label }: { label: string }) {
    return (
      <button className="w-full text-left hover:text-emerald-400 transition-colors">
        {label}
      </button>
    );
  }
  