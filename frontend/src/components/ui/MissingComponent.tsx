interface MissingComponentProps {
  name: string;
}

export default function MissingComponent({ name }: MissingComponentProps) {
  return (
    <div className="p-2 border border-dashed border-orange-400 text-orange-600 text-xs rounded">
      [{name}]
    </div>
  );
}
