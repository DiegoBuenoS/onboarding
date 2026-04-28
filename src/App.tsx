import { useState } from 'react'
import { LoginPage } from '@/pages/login-page'
import { WelcomePage } from '@/pages/welcome-page'
import { OnboardingPage } from '@/pages/onboarding-page'

type View = 'login' | 'welcome' | 'onboarding'

// Index 0 in STEPS is the document upload step; index 1 is Dados Pessoais
const UPLOADS_STEP = 0
const FORM_START   = 1

export default function App() {
  const [view, setView]         = useState<View>('login')
  const [startStep, setStartStep] = useState(FORM_START)

  if (view === 'login') {
    return <LoginPage onLogin={() => setView('welcome')} />
  }

  if (view === 'welcome') {
    return (
      <WelcomePage
        onLogout={() => setView('login')}
        onDocuments={() => { setStartStep(UPLOADS_STEP); setView('onboarding') }}
        onStart={() => { setStartStep(FORM_START); setView('onboarding') }}
      />
    )
  }

  return (
    <OnboardingPage
      initialStep={startStep}
      onLogout={() => setView('login')}
    />
  )
}
