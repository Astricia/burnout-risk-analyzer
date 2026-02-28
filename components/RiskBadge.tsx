interface Props {
  risk: string;
}

export default function RiskBadge({ risk }: Props) {
  const color =
    risk === "Low"
      ? "bg-green-500"
      : risk === "Moderate"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <span className={`px-3 py-1 rounded-full text-white ${color}`}>
      {risk} Risk
    </span>
  );
}