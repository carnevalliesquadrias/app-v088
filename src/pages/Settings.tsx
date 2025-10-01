import React, { useState } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Shield, User, Mail, Clock, Settings as SettingsIcon, Users, LogOut, FileText, Database, Package, ChevronRight, UserCog, Palette, Archive, Building } from 'lucide-react';
import { useAuth, User as UserType } from '../contexts/AuthContext';
import UserModal from '../components/UserModal';
import PDFSettingsModal from '../components/PDFSettingsModal';
import CompanySettingsModal from '../components/CompanySettingsModal';
import ImportExportModal from '../components/ImportExportModal';
import ProductSettingsModal from '../components/ProductSettingsModal';

const Settings: React.FC = () => {
  const { users, user: currentUser, deleteUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isProductSettingsModalOpen, setIsProductSettingsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'users' | 'system' | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) {
      alert('Você não pode excluir seu próprio usuário!');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(userId);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getRoleText = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Usuário';
  };

  // Verificar se o usuário atual é admin
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-gray-400 mb-4">
              <Shield className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              Acesso Restrito
            </h3>
            <p className="text-gray-400">
              Apenas administradores podem acessar as configurações do sistema
            </p>
          </div>
        </div>
      </div>
    );
  }

  const settingsMenuItems = [
    {
      id: 'users',
      title: 'Gerenciamento de Usuários',
      description: 'Adicionar, editar e gerenciar usuários do sistema',
      icon: UserCog,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'system',
      title: 'Configurações do Sistema',
      description: 'PDFs, produtos, importação e exportação de dados',
      icon: SettingsIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const systemSubItems = [
    {
      id: 'pdf',
      title: 'Configurações de PDF',
      description: 'Personalizar aparência dos documentos gerados',
      icon: FileText,
      color: 'text-blue-600',
      action: () => setIsPDFModalOpen(true)
    },
    {
      id: 'company',
      title: 'Dados da Empresa',
      description: 'Informações básicas, fiscais e bancárias',
      companyIcon: Building,
      color: 'text-indigo-600',
      action: () => setIsCompanyModalOpen(true)
    },
    {
      id: 'products',
      title: 'Configurações de Produtos',
      description: 'Categorias, unidades e alertas de estoque',
      icon: Package,
      color: 'text-purple-600',
      action: () => setIsProductSettingsModalOpen(true)
    },
    {
      id: 'import-export',
      title: 'Importar/Exportar Dados',
      description: 'Backup e migração de dados do sistema',
      icon: Database,
      color: 'text-green-600',
      action: () => setIsImportExportModalOpen(true)
    }
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-amber-600" />
            Configurações do Sistema
          </h1>
          <p className="text-gray-600 mt-1">Gerencie usuários e configurações</p>
        </div>
        <div className="flex space-x-3">
          {activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Archive className="h-5 w-5" />
              <span>Voltar ao Menu</span>
            </button>
          )}
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {!activeSection && (
        <>
          {/* Menu Principal de Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`${item.bgColor} ${item.borderColor} border-2 rounded-xl p-8 text-left hover:shadow-lg transition-all duration-200 hover:scale-105 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-full bg-white ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <ChevronRight className={`h-6 w-6 ${item.color} group-hover:translate-x-1 transition-transform duration-200`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </button>
              );
            })}
          </div>

          {/* Informações do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.active).length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Administradores</p>
                  <p className="text-3xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Seção de Usuários */}
      {activeSection === 'users' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Usuário</span>
            </button>
          </div>

          {/* Barra de Busca */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                              {user.id === currentUser?.id && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                  Você
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-500 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-400">
                  Tente ajustar os termos de busca
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Seção de Configurações do Sistema */}
      {activeSection === 'system' && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h2>
            <p className="text-gray-600 mt-1">Personalize o comportamento e aparência do sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemSubItems.map((item) => {
              // Use companyIcon for the company item, otherwise use icon
              const Icon = item.companyIcon || item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 hover:scale-105 hover:border-gray-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gray-50 ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={handleModalClose}
        />
      )}

      {/* Modal de Configurações PDF */}
      {isPDFModalOpen && (
        <PDFSettingsModal onClose={() => setIsPDFModalOpen(false)} />
      )}

      {/* Modal de Configurações da Empresa */}
      {isCompanyModalOpen && (
        <CompanySettingsModal onClose={() => setIsCompanyModalOpen(false)} />
      )}

      {/* Modal de Importar/Exportar */}
      {isImportExportModalOpen && (
        <ImportExportModal onClose={() => setIsImportExportModalOpen(false)} />
      )}

      {/* Modal de Configurações de Produtos */}
      {isProductSettingsModalOpen && (
        <ProductSettingsModal onClose={() => setIsProductSettingsModalOpen(false)} />
      )}
    </div>
  );
};

export default Settings;