interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const getStrength = (password: string): { level: number; label: string; color: string } => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: "Fraca", color: "bg-destructive" };
    if (score <= 2) return { level: 2, label: "Razoável", color: "bg-orange-500" };
    if (score <= 3) return { level: 3, label: "Boa", color: "bg-yellow-500" };
    if (score <= 4) return { level: 4, label: "Forte", color: "bg-green-500" };
    return { level: 5, label: "Muito forte", color: "bg-emerald-500" };
  };

  const strength = getStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              level <= strength.level ? strength.color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Força da senha: <span className="font-medium">{strength.label}</span>
      </p>
    </div>
  );
};
