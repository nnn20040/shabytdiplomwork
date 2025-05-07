
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg("Пожалуйста, заполните все поля");
      toast.error("Пожалуйста, заполните все поля");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMsg("Пароли не совпадают");
      toast.error("Пароли не совпадают");
      return;
    }

    // For demo purposes, skip real API calls and proceed directly
    const name = `${firstName} ${lastName}`;
    
    // Create a demo user
    const demoUser = {
      id: `demo-${Date.now()}`,
      name: name,
      email,
      role,
      firstName,
      lastName,
      token: `demo_token_${Date.now()}`
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    // Show success message
    toast.success("Регистрация успешна! Добро пожаловать в StudyHub!");
    
    // Navigate based on role
    if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
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
