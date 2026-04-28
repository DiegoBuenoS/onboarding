import { useState, useId } from 'react'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  ShieldCheck, BadgeCheck, KeyRound, Info, AlertCircle,
  CheckCircle2, FileText, UserRound, Wallet, Pen,
  Sparkles, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const DEMO_EMAIL = 'demo'
const DEMO_PASSWORD = 'demo'

// ─────────────────────────────────────────────
// FloatingInput
// ─────────────────────────────────────────────

interface FloatingInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  icon: React.ReactNode
  rightElement?: React.ReactNode
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function FloatingInput({
  label, icon, rightElement, error, id, onChange, value, ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const [internalFilled, setInternalFilled] = useState(false)
  const autoId = useId()
  const inputId = id ?? autoId
  const filled = value !== undefined ? String(value).length > 0 : internalFilled
  const isUp = focused || filled

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalFilled(e.target.value.length > 0)
    onChange?.(e)
  }

  return (
    <div>
      <div className={cn(
        'relative h-[60px] rounded-xl border transition-all duration-200',
        focused
          ? 'border-emerald-500 bg-slate-700 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
          : error
            ? 'border-red-400/70 bg-slate-700/90'
            : 'border-slate-600/80 bg-slate-700/70 hover:border-slate-500',
      )}>
        <div className={cn(
          'absolute left-0 top-0 flex h-full w-12 items-center justify-center transition-colors duration-200',
          focused ? 'text-emerald-300' : 'text-slate-300',
        )}>
          {icon}
        </div>
        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-12 select-none transition-all duration-200',
            isUp
              ? cn('top-[10px] text-[10px] font-semibold uppercase tracking-widest',
                  focused ? 'text-emerald-300' : 'text-slate-300')
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-300',
          )}
        >
          {label}
        </label>
        <input
          id={inputId}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'absolute bottom-[10px] left-12 bg-transparent text-sm font-medium text-white outline-none placeholder-transparent',
            rightElement ? 'right-12' : 'right-4',
          )}
          placeholder={label}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// OnboardingCard — step preview on right panel
// ─────────────────────────────────────────────

interface OnboardingCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  delay: string
  color: string
}

function OnboardingCard({ icon: Icon, title, desc, delay, color }: OnboardingCardProps) {
  return (
    <div
      className="animate-in fade-in-0 slide-in-from-right-4 flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur-sm"
      style={{ animationDelay: delay, animationFillMode: 'backwards', animationDuration: '600ms' }}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-500">{desc}</p>
      </div>
      <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-300" />
    </div>
  )
}

const ONBOARDING_STEPS: OnboardingCardProps[] = [
  { icon: UserRound, title: 'Dados Pessoais',  desc: 'Informações cadastrais básicas',      delay: '200ms', color: 'bg-blue-100 text-blue-600' },
  { icon: FileText,  title: 'Documentos',      desc: 'RG, CPF, CTPS e comprovantes',        delay: '320ms', color: 'bg-sky-100 text-sky-600' },
  { icon: Wallet,    title: 'Benefícios',       desc: 'Plano de saúde, vale-refeição',        delay: '440ms', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Pen,       title: 'Assinatura Digital', desc: 'Contrato e termos de aceite',        delay: '560ms', color: 'bg-amber-100 text-amber-600' },
]

// ─────────────────────────────────────────────
// LoginPage
// ─────────────────────────────────────────────

