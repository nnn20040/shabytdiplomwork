
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
    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`;
      console.log("Sending registration request with data:", {
        name,
        email,
        password: "[HIDDEN]",
        role,
        firstName,
        lastName
      });
      const response = await authApi.register({
        name,
        email,
        password,
        role,
        firstName,
        lastName,
      });
      console.log("Registration API response:", response);
      if (response && response.success) {
        toast.success("Регистрация успешна! Добро пожаловать в StudyHub!");
        if (role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      } else {
        setErrorMsg(response?.message || "Ошибка при регистрации");
        toast.error(response?.message || "Ошибка при регистрации");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при регистрации";
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
