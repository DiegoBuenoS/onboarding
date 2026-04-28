import { Upload, ClipboardList, Briefcase, ArrowRight } from 'lucide-react'

interface WelcomePageProps {
  onDocuments: () => void
  onStart: () => void
  onLogout: () => void
}

export function WelcomePage({ onDocuments, onStart, onLogout }: WelcomePageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">

      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold tracking-tight text-slate-900">Smart Onboard</p>
          <p className="text-sm text-slate-500">Admissão Digital</p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8 max-w-md text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bem-vindo(a) ao seu processo de admissão
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
          Escolha como deseja começar. Você pode enviar documentos e preencher o
          formulário em qualquer ordem — e retomar quando quiser.
        </p>
      </div>

      {/* Option cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Card 1 — Documentos */}
        <button
          type="button"
          onClick={onDocuments}
          className="group flex flex-col items-start gap-5 rounded-3xl border-2 border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-200 hover:border-blue-400 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-100">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-slate-900">Anexar Documentos</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Envie os documentos necessários para admissão (RG, CPF, CTPS, comprovantes e outros). Formatos aceitos: PDF, JPG, PNG — até 10 MB cada.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
            Começar upload <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        {/* Card 2 — Formulário */}
        <button
          type="button"
          onClick={onStart}
          className="group flex flex-col items-start gap-5 rounded-3xl border-2 border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-200 hover:border-slate-400 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition-colors group-hover:bg-slate-200">
            <ClipboardList className="h-6 w-6 text-slate-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-[17px] font-bold text-slate-900">Preencher Formulário</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Preencha suas informações pessoais, documentos e dados complementares passo a passo — 10 etapas guiadas.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 group-hover:gap-2.5 transition-all">
            Iniciar preenchimento <ArrowRight className="h-4 w-4" />
          </span>
        </button>

      </div>

      {/* Footer */}
      <p className="mt-10 text-[13px] text-slate-400">
        Não é você?{' '}
        <button type="button" onClick={onLogout} className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900">
          Sair da conta
        </button>
      </p>

    </div>
  )
}
