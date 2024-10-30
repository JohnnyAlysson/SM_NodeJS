const API_URL = 'http://localhost:3000';

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function validateCPF(cpf) {
    const regex = /^\d{11}$/;
    return regex.test(cpf);
}

function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Navigation
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active link
        document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding section
        const sectionId = this.dataset.section;
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        // Update page title
        document.getElementById('page-title').textContent = this.textContent.trim();
        
        // Load section data
        loadSectionData(sectionId);
    });
});

// Modal Functions
function showModal(type, data = null) {
    const modal = document.getElementById(`modal-${type}`);
    if (data) {
        // Fill form with data for editing
        Object.keys(data).forEach(key => {
            const input = document.getElementById(`${type}-${key}`);
            if (input) input.value = data[key];
        });
        modal.dataset.editId = data.id;
    } else {
        // Clear form for new entry
        const form = modal.querySelector('form');
        if (form) form.reset();
        delete modal.dataset.editId;
    }
    modal.style.display = 'block';
}

function closeModal(type) {
    const modal = document.getElementById(`modal-${type}`);
    modal.style.display = 'none';
    delete modal.dataset.editId;
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// API Functions
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        if (!response.ok) throw new Error('Erro na requisição');
        return await response.json();
    } catch (error) {
        showToast(`Erro ao carregar dados: ${error.message}`, 'error');
        return null;
    }
}

async function postData(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro ao salvar dados');
        }
        
        return result;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

async function putData(endpoint, id, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erro ao atualizar dados');
        }
        
        return result;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

async function deleteData(endpoint, id) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Erro ao excluir');
        }
        
        return await response.json();
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

// Load Section Data
async function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'clientes':
            await loadClientes();
            break;
        case 'funcionarios':
            await loadFuncionarios();
            break;
        case 'servicos':
            await loadServicos();
            break;
        case 'produtos':
            await loadProdutos();
            break;
        case 'vendas':
            await loadVendas();
            break;
    }
}

