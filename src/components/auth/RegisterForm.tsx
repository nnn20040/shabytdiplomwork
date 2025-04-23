
import RegisterNameFields from "./RegisterNameFields";
import RegisterEmailField from "./RegisterEmailField";
import RegisterPasswordFields from "./RegisterPasswordFields";
import RegisterRoleRadioGroup from "./RegisterRoleRadioGroup";
import { Button } from "@/components/ui/button";
import { useRegisterForm } from "./useRegisterForm";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const {
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
    handleSubmit
  } = useRegisterForm();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Создайте аккаунт</h2>
        <p className="text-muted-foreground">
          Присоединяйтесь к тысячам студентов, успешно сдавших ЕНТ
        </p>
        <div className="mt-2 p-2 bg-muted text-xs rounded">
          <p>В текущей версии регистрация работает в демо-режиме</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {errorMsg}
          </div>
        )}
        <RegisterNameFields
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
        <RegisterEmailField email={email} setEmail={setEmail} />
        <RegisterPasswordFields
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
        />
        <RegisterRoleRadioGroup role={role} setRole={setRole} />
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
