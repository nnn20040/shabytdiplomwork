
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterEmailFieldProps {
  email: string;
  setEmail: (v: string) => void;
}

export default function RegisterEmailField({ email, setEmail }: RegisterEmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-12"
      />
    </div>
  );
}
