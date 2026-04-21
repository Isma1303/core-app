import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { createAccount } from '../../services'
import './CreateAccountForm.scss'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const CreateAccountForm = (): JSX.Element => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (password !== confirmPassword) {
                toast.error('Passwords do not match')
                return
            }
            setLoading(true)

            const result = await createAccount(email, password)
            setLoading(false)

            if (result.isOk) {
                navigate('/login')
            } else {
                toast.error(result.message)
            }
        },
        [navigate, email, password, confirmPassword],
    )

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all" required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all" required />
            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
                required
            />
            <div className="text-sm text-muted-foreground">
                By creating an account, you agree to the <Link to="#" className="font-medium hover:text-foreground transition-colors">Terms of Service</Link> and <Link to="#" className="font-medium hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
            <Button type="submit" disabled={loading} className="h-10 w-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all">
                {loading ? 'Cargando...' : 'Create a new account'}
            </Button>
            <div className="text-center text-sm mt-4">
                Have an account? <Link to={'/login'} className="text-muted-foreground hover:text-foreground transition-colors font-medium">Sign In</Link>
            </div>
        </form>
    )
}
