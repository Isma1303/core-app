import { User } from '../../interfaces'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
    user: User
}

interface EventsProps {
    rowUpdated: (rowAffected: boolean) => void
    closePopup: (close: boolean) => void
}

export const UserChangePasswordForm = (props: Props & EventsProps): JSX.Element => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden')
            return
        }
        // Here we would call the service
        props.rowUpdated(true)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" required />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Confirmar Contraseña</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-10" required />
            </div>
            <Button type="submit" className="h-10">
                Guardar
            </Button>
        </form>
    )
}
