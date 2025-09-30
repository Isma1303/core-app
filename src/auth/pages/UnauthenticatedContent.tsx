import { Routes, Route, Navigate } from 'react-router-dom'
import { SingleCard } from '../../shared/layouts'
import { LoginForm, ResetPasswordForm, ChangePasswordForm, CreateAccountForm } from '../../auth'

export const UnauthenticatedContent = (): JSX.Element => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <SingleCard title="">
                        <LoginForm />
                    </SingleCard>
                }
            />
            <Route
                path="/create-account"
                element={
                    <SingleCard title="Sign Up">
                        <CreateAccountForm />
                    </SingleCard>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <SingleCard
                        title="Recuperar Contraseña"
                        description="Por favor introduce el correo Electrónico que usaste para crear tu cuenta, y te enviaremos un enlace para poder recuperar tu contraseña vía Correo Electrónico ."
                    >
                        <ResetPasswordForm />
                    </SingleCard>
                }
            />
            <Route
                path="/change-password/:recoveryCode"
                element={
                    <SingleCard title="Change Password">
                        <ChangePasswordForm />
                    </SingleCard>
                }
            />
            <Route path="*" element={<Navigate to={'/login'} />}></Route>
        </Routes>
    )
}
