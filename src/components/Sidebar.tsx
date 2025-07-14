import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  ChartBarIcon,
  BanknotesIcon,
  CogIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Produtos', href: '/products', icon: ShoppingBagIcon },
  { name: 'Fornecedores', href: '/suppliers', icon: TruckIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
  { name: 'Caixa', href: '/cashier', icon: BanknotesIcon },
  { name: 'Configurações', href: '/settings', icon: CogIcon },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-start border-b border-slate-100 bg-slate-50/50 px-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg">
                <span className="text-sm font-semibold text-white">SM</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">SoftMax</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar