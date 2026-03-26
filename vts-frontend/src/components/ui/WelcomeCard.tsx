import type { ReactNode } from 'react'

type WelcomeCardProps = {
  name: string
  role: string
  actions?: ReactNode
}

export function WelcomeCard({ name, role, actions }: WelcomeCardProps) {
  return (
    <section className='relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1e293b]'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),_transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_50%)]' />
      <div className='relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-[#38bdf8]'>
            Welcome Back
          </p>
          <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>{name}</h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>
            Role: <span className='font-semibold text-slate-900 dark:text-slate-100'>{role}</span>
          </p>
        </div>
        {actions ? <div className='w-full max-w-sm'>{actions}</div> : null}
      </div>
    </section>
  )
}