export function LoginPage({ onLogin }: { onLogin?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('E-mail ou senha incorretos. Confira as credenciais de acesso.')
      return
    }
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin?.() }, 1400)
  }

  const trustItems = [
    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'SSL Seguro' },
    { icon: <BadgeCheck className="h-3.5 w-3.5" />,  label: 'LGPD' },
    { icon: <KeyRound className="h-3.5 w-3.5" />,    label: 'Dados Protegidos' },
  ]

  return (
    <div className="flex min-h-screen">

      {/* ═══ LEFT — Form Panel ═══ */}
      <div className="flex w-full flex-col items-center justify-center bg-slate-800 px-8 py-12 lg:w-[44%] xl:w-[42%]">
        <div className="w-full max-w-[400px] space-y-7">

          {/* Logo */}
          <div
            className="animate-in fade-in-0 flex items-center gap-3"
            style={{ animationDuration: '400ms' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 ring-1 ring-blue-300/30">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-white">Portal de Admissão</p>
              <p className="text-[11px] font-medium text-slate-300 tracking-wide">Admissão Digital</p>
            </div>
          </div>

          {/* Header */}
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-3 space-y-2"
            style={{ animationDelay: '80ms', animationFillMode: 'backwards', animationDuration: '500ms' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Primeiro acesso</span>
            </div>
            <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight text-white">
              Sua jornada<br />
              <span className="text-slate-300">começa aqui</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              Acesse com as credenciais enviadas pelo RH para iniciar seu processo de admissão.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter' && !loading) e.currentTarget.requestSubmit() }}
            className="animate-in fade-in-0 slide-in-from-bottom-3 space-y-3"
            style={{ animationDelay: '160ms', animationFillMode: 'backwards', animationDuration: '500ms' }}
          >
            <FloatingInput
              label="Usuário"
              type="text"
              icon={<Mail className="h-[18px] w-[18px]" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
            <FloatingInput
              label="Senha de acesso"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="h-[18px] w-[18px]" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-slate-300 transition-colors hover:text-white"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm font-medium text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="border-slate-500 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                />
                <label htmlFor="remember" className="cursor-pointer select-none text-sm text-slate-300">
                  Lembrar de mim
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-sky-300 transition-colors hover:text-white">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-1 h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando acesso...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Acessar portal
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div
            className="animate-in fade-in-0 rounded-xl border border-dashed border-slate-500 bg-slate-700/70 p-3.5"
            style={{ animationDelay: '260ms', animationFillMode: 'backwards', animationDuration: '500ms' }}
          >
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Info className="h-3.5 w-3.5 text-emerald-300" />
              Credenciais de demonstração
            </p>
            <div className="space-y-0.5">
              <p className="text-xs text-slate-300">
                Usuário: <code className="font-mono font-bold text-white">{DEMO_EMAIL}</code>
              </p>
              <p className="text-xs text-slate-300">
                Senha: <code className="font-mono font-bold text-white">{DEMO_PASSWORD}</code>
              </p>
            </div>
          </div>

          {/* Trust bar */}
          <div
            className="animate-in fade-in-0 flex items-center justify-center gap-6 border-t border-slate-700 pt-5"
            style={{ animationDelay: '340ms', animationFillMode: 'backwards', animationDuration: '500ms' }}
          >
            {trustItems.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-300">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ═══ RIGHT — Illustration Panel ═══ */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[56%] xl:w-[58%] flex-col items-center justify-center p-14">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50" />

        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-sky-200/45 blur-[110px]" />
        <div className="absolute -bottom-40 -left-40 h-[440px] w-[440px] rounded-full bg-emerald-200/45 blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/50 blur-[80px]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[480px] space-y-8">

          {/* Status badge */}
          <div
            className="animate-in fade-in-0 slide-in-from-top-4 inline-flex items-center gap-2.5 rounded-full border border-blue-200/80 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm"
            style={{ animationDuration: '500ms' }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span className="text-xs font-semibold text-blue-800">Smart Onboard</span>
          </div>

          {/* Headline */}
          <div
            className="animate-in fade-in-0 slide-in-from-bottom-4 space-y-3"
            style={{ animationDelay: '100ms', animationFillMode: 'backwards', animationDuration: '600ms' }}
          >
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 xl:text-[2.8rem]">
              Seja bem-vindo<br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                à nossa equipe!
              </span>
            </h1>
            <p className="max-w-[380px] text-[15px] leading-relaxed text-slate-500">
              Estamos muito animados em tê-lo conosco. Complete seu cadastro de admissão de forma simples — são apenas alguns passos.
            </p>
          </div>

          {/* Step cards */}
          <div
            className="animate-in fade-in-0 space-y-2.5"
            style={{ animationDelay: '180ms', animationFillMode: 'backwards', animationDuration: '600ms' }}
          >
            <p className="mb-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              O que você irá preencher
            </p>
            {ONBOARDING_STEPS.map(step => (
              <OnboardingCard key={step.title} {...step} />
            ))}
          </div>

          {/* Security note */}
          <div
            className="animate-in fade-in-0 flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm shadow-sm"
            style={{ animationDelay: '700ms', animationFillMode: 'backwards', animationDuration: '600ms' }}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800">Seus dados estão protegidos</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                Todas as informações são criptografadas e armazenadas em conformidade com a LGPD.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
