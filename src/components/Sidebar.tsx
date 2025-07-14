import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  ChartBarIcon,
  CashIcon,
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
  { name: 'Caixa', href: '/cashier', icon: CashIcon },
  { name: 'Configurações', href: '/settings', icon: CogIcon },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">SoftMax</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              SoftMax Sales v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar