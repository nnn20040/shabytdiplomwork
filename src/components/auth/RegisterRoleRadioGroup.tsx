
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RegisterRoleRadioGroupProps {
  role: string;
  setRole: (role: string) => void;
}

export default function RegisterRoleRadioGroup({ role, setRole }: RegisterRoleRadioGroupProps) {
  return (
    <div className="space-y-2">
      <Label>Выберите роль</Label>
      <RadioGroup
        value={role}
        onValueChange={setRole}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="cursor-pointer">Ученик</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher" className="cursor-pointer">Учитель</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
