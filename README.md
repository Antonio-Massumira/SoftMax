# SoftMax - Sistema de Gestão de Vendas

Um sistema completo de gestão de vendas desenvolvido com React, Vite, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** - Login, registro e gerenciamento de usuários
- ✅ **Dashboard interativo** - Estatísticas e gráficos de vendas em tempo real
- ✅ **Gestão de Produtos** - CRUD completo com upload de imagens
- ✅ **Gestão de Fornecedores** - Cadastro e controle de fornecedores
- ✅ **Sistema de Caixa** - Interface para processamento de vendas
- ✅ **Relatórios avançados** - Gráficos detalhados e exportação de dados
- ✅ **Configurações de usuário** - Edição de perfil e preferências
- ✅ **Design responsivo** - Interface adaptável para desktop e mobile

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Gráficos**: Recharts
- **Roteamento**: React Router
- **Formulários**: React Hook Form + Zod
- **Notificações**: React Hot Toast
- **Ícones**: Heroicons

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta no Supabase

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Antonio-Massumira/SoftMax.git
cd SoftMax
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 🗄️ Configuração do Banco de Dados

Execute os seguintes comandos SQL no seu projeto Supabase:

```sql
-- Tabela de produtos
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 0,
    category_id UUID,
    supplier_id UUID,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fornecedores
CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens de venda
CREATE TABLE sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (exemplo - ajuste conforme necessário)
CREATE POLICY "Users can view all products" ON products FOR SELECT USING (true);
CREATE POLICY "Users can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Users can delete products" ON products FOR DELETE USING (true);

-- Repita para outras tabelas conforme necessário
```

## 🚀 Como Executar

1. **Desenvolvimento**:
```bash
npm run dev
```

2. **Build para produção**:
```bash
npm run build
```

3. **Preview da build**:
```bash
npm run preview
```

## 📱 Como Usar

1. **Acesse o sistema** em `http://localhost:5173`
2. **Crie uma conta** ou faça login
3. **Configure seus produtos** na seção Produtos
4. **Cadastre fornecedores** se necessário
5. **Use o caixa** para processar vendas
6. **Visualize relatórios** para acompanhar o desempenho

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal
│   ├── Sidebar.tsx     # Barra lateral de navegação
│   ├── Navbar.tsx      # Barra superior
│   ├── Footer.tsx      # Rodapé
│   └── ProtectedRoute.tsx # Proteção de rotas
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Products.tsx    # Gestão de produtos
│   ├── Suppliers.tsx   # Gestão de fornecedores
│   ├── Cashier.tsx     # Sistema de caixa
│   ├── Reports.tsx     # Relatórios
│   ├── Settings.tsx    # Configurações
│   ├── Login.tsx       # Página de login
│   └── Register.tsx    # Página de registro
├── contexts/           # Contextos React
│   └── AuthContext.tsx # Contexto de autenticação
├── lib/               # Configurações e utilitários
│   └── supabase.ts    # Cliente Supabase
└── hooks/             # Hooks customizados
```

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Cores**: Tons de azul (primary) e cinza (secondary)
- **Tipografia**: Font system stack
- **Espaçamento**: Scale do Tailwind CSS
- **Componentes**: Design consistente e acessível

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) no banco de dados
- Validação de dados no frontend e backend
- Proteção de rotas sensíveis

## 📈 Performance

- Code splitting automático com Vite
- Otimização de imagens
- Lazy loading de componentes
- Bundle size otimizado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Antonio Massumira**
- GitHub: [@Antonio-Massumira](https://github.com/Antonio-Massumira)

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:
1. Verifique as [Issues existentes](https://github.com/Antonio-Massumira/SoftMax/issues)
2. Crie uma nova Issue se necessário
3. Consulte a documentação do Supabase

---

Feito com ❤️ para facilitar a gestão de vendas de pequenos e médios negócios.
