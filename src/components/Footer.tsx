import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2024 SoftMax. Todos os direitos reservados.
          </div>
          <div className="text-sm text-gray-600">
            Sistema de Gestão de Vendas v1.0
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer