import { useState } from 'react'
import { LoginPage } from '@/pages/login-page'
import { OnboardingPage } from '@/pages/onboarding-page'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return isLoggedIn
    ? <OnboardingPage onLogout={() => setIsLoggedIn(false)} />
    : <LoginPage onLogin={() => setIsLoggedIn(true)} />
}
