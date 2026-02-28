interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
      {children}
    </div>
  );
}