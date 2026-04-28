import { useState, useRef, useCallback } from 'react'
import {
  User, MapPin, Phone, FileText, BookOpen, Briefcase,
  Car, Shield, Globe, Heart, Camera, ChevronLeft,
  ChevronRight, ChevronDown, Check, LogOut, Info,
  HelpCircle, AlertTriangle, Menu, Upload, X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// ── Mask utilities ─────────────────────────────────────────────────────────

function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '')
  let result = ''
  let di = 0
  for (let mi = 0; mi < mask.length; mi++) {
    if (di >= digits.length) break
    if (mask[mi] === '0') result += digits[di++]
    else result += mask[mi]
  }
  return result
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits.length <= 10
    ? applyMask(digits, '(00) 0000-0000')
    : applyMask(digits, '(00) 00000-0000')
}

// ── Constants ──────────────────────────────────────────────────────────────

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]
const BLOOD_TYPES  = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
const CIVIL_STATES = ['Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','União Estável','Separado(a)']
const EDUCATION    = [
  'Sem instrução','Fundamental incompleto','Fundamental completo',
  'Médio incompleto','Médio completo','Superior incompleto',
  'Superior completo','Pós-graduação','Mestrado','Doutorado',
]
const CNH_CAT = ['A','B','C','D','E','AB','AC','AD','AE']

// ── Types ──────────────────────────────────────────────────────────────────

type FormData = Record<string, string | boolean>
type FieldType = 'text' | 'date' | 'select' | 'email' | 'tel'

interface FieldDef {
  key: string; label: string; type: FieldType
  span?: 1 | 2; options?: string[]
  required?: boolean; placeholder?: string; hint?: string
  mask?: string
}

interface CheckboxDef { key: string; label: string }

interface TabDef {
  value: string; label: string
  fields: FieldDef[]
  checkboxItems?: CheckboxDef[]
}

interface StepConfig {
  id: number; title: string; subtitle: string; alert?: string
  icon: React.ComponentType<{ className?: string }>
  group: 'Pessoal' | 'Documentos' | 'Complementar'
  optional?: boolean
  fields?: FieldDef[]
  checkboxSection?: { title: string; items: CheckboxDef[] }
  tabs?: TabDef[]
  accordion?: { value: string; label: string; fields?: FieldDef[]; checkboxItems?: CheckboxDef[] }[]
}

// ── Initial form data ──────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  Name:'', Birth:'', NickName:'', Sex:'',
  Nationality:'Brasileira', Naturalness:'', NaturalnessCode:'', HomeState:'',
  EducationalLevel:'', MaritalState:'', BloodType:'',
  Deceased:false, DeceaseDate:'', DeathCertificateNumber:'',
  Street:'', Number:'', Complement:'', District:'', State:'', City:'',
  Cep:'', Country:'Brasil', CountryId:'1', NeighborhoodTypeCode:'',
  Email:'', PersonalEmail:'', PhoneNumber1:'', PhoneNumber2:'', PhoneNumber3:'',
  Cpf:'', identityNumber:'', IdentityNumberEmitterState:'',
  IdentityNumberEmitterAgency:'', IdentityNumberEmissionDate:'', Nit:'',
  ElectoralCard:'', ElectoralWard:'', ElectoralSection:'', ElectoralCardEmitterState:'',
  WorkCard:'', WorkCardSerialNumber:'', WorkCardEmitterState:'',
  WorkCardEmissionDate:'', WorkCardExpirationDate:'',
  DriversLicense:'', DriversLicenseType:'', DriversLicenseExpirationDate:'',
  DriversLicenseEmitterAgency:'', DriversLicenseFirstEmissionDate:'',
  MilitaryDischargeCertificate:'', MilitaryGrade:'', MilitaryDivision:'',
  MilitaryCertificateEmissionDate:'', MilitaryCertificateEmitterAgency:'',
  MilitaryRegion:'', MilitarySituation:'',
  Naturalized:false, NaturalisationDate:'', NaturalisationGatehouse:'',
  ArrivalDate:'', Rne:'', RneEmitterAgency:'', RneExpirationDate:'',
  VisaType:'', PassportNumber:'', PassportExpirationDate:'',
  NativeCountry:'', ImmigrationDecree:'', BrazilConditionClassification:'',
  BrazilConsort:false, BrazilianChildren:false, BrazilianChildrenNumber:'',
  Disabled:false, Rehabilitated:false, DeafPerson:false, MutePerson:false,
  BlindPerson:false, MentallyImpairedPerson:false, IntellectualImpairedPerson:false,
  AccessibilityFeaturesForJobLocal:'',
  Student:false, Teacher:false, Candidate:true, Employee:true,
  UserCode:'', Company:'',
}

