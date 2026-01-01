import React, { useState, useEffect } from "react"
import { vscode } from "../utils/vscode"

const OnboardingWizard = () => {
    const [step, setStep] = useState(0)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100)
    }, [])

    const nextStep = () => {
        setAnimate(false)
        setTimeout(() => {
            setStep(s => s + 1)
            setAnimate(true)
        }, 300)
    }

    const finish = () => {
        vscode.postMessage({ type: "onboardingComplete" })
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30" dir="rtl">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className={`relative z-10 max-w-2xl w-full p-8 transition-all duration-700 ease-out transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Step 0: Welcome */}
                {step === 0 && (
                    <div className="text-center space-y-8">
                        <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl mb-4">
                            <svg className="w-20 h-20 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-zinc-400 pb-2">
                            به راد خوش آمدید
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed">
                            دستیار هوشمند کسب و کار شما. طراحی شده برای تحلیل، تحقیق و مدیریت پروژه‌های شما.
                        </p>
                        <div className="pt-8">
                            <button onClick={nextStep} className="group relative px-8 py-3 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                شروع کنید
                                <span className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all animate-pulse"></span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 1: Workspace */}
                {step === 1 && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">محیط کاری خود را انتخاب کنید</h2>
                        <p className="text-zinc-400 text-center text-lg">
                            پوشه‌ای که اسناد کسب و کار شما در آن قرار دارد را انتخاب کنید. راد به صورت خودکار اطلاعات را تحلیل می‌کند.
                        </p>

                        <div className="grid grid-cols-1 gap-4 pt-4">
                            <button onClick={() => { vscode.postMessage({ type: "openFolder" }); nextStep(); }} className="flex items-center p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl transition-all group text-right">
                                <div className="p-3 bg-zinc-800 rounded-xl mr-0 ml-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                    <span className="codicon codicon-folder-opened !text-2xl"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">انتخاب پوشه موجود</h3>
                                    <p className="text-zinc-500 text-sm">اسناد و فایل‌های خود را وارد کنید</p>
                                </div>
                            </button>

                            <button onClick={() => { vscode.postMessage({ type: "createSample" }); nextStep(); }} className="flex items-center p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl transition-all group text-right">
                                <div className="p-3 bg-zinc-800 rounded-xl mr-0 ml-4 group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                                    <span className="codicon codicon-beaker !text-2xl"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">ایجاد محیط نمونه</h3>
                                    <p className="text-zinc-500 text-sm">با داده‌های آزمایشی راد آشنا شوید</p>
                                </div>
                            </button>
                        </div>
                        <div className="text-center pt-8">
                            <button onClick={nextStep} className="text-zinc-500 hover:text-zinc-300 text-sm underline underline-offset-4">
                                فعلاً رد شوید
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Mode Selection */}
                {step === 2 && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">انتخاب حالت پیش‌فرض</h2>
                        <p className="text-zinc-400 text-center text-lg">
                            بیشتر وقت خود را چگونه می‌گذرانید؟
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <button onClick={finish} className="relative p-6 bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-4 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <span className="codicon codicon-comment-discussion !text-xl"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold">پرسش و پاسخ</h3>
                                    <p className="text-zinc-500 text-xs mt-2">تحلیل عمومی اسناد</p>
                                </div>
                            </button>

                            <button onClick={finish} className="relative p-6 bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-4 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <span className="codicon codicon-graph !text-xl"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold">تحلیلگر</h3>
                                    <p className="text-zinc-500 text-xs mt-2">داده‌های مالی و آماری</p>
                                </div>
                            </button>

                            <button onClick={finish} className="relative p-6 bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl transition-all group flex flex-col items-center text-center space-y-4 hover:-translate-y-1">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                    <span className="codicon codicon-telescope !text-xl"></span>
                                </div>
                                <div>
                                    <h3 className="font-bold">پژوهشگر</h3>
                                    <p className="text-zinc-500 text-xs mt-2">جستجوی وب و منابع</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="fixed bottom-8 text-zinc-600 text-sm">
                Radd Assistant v1.0
            </div>
        </div>
    )
}

export default OnboardingWizard
