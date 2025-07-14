import React, { useState, useEffect } from 'react'
import { PlusIcon, MinusIcon, TrashIcon, BanknotesIcon, PrinterIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { supabase, type Product } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface CartItem {
  product: Product
  quantity: number
}

const Cashier: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [processing, setProcessing] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('quantity', 0)
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar produtos')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.error('Quantidade em estoque insuficiente')
        return
      }
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (product && newQuantity > product.quantity) {
      toast.error('Quantidade em estoque insuficiente')
      return
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  // Função para gerar e imprimir recibo em PDF
  const generateReceipt = () => {
    if (cart.length === 0) {
      toast.error('Carrinho está vazio')
      return
    }

    const currentDate = new Date().toLocaleString('pt-BR', {
      timeZone: 'Africa/Maputo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const paymentMethodText = {
      cash: 'Dinheiro',
      card: 'Cartão',
      transfer: 'Transferência'
    }

    // Criar conteúdo HTML do recibo
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Recibo de Venda - SoftMax</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .system-name {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .date {
              font-size: 11px;
              color: #666;
            }
            .items {
              margin: 20px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px dotted #ccc;
            }
            .item-info {
              flex: 1;
            }
            .item-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            .item-details {
              font-size: 10px;
              color: #666;
            }
            .item-total {
              font-weight: bold;
              text-align: right;
              min-width: 80px;
            }
            .summary {
              border-top: 2px solid #333;
              padding-top: 15px;
              margin-top: 20px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-row {
              font-size: 16px;
              font-weight: bold;
              border-top: 1px solid #333;
              padding-top: 8px;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px dotted #ccc;
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">SoftMax Sales</div>
            <div class="system-name">Sistema de Gestão de Vendas</div>
            <div class="date">Data: ${currentDate}</div>
          </div>

          <div class="items">
            ${cart.map(item => `
              <div class="item">
                <div class="item-info">
                  <div class="item-name">${item.product.name}</div>
                  <div class="item-details">
                    ${item.quantity}x MZN ${item.product.price.toFixed(2)}
                  </div>
                </div>
                <div class="item-total">
                  MZN ${(item.quantity * item.product.price).toFixed(2)}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>MZN ${getTotal().toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Forma de Pagamento:</span>
              <span>${paymentMethodText[paymentMethod]}</span>
            </div>
            <div class="summary-row total-row">
              <span>TOTAL:</span>
              <span>MZN ${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Operador: ${user?.user_metadata?.name || 'Antonio Massumira'}</p>
            <p>Obrigado pela sua preferência!</p>
            <p>SoftMax Sales Management System v1.0</p>
          </div>
        </body>
      </html>
    `

    // Abrir nova janela e imprimir
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        printWindow.print()
        printWindow.close()
      }
      
      toast.success('Recibo gerado com sucesso!')
    } else {
      toast.error('Erro ao abrir janela de impressão')
    }
  }

  const processSale = async () => {
    if (cart.length === 0) {
      toast.error('Carrinho está vazio')
      return
    }

    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    setProcessing(true)
    try {
      // Create sale record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          total: getTotal(),
          payment_method: paymentMethod,
          user_id: user.id,
        }])
        .select()
        .single()

      if (saleError) throw saleError

      // Create sale items
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // Update product quantities
      for (const item of cart) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            quantity: item.product.quantity - item.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.product.id)

        if (updateError) throw updateError
      }

      // Gerar recibo antes de limpar o carrinho
      generateReceipt()

      toast.success('Venda realizada com sucesso!')
      setCart([])
      fetchProducts() // Refresh product quantities
    } catch (error: any) {
      toast.error('Erro ao processar venda')
      console.error('Error processing sale:', error)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caixa</h1>
          <p className="mt-2 text-gray-600">Selecione os produtos para venda</p>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Sem imagem</span>
                </div>
              )}
              <h3 className="font-medium text-sm text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-primary-600 font-semibold">
                MZN {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Estoque: {product.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Carrinho de Compras
        </h2>

        {/* Cart Items */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Carrinho vazio
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    R$ {item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-red-400 hover:text-red-600 ml-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            {/* Payment Method */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="cash">Dinheiro</option>
                <option value="card">Cartão</option>
                <option value="transfer">Transferência</option>
              </select>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  MZN {getTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={processSale}
                disabled={processing}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BanknotesIcon className="h-5 w-5 mr-2" />
                {processing ? 'Processando...' : 'Finalizar Venda'}
              </button>
              
              {/* Botão para Imprimir Recibo */}
              <button
                onClick={generateReceipt}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Imprimir Recibo
              </button>
              
              <button
                onClick={() => setCart([])}
                className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Limpar Carrinho
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cashier