// Dashboard Functions
async function loadDashboard() {
    try {
        const [clientes, produtosBaixos, produtosMaisVendidos, servicosMaisVendidos] = await Promise.all([
            fetchData('clientes'),
            fetchData('estoque/produtos_baixos'),
            fetchData('produtos/mais_vendidos'),
            fetchData('servicos/mais_vendidos')
        ]);

        // Update dashboard cards
        document.getElementById('total-clientes').textContent = clientes ? clientes.length : '0';
        document.getElementById('produtos-baixos').textContent = produtosBaixos ? produtosBaixos.length : '0';

        // Render tables
        if (produtosMaisVendidos) {
            const produtosHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produtosMaisVendidos.map(produto => `
                            <tr>
                                <td>${produto.nome}</td>
                                <td>${produto.quantidade_vendida}</td>
                                <td>${formatMoney(produto.valor_total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('produtos-mais-vendidos').innerHTML = produtosHtml;
        }

        if (servicosMaisVendidos) {
            const servicosHtml = `
                <table>
                    <thead>
                        <tr>
                            <th>Serviço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${servicosMaisVendidos.map(servico => `
                            <tr>
                                <td>${servico.nome}</td>
                                <td>${servico.quantidade_vendida}</td>
                                <td>${formatMoney(servico.valor_total)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('servicos-mais-vendidos').innerHTML = servicosHtml;
        }
    } catch (error) {
        showToast('Erro ao carregar dashboard', 'error');
    }
}

// Clientes Functions
async function loadClientes() {
    const clientes = await fetchData('clientes');
    if (clientes) {
        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map(cliente => `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${formatCPF(cliente.cpf)}</td>
                            <td>
                                <button onclick="showModal('cliente', ${JSON.stringify(cliente)})" class="btn-edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteCliente(${cliente.id})" class="btn-delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('clientes-table').innerHTML = tableHtml;
    }
}

// Funcionários Functions
async function loadFuncionarios() {
    const funcionarios = await fetchData('funcionarios');
    if (funcionarios) {
        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Especialidade</th>
                        <th>Salário</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${funcionarios.map(funcionario => `
                        <tr>
                            <td>${funcionario.nome}</td>
                            <td>${formatCPF(funcionario.cpf)}</td>
                            <td>${funcionario.especialidade}</td>
                            <td>${formatMoney(funcionario.salario)}</td>
                            <td>
                                <button onclick="showModal('funcionario', ${JSON.stringify(funcionario)})" class="btn-edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteFuncionario(${funcionario.id})" class="btn-delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('funcionarios-table').innerHTML = tableHtml;
    }
}

// Produtos Functions
async function loadProdutos() {
    const produtos = await fetchData('produtos');
    if (produtos) {
        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${produtos.map(produto => `
                        <tr>
                            <td>${produto.nome}</td>
                            <td>${formatMoney(produto.preco)}</td>
                            <td>${produto.qtde}</td>
                            <td>
                                <button onclick="showModal('produto', ${JSON.stringify(produto)})" class="btn-edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteProduto(${produto.id})" class="btn-delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('produtos-table').innerHTML = tableHtml;
    }
}

// Serviços Functions
async function loadServicos() {
    const servicos = await fetchData('servicos');
    if (servicos) {
        const tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicos.map(servico => `
                        <tr>
                            <td>${servico.nome}</td>
                            <td>${formatMoney(servico.preco)}</td>
                            <td>
                                <button onclick="showModal('servico', ${JSON.stringify(servico)})" class="btn-edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteServico(${servico.id})" class="btn-delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('servicos-table').innerHTML = tableHtml;
    }
}

// Vendas Functions
async function loadVendas() {
    try {
        const [vendasProdutos, vendasServicos] = await Promise.all([
            fetchData('vendas_produtos'),
            fetchData('vendas_servicos')
        ]);

        const vendasProdutosHtml = vendasProdutos ? `
            <h3>Vendas de Produtos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Produto</th>
                    </tr>
                </thead>
                <tbody>
                    ${vendasProdutos.map(venda => `
                        <tr>
                            <td>${formatDate(venda.data)}</td>
                            <td>${venda.id_cliente}</td>
                            <td>${venda.id_produto}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>Nenhuma venda de produto registrada</p>';

        const vendasServicosHtml = vendasServicos ? `
            <h3>Vendas de Serviços</h3>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Funcionário</th>
                    </tr>
                </thead>
                <tbody>
                    ${vendasServicos.map(venda => `
                        <tr>
                            <td>${formatDate(venda.data)}</td>
                            <td>${venda.id_cliente}</td>
                            <td>${venda.id_servico}</td>
                            <td>${venda.id_funcionario}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        ` : '<p>Nenhuma venda de serviço registrada</p>';

        document.getElementById('vendas-content').innerHTML = vendasProdutosHtml + vendasServicosHtml;
    } catch (error) {
        showToast('Erro ao carregar vendas', 'error');
    }
}

// Form Handlers
document.querySelectorAll('.modal form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formType = form.id.replace('form-', '');
        const modal = document.getElementById(`modal-${formType}`);
        const isEdit = modal.dataset.editId;
        const formData = {};
        
        // Get all form inputs
        form.querySelectorAll('input').forEach(input => {
            formData[input.id.replace(`${formType}-`, '')] = input.value;
        });

        try {
            if (isEdit) {
                await putData(formType, modal.dataset.editId, formData);
                showToast(`${formType} atualizado com sucesso`);
            } else {
                await postData(formType, formData);
                showToast(`${formType} adicionado com sucesso`);
            }
            
            closeModal(formType);
            loadSectionData(formType + 's');
            form.reset();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});

// Delete Functions
async function deleteCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            await deleteData('cliente', id);
            showToast('Cliente excluído com sucesso');
            loadClientes();
        } catch (error) {
            showToast('Erro ao excluir cliente', 'error');
        }
    }
}

async function deleteFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        try {
            await deleteData('funcionario', id);
            showToast('Funcionário excluído com sucesso');
            loadFuncionarios();
        } catch (error) {
            showToast('Erro ao excluir funcionário', 'error');
        }
    }
}

async function deleteProduto(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            await deleteData('produto', id);
            showToast('Produto excluído com sucesso');
            loadProdutos();
        } catch (error) {
            showToast('Erro ao excluir produto', 'error');
        }
    }
}

async function deleteServico(id) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
        try {
            await deleteData('servico', id);
            showToast('Serviço excluído com sucesso');
            loadServicos();
        } catch (error) {
            showToast('Erro ao excluir serviço', 'error');
        }
    }
}

// Nova Venda Functions
async function iniciarVendaProduto() {
  try {
      const [clientes, produtos] = await Promise.all([
          fetchData('clientes'),
          fetchData('produtos')
      ]);

      const modal = document.getElementById('modal-vendas_produtos'); // Verifique este ID
      const form = modal.querySelector('form');
      
      const clientesSelect = form.querySelector('#vendas_produtos-cliente'); // E estes IDs
      const produtosSelect = form.querySelector('#vendas_produtos-produto');
      
      clientesSelect.innerHTML = clientes.map(cliente => 
          `<option value="${cliente.id}">${cliente.nome}</option>`
      ).join('');
      
      produtosSelect.innerHTML = produtos.map(produto => 
          `<option value="${produto.id}">${produto.nome} - ${formatMoney(produto.preco)}</option>`
      ).join('');
      
      showModal('vendas_produtos');
  } catch (error) {
      showToast('Erro ao carregar dados para venda', 'error');
  }
}

async function iniciarVendaServico() {
    try {
        const [clientes, servicos, funcionarios] = await Promise.all([
            fetchData('clientes'),
            fetchData('servicos'),
            fetchData('funcionarios')
        ]);

        const modal = document.getElementById('modal-vendas_servicos');
        const form = modal.querySelector('form');
        
        const clientesSelect = form.querySelector('#vendas_servicos-cliente');
        const servicosSelect = form.querySelector('#vendas_servicos-servico');
        const funcionariosSelect = form.querySelector('#vendas_servicos-funcionario');
        
        clientesSelect.innerHTML = clientes.map(cliente => 
            `<option value="${cliente.id}">${cliente.nome}</option>`
        ).join('');
        
        servicosSelect.innerHTML = servicos.map(servico => 
            `<option value="${servico.id}">${servico.nome} - ${formatMoney(servico.preco)}</option>`
        ).join('');
        
        funcionariosSelect.innerHTML = funcionarios.map(funcionario => 
            `<option value="${funcionario.id}">${funcionario.nome}</option>`
        ).join('');
        
        showModal('vendas_servicos');
    } catch (error) {
        showToast('Erro ao carregar dados para venda', 'error');
    }
}

// Vendas Form Handlers
document.getElementById('form-vendas_produtos').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        id_cliente: document.getElementById('vendas_produtos-cliente').value,
        id_produto: document.getElementById('vendas_produtos-produto').value
    };

    try {
        await postData('vendas_produtos', formData);
        showToast('Venda realizada com sucesso');
        closeModal('vendas_produtos');
        loadVendas();
        e.target.reset();
    } catch (error) {
        showToast(error.message, 'error');
    }
});

document.getElementById('form-vendas_servicos').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        id_cliente: document.getElementById('vendas_servicos-cliente').value,
        id_servico: document.getElementById('vendas_servicos-servico').value,
        id_funcionario: document.getElementById('vendas_servicos-funcionario').value
    };

    try {
        await postData('vendas_servicos', formData);
        showToast('Venda realizada com sucesso');
        closeModal('vendas_servicos');
        loadVendas();
        e.target.reset();
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Input Masks e Validações
document.querySelectorAll('input[id$="-cpf"]').forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
    });
});

document.querySelectorAll('input[id$="-preco"], input[id$="-salario"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = value;
    });
});

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    loadSectionData('dashboard');
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});