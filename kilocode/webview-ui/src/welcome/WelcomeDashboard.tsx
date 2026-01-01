import React, { useState, useEffect } from "react"
import { vscode } from "../utils/vscode"

const WelcomeDashboard = () => {
    const [timeGreeting, setTimeGreeting] = useState("")

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setTimeGreeting("صبح بخیر")
        else if (hour < 17) setTimeGreeting("ظهر بخیر")
        else setTimeGreeting("عصر بخیر")
    }, [])

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30 p-12" dir="rtl">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        {timeGreeting}
                    </h1>
                    <p className="text-zinc-500 text-lg">به مرکز فرماندهی راد خوش آمدید.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button onClick={() => vscode.postMessage({ type: "newProject" })} className="group relative p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl transition-all text-right overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="codicon codicon-new-folder !text-6xl text-purple-500"></span>
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <span className="codicon codicon-add !text-xl"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-white transition-colors">پروژه جدید</h3>
                                <p className="text-zinc-500 text-sm mt-1">ایجاد یک فضای کاری هوشمند</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => vscode.postMessage({ type: "openFolder" })} className="group relative p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-2xl transition-all text-right overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="codicon codicon-folder-opened !text-6xl text-blue-500"></span>
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <span className="codicon codicon-folder-opened !text-xl"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-white transition-colors">باز کردن پروژه</h3>
                                <p className="text-zinc-500 text-sm mt-1">ادامه کار بر روی اسناد</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => vscode.postMessage({ type: "askAgent" })} className="group relative p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition-all text-right overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="codicon codicon-comment-discussion !text-6xl text-emerald-500"></span>
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <span className="codicon codicon-hubot !text-xl"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg group-hover:text-white transition-colors">پرسش از هوش مصنوعی</h3>
                                <p className="text-zinc-500 text-sm mt-1">گفتگو با دستیار هوشمند</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Recents (Mockup for now) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-300">پروژه‌های اخیر</h2>
                        <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">مشاهده همه</button>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl divide-y divide-zinc-800/50">
                        <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <span className="codicon codicon-briefcase"></span>
                                </div>
                                <div>
                                    <h4 className="font-medium group-hover:text-white transition-colors">گزارش مالی ۱۴۰۳</h4>
                                    <p className="text-xs text-zinc-500">d:\Documents\Financials</p>
                                </div>
                            </div>
                            <span className="text-xs text-zinc-600">۲ ساعت پیش</span>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                                    <span className="codicon codicon-book"></span>
                                </div>
                                <div>
                                    <h4 className="font-medium group-hover:text-white transition-colors">طرح کسب و کار</h4>
                                    <p className="text-xs text-zinc-500">d:\Documents\Plans</p>
                                </div>
                            </div>
                            <span className="text-xs text-zinc-600">دیروز</span>
                        </div>
                    </div>
                </div>

                {/* Footer Tips */}
                <div className="pt-8 border-t border-zinc-800/50">
                    <div className="flex items-start gap-3 text-zinc-500 text-sm">
                        <span className="codicon codicon-lightbulb text-yellow-500 mt-0.5"></span>
                        <p>آیا می‌دانستید؟ می‌توانید با زدن دکمه <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 border border-zinc-700">Ctrl+L</kbd> مستقیماً با هوش مصنوعی درباره کدهایتان صحبت کنید.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeDashboard
