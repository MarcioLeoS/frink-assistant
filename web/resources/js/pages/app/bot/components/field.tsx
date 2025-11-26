import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
};

export default function Field({ label, value, onChange, textarea }: FieldProps) {
  const id = useId(); // genera un id único estable

  return (
    <div className="grid grid-cols-4 items-center gap-4" key={id}>
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>

      {textarea ? (
        <textarea
          id={id}
          rows={4}
          className="col-span-3 resize-y rounded-md border border-stone-700 bg-transparent p-2 text-sm outline-none"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          className="col-span-3"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