// ── Steps ──────────────────────────────────────────────────────────────────

const STEPS: StepConfig[] = [
  {
    id: 1, title: 'Dados Pessoais',
    subtitle: 'Informações básicas de identificação do colaborador',
    icon: User, group: 'Pessoal',
    tabs: [
      {
        value: 'identificacao', label: 'Identificação',
        fields: [
          { key:'Name',     label:'Nome completo',         type:'text', span:2, required:true, hint:'Nome conforme documento oficial' },
          { key:'Birth',    label:'Data de nascimento',    type:'date', required:true },
          { key:'NickName', label:'Apelido / Nome social', type:'text' },
          { key:'Sex',      label:'Sexo',                  type:'select', options:['M - Masculino','F - Feminino','O - Outro'], required:true },
        ],
      },
      {
        value: 'localidade', label: 'Localidade',
        fields: [
          { key:'Nationality',     label:'Nacionalidade',          type:'text' },
          { key:'Naturalness',     label:'Naturalidade (cidade)',  type:'text', hint:'Cidade de nascimento' },
          { key:'HomeState',       label:'UF de nascimento',       type:'select', options:ESTADOS },
          { key:'NaturalnessCode', label:'Código da naturalidade', type:'text', mask:'00000' },
        ],
      },
      {
        value: 'adicionais', label: 'Dados Adicionais',
        fields: [
          { key:'MaritalState',     label:'Estado civil',      type:'select', options:CIVIL_STATES },
          { key:'BloodType',        label:'Tipo sanguíneo',    type:'select', options:BLOOD_TYPES, hint:'Tipo sanguíneo e fator Rh' },
          { key:'EducationalLevel', label:'Grau de instrução', type:'select', options:EDUCATION },
        ],
      },
    ],
  },
  {
    id: 2, title: 'Endereço',
    subtitle: 'Endereço residencial completo e atualizado',
    icon: MapPin, group: 'Pessoal',
    fields: [
      { key:'Cep',        label:'CEP',         type:'text', required:true, placeholder:'00000-000', mask:'00000-000', hint:'Informe o CEP para preenchimento automático' },
      { key:'Street',     label:'Logradouro',  type:'text', span:2, required:true },
      { key:'Number',     label:'Número',      type:'text', required:true, placeholder:'123' },
      { key:'Complement', label:'Complemento', type:'text', placeholder:'Apto, bloco…' },
      { key:'District',   label:'Bairro',      type:'text', required:true },
      { key:'City',       label:'Cidade',      type:'text', required:true },
      { key:'State',      label:'UF',          type:'select', options:ESTADOS, required:true },
      { key:'Country',    label:'País',        type:'text' },
    ],
  },
  {
    id: 3, title: 'Contato',
    subtitle: 'Formas de contato e comunicação',
    icon: Phone, group: 'Pessoal',
    fields: [
      { key:'Email',         label:'E-mail corporativo',   type:'email', span:2, required:true },
      { key:'PersonalEmail', label:'E-mail pessoal',       type:'email', span:2 },
      { key:'PhoneNumber1',  label:'Telefone principal',   type:'tel', required:true, placeholder:'(00) 00000-0000' },
      { key:'PhoneNumber2',  label:'Telefone secundário',  type:'tel', placeholder:'(00) 00000-0000' },
      { key:'PhoneNumber3',  label:'Telefone alternativo', type:'tel', placeholder:'(00) 00000-0000' },
    ],
  },
  {
    id: 4, title: 'Documentos Pessoais',
    subtitle: 'CPF, NIT/PIS e documento de identidade (RG)',
    icon: FileText, group: 'Documentos',
    alert: 'O CPF é obrigatório para o cadastro. Verifique se o número está correto antes de continuar.',
    tabs: [
      {
        value: 'cpf-nit', label: 'CPF & NIT',
        fields: [
          { key:'Cpf', label:'CPF', type:'text', required:true, placeholder:'000.000.000-00', mask:'000.000.000-00', hint:'Cadastro de Pessoa Física — 11 dígitos' },
          { key:'Nit', label:'NIT / PIS / PASEP', type:'text', placeholder:'000.00000.00-0', mask:'000.00000.00-0', hint:'Número de Inscrição do Trabalhador' },
        ],
      },
      {
        value: 'rg', label: 'RG / Identidade',
        fields: [
          { key:'identityNumber',              label:'Número do RG',    type:'text', required:true, hint:'Número constante no documento de identidade' },
          { key:'IdentityNumberEmitterAgency', label:'Órgão emissor',   type:'text', placeholder:'SSP' },
          { key:'IdentityNumberEmitterState',  label:'UF emissora',     type:'select', options:ESTADOS },
          { key:'IdentityNumberEmissionDate',  label:'Data de emissão', type:'date' },
        ],
      },
    ],
  },
  {
    id: 5, title: 'Título Eleitoral',
    subtitle: 'Dados do título de eleitor',
    icon: BookOpen, group: 'Documentos',
    fields: [
      { key:'ElectoralCard',             label:'Número do título', type:'text', mask:'000000000000' },
      { key:'ElectoralWard',             label:'Zona eleitoral',   type:'text', placeholder:'0012', mask:'0000' },
      { key:'ElectoralSection',          label:'Seção eleitoral',  type:'text', placeholder:'0006', mask:'0000' },
      { key:'ElectoralCardEmitterState', label:'UF emissora',      type:'select', options:ESTADOS },
    ],
  },
  {
    id: 6, title: 'Carteira de Trabalho',
    subtitle: 'Dados da CTPS — Carteira de Trabalho e Previdência Social',
    icon: Briefcase, group: 'Documentos',
    fields: [
      { key:'WorkCard',               label:'Número da CTPS',   type:'text', mask:'0000000' },
      { key:'WorkCardSerialNumber',   label:'Série',             type:'text', mask:'00000' },
      { key:'WorkCardEmitterState',   label:'UF da CTPS',        type:'select', options:ESTADOS },
      { key:'WorkCardEmissionDate',   label:'Data de emissão',   type:'date' },
      { key:'WorkCardExpirationDate', label:'Data de validade',  type:'date' },
    ],
  },
  {
    id: 7, title: 'CNH',
    subtitle: 'Carteira Nacional de Habilitação',
    icon: Car, group: 'Documentos', optional: true,
    fields: [
      { key:'DriversLicense',                  label:'Número da CNH',  type:'text', mask:'00000000000' },
      { key:'DriversLicenseType',              label:'Categoria',       type:'select', options:CNH_CAT },
      { key:'DriversLicenseEmitterAgency',     label:'Órgão emissor',   type:'text' },
      { key:'DriversLicenseFirstEmissionDate', label:'1ª emissão',      type:'date' },
      { key:'DriversLicenseExpirationDate',    label:'Validade',        type:'date' },
    ],
  },
  {
    id: 8, title: 'Documento Militar',
    subtitle: 'Certificado de dispensa e situação militar',
    icon: Shield, group: 'Documentos', optional: true,
    fields: [
      { key:'MilitaryDischargeCertificate',     label:'Certificado de reservista', type:'text', span:2 },
      { key:'MilitaryGrade',                    label:'Grau militar',              type:'text', placeholder:'CDI' },
      { key:'MilitaryDivision',                 label:'Divisão',                   type:'text' },
      { key:'MilitaryRegion',                   label:'Região militar',            type:'text' },
      { key:'MilitarySituation',                label:'Situação',                  type:'text' },
      { key:'MilitaryCertificateEmissionDate',  label:'Data de emissão',           type:'date' },
      { key:'MilitaryCertificateEmitterAgency', label:'Órgão emissor',             type:'text' },
    ],
  },
  {
    id: 9, title: 'Estrangeiro & Família',
    subtitle: 'Dados para colaboradores estrangeiros e vínculos familiares com o Brasil',
    icon: Globe, group: 'Complementar', optional: true,
    tabs: [
      {
        value: 'documentacao', label: 'Documentação',
        fields: [
          { key:'NativeCountry',          label:'País de origem',            type:'text' },
          { key:'ArrivalDate',            label:'Data de chegada ao Brasil', type:'date' },
          { key:'Rne',                    label:'RNE',                       type:'text', hint:'Registro Nacional do Estrangeiro' },
          { key:'RneEmitterAgency',       label:'Órgão emissor do RNE',      type:'text' },
          { key:'RneExpirationDate',      label:'Validade do RNE',           type:'date' },
          { key:'VisaType',               label:'Tipo de visto',             type:'text' },
          { key:'PassportNumber',         label:'Número do passaporte',      type:'text' },
          { key:'PassportExpirationDate', label:'Validade do passaporte',    type:'date' },
        ],
      },
      {
        value: 'naturalizacao', label: 'Naturalização & Família',
        fields: [
          { key:'NaturalisationDate',      label:'Data de naturalização',    type:'date' },
          { key:'NaturalisationGatehouse', label:'Portaria de naturalização', type:'text' },
          { key:'BrazilianChildrenNumber', label:'Nº de filhos brasileiros',  type:'text', mask:'00' },
        ],
        checkboxItems: [
          { key:'Naturalized',       label:'Naturalizado brasileiro' },
          { key:'BrazilConsort',     label:'Cônjuge brasileiro(a)' },
          { key:'BrazilianChildren', label:'Possui filhos brasileiros' },
        ],
      },
    ],
  },
  {
    id: 10, title: 'Deficiência & Perfil',
    subtitle: 'Condições de acessibilidade e perfil do colaborador no sistema',
    icon: Heart, group: 'Complementar', optional: true,
    accordion: [
      {
        value: 'deficiencias',
        label: 'Deficiências e Condições (PcD)',
        fields: [
          { key:'AccessibilityFeaturesForJobLocal', label:'Recursos de acessibilidade necessários', type:'text', span:2, placeholder:'Descreva os recursos necessários para o desempenho das atividades…' },
        ],
        checkboxItems: [
          { key:'Disabled',                   label:'Pessoa com deficiência (PcD)' },
          { key:'Rehabilitated',              label:'Reabilitado pelo INSS' },
          { key:'DeafPerson',                 label:'Deficiência auditiva' },
          { key:'MutePerson',                 label:'Mudez' },
          { key:'BlindPerson',                label:'Deficiência visual' },
          { key:'MentallyImpairedPerson',     label:'Deficiência mental' },
          { key:'IntellectualImpairedPerson', label:'Deficiência intelectual' },
        ],
      },
      {
        value: 'perfil',
        label: 'Perfil no Sistema',
        fields: [
          { key:'UserCode', label:'Código de usuário', type:'text', hint:'Login de acesso ao sistema interno' },
          { key:'Company',  label:'Empresa',           type:'text' },
        ],
        checkboxItems: [
          { key:'Student',   label:'É aluno' },
          { key:'Teacher',   label:'É professor' },
          { key:'Candidate', label:'É candidato' },
          { key:'Employee',  label:'É funcionário' },
        ],
      },
    ],
  },
]

