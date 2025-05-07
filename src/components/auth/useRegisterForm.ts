
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UseRegisterFormReturn {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isLoading: boolean;
  errorMsg: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setRole: (role: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Removed validation checks
    
    setIsLoading(true);
    
    try {
      // Use the auth context register method
      await register(firstName, lastName, email, password, role);
      
      // Show success message
      toast.success("Регистрация успешна! Добро пожаловать в StudyHub!");
      
      // Navigate based on role
      if (role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ошибка при регистрации";
      
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    isLoading,
    errorMsg,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setRole,
    handleSubmit,
  };
}
