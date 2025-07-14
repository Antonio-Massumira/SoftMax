import React, { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { supabase, type Product } from '../lib/supabase'

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    image_url: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar produtos')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || formData.price <= 0) {
      toast.error('Nome e preço são obrigatórios')
      return
    }

    setSubmitting(true)

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            quantity: formData.quantity,
            image_url: formData.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id)

        if (error) throw error
        toast.success('Produto atualizado com sucesso!')
      } else {
        const { error } = await supabase
          .from('products')
          .insert([
            {
              name: formData.name,
              description: formData.description,
              price: formData.price,
              quantity: formData.quantity,
              image_url: formData.image_url,
            },
          ])

        if (error) throw error
        toast.success('Produto criado com sucesso!')
      }

      setIsModalOpen(false)
      setEditingProduct(null)
      setFormData({ name: '', description: '', price: 0, quantity: 0, image_url: '' })
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar produto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      image_url: product.image_url || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      toast.success('Produto excluído com sucesso!')
      fetchProducts()
    } catch (error: any) {
      toast.error('Erro ao excluir produto')
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: 0, quantity: 0, image_url: '' })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) return
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: 0, quantity: 0, image_url: '' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Produtos</h1>
          <p className="mt-1 text-sm text-slate-500">Gerencie seu estoque de produtos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-1 aspect-h-1 w-full">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-slate-50 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-slate-300" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-base font-medium text-slate-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {product.description || 'Sem descrição'}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    MZN {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500">
                    Estoque: {product.quantity}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <PhotoIcon className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-medium text-slate-900">
            Nenhum produto encontrado
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Comece criando um novo produto.
          </p>
          <div className="mt-6">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Novo Produto
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={closeModal}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome *</label>
                    <input
                      type="text"
                      required
                      disabled={submitting}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição</label>
                    <textarea
                      rows={3}
                      disabled={submitting}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg resize-none"
                      placeholder="Descrição do produto"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Preço *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        disabled={submitting}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        disabled={submitting}
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">URL da Imagem</label>
                    <input
                      type="url"
                      disabled={submitting}
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white rounded-lg disabled:bg-slate-400"
                >
                  {submitting ? (editingProduct ? 'Atualizando...' : 'Criando...') : (editingProduct ? 'Atualizar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
