
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface RegisterPasswordFieldsProps {
  password: string;
  confirmPassword: string;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
}

export default function RegisterPasswordFields({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
}: RegisterPasswordFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
