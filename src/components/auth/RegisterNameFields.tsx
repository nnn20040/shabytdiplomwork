
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterNameFieldsProps {
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
}

export default function RegisterNameFields({
  firstName,
  lastName,
  setFirstName,
  setLastName,
}: RegisterNameFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Имя</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Фамилия</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="h-12"
        />
      </div>
    </div>
  );
}