const GROUPS = [
  { label: 'Pessoal',      steps: STEPS.filter(s => s.group === 'Pessoal') },
  { label: 'Documentos',   steps: STEPS.filter(s => s.group === 'Documentos') },
  { label: 'Complementar', steps: STEPS.filter(s => s.group === 'Complementar') },
]

// ── FormField — Apple floating-label style ────────────────────────────────

function FormField({ field, value, onChange }: {
  field: FieldDef; value: string
  onChange: (key: string, value: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const filled = field.type === 'select' ? value !== '' : value.length > 0
  const isUp   = focused || filled || field.type === 'date'

  const handleRawChange = (raw: string) => {
    if (field.mask) onChange(field.key, applyMask(raw, field.mask))
    else if (field.type === 'tel') onChange(field.key, applyPhoneMask(raw))
    else onChange(field.key, raw)
  }

  const wrapperCls = cn(
    'relative rounded-2xl border bg-white transition-colors duration-150',
    field.span === 2 && 'md:col-span-2',
    focused
      ? 'border-blue-500'
      : 'border-slate-200 hover:border-slate-300',
  )

  const labelCls = cn(
    'pointer-events-none absolute left-4 select-none transition-all duration-150',
    isUp
      ? cn('top-2.5 text-[11px] font-medium', focused ? 'text-blue-500' : 'text-slate-400')
      : 'top-1/2 -translate-y-1/2 text-[15px] text-slate-400',
  )

  const inputCls =
    'w-full bg-transparent px-4 pt-[22px] pb-[10px] text-[15px] text-slate-900 outline-none ' +
    'placeholder-transparent'

  const labelText = field.required ? `${field.label} *` : field.label

  if (field.type === 'select') {
    return (
      <div className={wrapperCls}>
        <label className={labelCls}>{labelText}</label>
        <select
          value={value}
          onChange={e => onChange(field.key, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(inputCls, 'cursor-pointer appearance-none pr-10')}
        >
          <option value="" />
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {field.hint && (
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 cursor-help text-slate-300 hover:text-slate-500" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] text-xs">{field.hint}</TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <div className={cn(wrapperCls)}>
      <label className={labelCls}>{labelText}</label>
      <input
        type={field.type === 'tel' ? 'tel' : field.type}
        value={value}
        onChange={e => handleRawChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        inputMode={field.mask || field.type === 'tel' ? 'numeric' : undefined}
        className={cn(inputCls, field.hint && 'pr-10')}
      />
      {field.hint && (
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-help text-slate-300 hover:text-slate-500" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px] text-xs">{field.hint}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

// ── CheckboxCard ───────────────────────────────────────────────────────────

function CheckboxCard({ item, checked, onChange }: {
  item: CheckboxDef; checked: boolean
  onChange: (key: string, value: boolean) => void
}) {
  return (
    <label className={cn(
      'flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
      checked
        ? 'border-blue-400 bg-blue-50'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
    )}>
      <Checkbox
        checked={checked}
        onCheckedChange={v => onChange(item.key, !!v)}
        className="h-5 w-5 shrink-0 border-slate-300 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
      />
      <span className={cn('text-sm font-medium leading-snug', checked ? 'text-blue-700' : 'text-slate-700')}>
        {item.label}
      </span>
    </label>
  )
}

// ── FieldsGrid ─────────────────────────────────────────────────────────────

function FieldsGrid({ fields, checkboxItems, formData, onChange }: {
  fields: FieldDef[]
  checkboxItems?: CheckboxDef[]
  formData: FormData
  onChange: (key: string, value: string | boolean) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {fields.map(f => (
          <FormField
            key={f.key} field={f}
            value={(formData[f.key] as string) ?? ''}
            onChange={onChange}
          />
        ))}
      </div>
      {checkboxItems && checkboxItems.length > 0 && (
        <div className="space-y-3">
          <div className="h-px bg-slate-100" />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {checkboxItems.map(item => (
              <CheckboxCard
                key={item.key} item={item}
                checked={!!formData[item.key]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── AvatarUploader ─────────────────────────────────────────────────────────

function AvatarUploader({ name, avatar, onAvatarChange, size = 'md', dark = false }: {
  name: string; avatar: string | null
  onAvatarChange: (url: string) => void
  size?: 'sm' | 'md'
  dark?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')
  const dim  = size === 'sm' ? 'h-9 w-9' : 'h-16 w-16'
  const text = size === 'sm' ? 'text-sm' : 'text-lg'
  const ring = dark ? 'ring-2 ring-slate-700' : 'ring-2 ring-blue-500/20'

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { if (reader.result) onAvatarChange(reader.result as string) }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <button type="button" onClick={() => fileRef.current?.click()}
        className={cn('group relative shrink-0 focus:outline-none', dim)}>
        {avatar ? (
          <img src={avatar} alt="Foto" className={cn('h-full w-full rounded-full object-cover', ring)} />
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center rounded-full bg-blue-600 font-semibold text-white', text, ring)}>
            {initials || <User className="h-4 w-4" />}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-3.5 w-3.5 text-white" />
        </div>
        <div className={cn(
          'absolute flex h-5 w-5 items-center justify-center rounded-full border-2 bg-blue-600 -bottom-0.5 -right-0.5',
          dark ? 'border-slate-900' : 'border-white',
        )}>
          <Camera className="h-2.5 w-2.5 text-white" />
        </div>
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </>
  )
}

// ── SidebarContent (shared between desktop aside and mobile Sheet) ─────────

function SidebarContent({ employeeName, avatar, setAvatar, formData, progressPct, doneCount, currentStep, totalSteps, setCurrentStep, onLogout, onNavigate }: {
  employeeName: string; avatar: string | null
  setAvatar: (url: string) => void; formData: FormData
  progressPct: number; doneCount: number
  currentStep: number; totalSteps: number
  setCurrentStep: (i: number) => void
  onLogout: () => void; onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-slate-900">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-800 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Briefcase className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[14px] font-semibold tracking-tight text-white">Smart Onboard</p>
          <p className="text-[11px] text-slate-400">Admissão Digital</p>
        </div>
      </div>

      {/* Employee card */}
      <div className="shrink-0 px-4 pt-4 pb-3">
        <div className="rounded-xl bg-slate-800 p-4">
          <div className="flex items-center gap-3">
            <AvatarUploader name={formData.Name as string} avatar={avatar} onAvatarChange={setAvatar} dark />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{employeeName}</p>
              <p className="text-xs text-slate-400">Novo colaborador</p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold tabular-nums text-slate-300">{progressPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step list */}
      <ScrollArea className="flex-1 px-3 pb-3">
        {GROUPS.map(({ label, steps }, gi) => {
          const groupDone = steps.filter(s => STEPS.findIndex(x => x.id === s.id) < currentStep).length
          return (
            <div key={label} className={cn(gi > 0 && 'mt-2')}>

              {/* Group header */}
              <div className="flex items-center gap-2.5 px-1 py-2">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  {label}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                  {groupDone}/{steps.length}
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              {/* Steps */}
              <div className="space-y-1">
                {steps.map(s => {
                  const idx       = STEPS.findIndex(x => x.id === s.id)
                  const isCurrent = idx === currentStep
                  const isDone    = idx < currentStep
                  return (
                    <button key={s.id} type="button"
                      onClick={() => { setCurrentStep(idx); onNavigate?.() }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150',
                        isCurrent
                          ? 'bg-blue-600 shadow-lg shadow-blue-600/20'
                          : isDone
                            ? 'hover:bg-slate-800'
                            : 'hover:bg-slate-800/60',
                      )}>

                      {/* Indicator */}
                      <div className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isDone
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500 ring-1 ring-slate-700',
                      )}>
                        {isDone
                          ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          : s.id}
                      </div>

                      {/* Label */}
                      <span className={cn(
                        'flex-1 truncate text-sm font-medium leading-tight',
                        isCurrent ? 'font-semibold text-white'
                          : isDone  ? 'text-slate-300'
                            : 'text-slate-400 group-hover:text-slate-200',
                      )}>
                        {s.title}
                      </span>

                      {s.optional && !isCurrent && (
                        <span className="shrink-0 text-[10px] text-slate-600">opt</span>
                      )}
                    </button>
                  )
                })}
              </div>

            </div>
          )
        })}
      </ScrollArea>

      {/* Bottom */}
      <div className="shrink-0 border-t border-slate-800 px-3 py-3 space-y-1">
        <div className="flex items-center justify-between px-3 py-1.5 text-xs">
          <span className="text-slate-400">{doneCount} de {totalSteps} etapas</span>
          <span className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            doneCount === totalSteps
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-slate-800 text-slate-400',
          )}>
            {doneCount === totalSteps ? 'Completo' : 'Em andamento'}
          </span>
        </div>
        <button type="button" onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>

    </div>
  )
}

// ── AvatarSection — shown inside step 1 card ──────────────────────────────

function AvatarSection({ name, avatar, onAvatarChange }: {
  name: string; avatar: string | null
  onAvatarChange: (url: string) => void
}) {
  const galleryRef = useRef<HTMLInputElement>(null)
  const cameraRef  = useRef<HTMLInputElement>(null)
  const initials   = name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { if (reader.result) onAvatarChange(reader.result as string) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-4 border-b border-slate-100 pb-6">
      {/* Avatar circle */}
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-blue-50">
          {avatar ? (
            <img src={avatar} alt="Foto" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-2xl font-semibold text-white">
              {initials || <User className="h-8 w-8" />}
            </div>
          )}
        </div>
        {avatar && (
          <button
            type="button"
            onClick={() => onAvatarChange('')}
            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
            aria-label="Remover foto"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-slate-600">Foto de perfil</p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <Upload className="h-4 w-4 text-slate-500" />
          Galeria
        </button>
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          <Camera className="h-4 w-4 text-slate-500" />
          Câmera
        </button>
      </div>

      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <input ref={cameraRef}  type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ── SuccessPage ────────────────────────────────────────────────────────────

function SuccessPage({ name, onLogout }: { name: string; onLogout: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md border-slate-200 text-center shadow-lg">
        <CardContent className="flex flex-col items-center gap-6 px-8 pb-8 pt-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/25">
            <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cadastro concluído!</h1>
            <p className="text-[15px] leading-relaxed text-slate-500">
              Olá{name ? `, ${name.split(' ')[0]}` : ''}! Seus dados foram enviados com sucesso.
              A equipe de RH entrará em contato em breve.
            </p>
          </div>
          <Button onClick={onLogout} variant="outline"
            className="h-11 rounded-xl border-slate-200 px-6 text-slate-700 hover:bg-slate-50">
            <LogOut className="mr-2 h-4 w-4" /> Sair da plataforma
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ── OnboardingPage ─────────────────────────────────────────────────────────

export function OnboardingPage({ onLogout }: { onLogout: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData]       = useState<FormData>(INITIAL_FORM)
  const [avatar, setAvatar]           = useState<string | null>(null)
  const [completed, setCompleted]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const step        = STEPS[currentStep]
  const totalSteps  = STEPS.length
  const progressPct = Math.round((currentStep / totalSteps) * 100)
  const doneCount   = currentStep

  const handleChange = useCallback((key: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const goNext = () => currentStep < totalSteps - 1 ? setCurrentStep(s => s + 1) : setCompleted(true)
  const goPrev = () => currentStep > 0 && setCurrentStep(s => s - 1)

  if (completed) return <SuccessPage name={formData.Name as string} onLogout={onLogout} />

  const employeeName = (formData.Name as string) || 'Novo Colaborador'

  const sidebarProps = {
    employeeName, avatar, setAvatar, formData,
    progressPct, doneCount, currentStep, totalSteps,
    setCurrentStep, onLogout,
  }

  return (
    <TooltipProvider delay={300}>
      <div className="flex h-screen overflow-hidden bg-slate-50">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden w-[268px] shrink-0 lg:block">
          <SidebarContent {...sidebarProps} />
        </aside>

        {/* ── Mobile Sheet Sidebar ── */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" showCloseButton={false}
            className="w-[280px] bg-slate-900 p-0 border-r border-slate-800">
            <SidebarContent {...sidebarProps} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* ── Main column ── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Top bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-7">
            {/* Mobile: hamburger + step info */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{step.title}</p>
                <p className="text-[11px] text-slate-400">{step.group} · Etapa {currentStep + 1}/{totalSteps}</p>
              </div>
            </div>

            {/* Desktop: breadcrumb */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-sm text-slate-400">{step.group}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              <span className="text-sm font-semibold text-slate-800">{step.title}</span>
              {step.optional && (
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  Opcional
                </span>
              )}
            </div>

            {/* Right: progress + avatar */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="relative h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold tabular-nums text-slate-500">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <AvatarUploader
                  name={formData.Name as string}
                  avatar={avatar}
                  onAvatarChange={setAvatar}
                  size="sm"
                />
                <div className="hidden text-right md:block">
                  <p className="text-[13px] font-semibold leading-tight text-slate-800">{employeeName}</p>
                  <p className="text-[11px] text-slate-400">Colaborador</p>
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto">
            <div
              key={currentStep}
              className="animate-in fade-in-0 slide-in-from-bottom-2 mx-auto max-w-2xl space-y-4 p-4 pb-6 lg:p-8 lg:pb-8"
              style={{ animationDuration: '260ms' }}
            >
              {/* Alert banners */}
              {step.alert && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 !text-amber-600" />
                  <AlertTitle className="text-amber-800">Atenção</AlertTitle>
                  <AlertDescription className="text-amber-700">{step.alert}</AlertDescription>
                </Alert>
              )}
              {step.optional && !step.alert && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 !text-blue-500" />
                  <AlertTitle className="text-blue-800">Etapa opcional</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Preencha apenas se as informações forem aplicáveis ao seu perfil.
                  </AlertDescription>
                </Alert>
              )}

              {/* Step Card */}
              <Card className="border-slate-200 shadow-none">
                <CardHeader className="border-b border-slate-100 px-5 py-4 lg:px-7 lg:py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <step.icon className="h-[18px] w-[18px] text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-semibold tracking-tight text-slate-900">
                          {step.title}
                        </CardTitle>
                        <CardDescription className="text-[13px] text-slate-400">
                          {step.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      {currentStep + 1} / {totalSteps}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 lg:p-7">
                  {/* Avatar upload — only on step 1 */}
                  {step.id === 1 && (
                    <AvatarSection
                      name={formData.Name as string}
                      avatar={avatar}
                      onAvatarChange={setAvatar}
                    />
                  )}

                  {/* Tabs variant */}
                  {step.tabs && (
                    <Tabs defaultValue={step.tabs[0].value}>
                      <TabsList className="mb-6 h-11 w-full rounded-xl bg-slate-100 p-1">
                        {step.tabs.map(tab => (
                          <TabsTrigger key={tab.value} value={tab.value}
                            className="flex-1 rounded-lg text-[13px] font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {step.tabs.map(tab => (
                        <TabsContent key={tab.value} value={tab.value}>
                          <FieldsGrid
                            fields={tab.fields}
                            checkboxItems={tab.checkboxItems}
                            formData={formData}
                            onChange={handleChange}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}

                  {/* Accordion variant */}
                  {step.accordion && (
                    <Accordion multiple defaultValue={step.accordion.map(a => a.value)} className="space-y-3">
                      {step.accordion.map(section => (
                        <AccordionItem key={section.value} value={section.value}
                          className="rounded-xl border border-slate-200 px-1 shadow-none">
                          <AccordionTrigger className="px-4 py-4 text-[14px] font-semibold text-slate-800 hover:no-underline">
                            {section.label}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-5">
                            <FieldsGrid
                              fields={section.fields ?? []}
                              checkboxItems={section.checkboxItems}
                              formData={formData}
                              onChange={handleChange}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}

                  {/* Plain fields variant */}
                  {step.fields && (
                    <FieldsGrid
                      fields={step.fields}
                      checkboxItems={step.checkboxSection?.items}
                      formData={formData}
                      onChange={handleChange}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Navigation row — desktop */}
              <div className="hidden items-center justify-between pb-2 pt-1 lg:flex">
                <Button variant="outline" onClick={goPrev} disabled={currentStep === 0}
                  className="h-11 gap-1.5 rounded-xl border-slate-200 px-5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>

                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {STEPS.map((_, i) => (
                    <Tooltip key={i}>
                      <TooltipTrigger>
                        <button type="button" onClick={() => setCurrentStep(i)}
                          className={cn(
                            'rounded-full transition-all duration-300',
                            i === currentStep ? 'h-2 w-5 bg-blue-500'
                              : i < currentStep ? 'h-2 w-2 bg-blue-300'
                                : 'h-2 w-2 bg-slate-300',
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">{STEPS[i].title}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <Button onClick={goNext}
                  className="h-11 gap-1.5 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]">
                  {currentStep === totalSteps - 1
                    ? <><Check className="h-4 w-4" /> Concluir cadastro</>
                    : <>Próximo <ChevronRight className="h-4 w-4" /></>}
                </Button>
              </div>

            </div>
          </main>

          {/* Mobile bottom nav — fixed */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <Button variant="outline" onClick={goPrev} disabled={currentStep === 0}
              className="h-12 flex-1 gap-1 rounded-xl border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>

            {/* Mini dots */}
            <div className="flex shrink-0 items-center gap-1">
              {STEPS.map((_, i) => (
                <button key={i} type="button" onClick={() => setCurrentStep(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === currentStep ? 'h-2 w-4 bg-blue-500'
                      : i < currentStep ? 'h-1.5 w-1.5 bg-blue-300'
                        : 'h-1.5 w-1.5 bg-slate-200',
                  )}
                />
              ))}
            </div>

            <Button onClick={goNext}
              className="h-12 flex-1 gap-1 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98]">
              {currentStep === totalSteps - 1
                ? <><Check className="h-4 w-4" /> Concluir</>
                : <>Próximo <ChevronRight className="h-4 w-4" /></>}
            </Button>
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}
