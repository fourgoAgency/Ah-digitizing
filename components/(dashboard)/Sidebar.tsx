"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
	FiHome,
	FiList,
	FiTag,
	FiFolder,
	FiUsers,
	FiBarChart2,
	FiStar,
	FiInbox,
	FiHelpCircle,
	FiBell,
	FiUser,
	FiSettings,
	FiMenu,
	FiX,
	FiChevronLeft,
	FiChevronRight,
	FiBook,
} from "react-icons/fi"

type SidebarProps = {
	ordersCount?: number
}

const navItems = [
	{ label: "Home", href: "/admin", icon: FiHome },
	{ label: "Orders", href: "/admin/orders", icon: FiList },
	{ label: "Products", href: "/admin/products", icon: FiTag },
	{ label: "Blogs", href: "/admin/blog", icon: FiBook },
	{ label: "Categories", href: "/admin/categories", icon: FiFolder },
	{ label: "Coupons", href: "/admin/coupons", icon: FiStar },
	
]


export default function Sidebar({ ordersCount = 16 }: SidebarProps) {
	const pathname = usePathname() || ""

	const [collapsed, setCollapsed] = useState<boolean>(() => {
		try {
			if (typeof window === "undefined") return false
			return localStorage.getItem("sidebar-collapsed") === "1"
		} catch {
			return false
		}
	})
	const [mobileOpen, setMobileOpen] = useState(false)

	useEffect(() => {
		try {
			localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0")
		} catch {}
	}, [collapsed])

	function isActive(href: string) {
		if (href === "/dashboard") return pathname === href
		return pathname === href || pathname.startsWith(href + "/")
	}

	const widthClass = collapsed ? "w-72 md:w-[88px]" : "w-72 md:w-64"
	const paddingClass = collapsed ? "p-5 md:px-3 md:py-5" : "p-5"
	const collapsedLinkClass = collapsed ? "md:justify-center md:gap-0" : ""
	const collapsedTextClass = collapsed ? "md:hidden" : ""
	const collapsedSectionClass = collapsed ? "md:hidden" : ""
	const baseLinkClass =
		"group flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors"

	return (
		<>
			<button
				aria-label="Open menu"
				onClick={() => setMobileOpen(true)}
				className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#1F2A4A] shadow-sm ring-1 ring-slate-200 md:hidden"
			>
				<FiMenu className="w-5 h-5" />
			</button>

			{mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />}

			<aside
				className={`${widthClass} ${paddingClass} fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-[#1F2A4A] text-white shadow-2xl transition-all duration-200 ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				} md:sticky md:top-0 md:h-[calc(100vh-64px)] md:flex-none md:translate-x-0 md:shadow-none`}
			>
				<div className="mb-5 flex items-center justify-between md:hidden">
					<Link
						href="/dashboard"
						onClick={() => setMobileOpen(false)}
						className="flex items-center gap-3 rounded-md bg-white/10 p-3"
					>
						<FiHome className="text-white/90 w-5 h-5 shrink-0" />
						<span className="font-medium">Dashboard</span>
					</Link>

					<button
						onClick={() => setMobileOpen(false)}
						aria-label="Close menu"
						className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white md:hidden"
					>
						<FiX />
					</button>
				</div>

				<nav className="min-h-0 flex-1 overflow-y-auto pr-1">
					<ul className="space-y-1.5">
						{navItems.map((item) => {
							const Icon = item.icon
							const active = isActive(item.href)

							return (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setMobileOpen(false)}
										title={item.label}
										aria-current={active ? "page" : undefined}
										className={`${baseLinkClass} ${collapsedLinkClass} ${
											active ? "bg-white text-[#1F2A4A] shadow-sm" : "text-white/75 hover:bg-white/10 hover:text-white"
										}`}
									>
										<Icon className="h-5 w-5 shrink-0" />
										<span className={`min-w-0 flex-1 truncate ${collapsedTextClass}`}>{item.label}</span>
										
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className="mt-4 hidden border-t border-white/10 pt-4 md:flex">
					<button
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						aria-pressed={collapsed}
						onClick={() => setCollapsed((s) => !s)}
						className="mx-auto flex h-10 w-full items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/15"
					>
						{collapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
					</button>
				</div>
			</aside>
		</>
	)
}
