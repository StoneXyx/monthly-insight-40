// ======================= Modal Controller =======================
const Modal = {
  open() {
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active');
  }
};

// ======================= Storage Controller =======================
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("financetrack.pro:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem("financetrack.pro:transactions", JSON.stringify(transactions));
  }
};

// ======================= Transaction Controller =======================
const Transaction = {
  all: Storage.get(),
  
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },
  
  incomes() {
    return Transaction.all
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  },
  
  expenses() {
    return Transaction.all
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
  },
  
  total() {
    return Transaction.incomes() + Transaction.expenses();
  }
};

// ======================= Filter Controller =======================
const Filter = {
  currentMonth: new Date().toISOString().slice(0, 7),
  currentCategory: 'all',
  currentGroup: 'all',
  
  init() {
    // Define o mês atual como padrão
    document.getElementById('monthFilter').value = Filter.currentMonth;
    
    // Event listeners
    document.getElementById('monthFilter').addEventListener('change', (e) => {
      Filter.currentMonth = e.target.value;
      App.reload();
    });
    
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      Filter.currentCategory = e.target.value;
      App.reload();
    });
    
    document.getElementById('groupFilter').addEventListener('change', (e) => {
      Filter.currentGroup = e.target.value;
      App.reload();
    });
  },
  
  apply() {
    return Transaction.all.filter(transaction => {
      const [year, month] = Filter.currentMonth.split('-');
      const transactionDate = Utils.parseDate(transaction.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      
      const matchesMonth = transactionMonth === Filter.currentMonth;
      const matchesCategory = Filter.currentCategory === 'all' || transaction.category === Filter.currentCategory;
      const matchesGroup = Filter.currentGroup === 'all' || transaction.group === Filter.currentGroup;
      
      return matchesMonth && matchesCategory && matchesGroup;
    });
  }
};

// ======================= DOM Controller =======================
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },
  
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    const amount = Utils.formatCurrency(transaction.amount);
    
    return `
      <td class="description">${transaction.description}</td>
      <td class="category">${transaction.category}</td>
      <td class="group">${transaction.group}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e92929' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='3 6 5 6 21 6'%3E%3C/polyline%3E%3Cpath d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'%3E%3C/path%3E%3Cline x1='10' y1='11' x2='10' y2='17'%3E%3C/line%3E%3Cline x1='14' y1='11' x2='14' y2='17'%3E%3C/line%3E%3C/svg%3E" alt="Remover" title="Remover transação">
      </td>
    `;
  },
  
  updateBalance() {
    const filtered = Filter.apply();
    
    const income = filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const total = income + expense;
    const average = filtered.length > 0 ? total / filtered.length : 0;
    
    const incomeCount = filtered.filter(t => t.amount > 0).length;
    const expenseCount = filtered.filter(t => t.amount < 0).length;
    const groupsCount = new Set(filtered.map(t => t.group)).size;
    
    document.getElementById('incomeDisplay').textContent = Utils.formatCurrency(income);
    document.getElementById('expenseDisplay').textContent = Utils.formatCurrency(expense);
    document.getElementById('totalDisplay').textContent = Utils.formatCurrency(total);
    document.getElementById('averageDisplay').textContent = Utils.formatCurrency(average);
    
    document.getElementById('incomeCount').textContent = `${incomeCount} transações`;
    document.getElementById('expenseCount').textContent = `${expenseCount} transações`;
    document.getElementById('totalGroups').textContent = `${groupsCount} grupos ativos`;
  },
  
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  }
};

// ======================= Utils =======================
const Utils = {
  formatAmount(value) {
    return Number(value) * 100;
  },
  
  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  
  parseDate(dateStr) {
    // Converte DD/MM/YYYY para Date
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  },
  
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    return signal + value;
  }
};

// ======================= Form Controller =======================
const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),
  category: document.querySelector("select#category"),
  group: document.querySelector("select#group"),
  
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
      category: Form.category.value,
      group: Form.group.value
    };
  },
  
  validateFields() {
    const { description, amount, date, category, group } = Form.getValues();
    
    if (description.trim() === "" || 
        amount.trim() === "" ||
        date.trim() === "" ||
        category.trim() === "" ||
        group.trim() === "") {
      throw new Error("Por favor, preencha todos os campos!");
    }
  },
  
  formatValues() {
    let { description, amount, date, category, group } = Form.getValues();
    
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    
    return { description, amount, date, category, group };
  },
  
  saveTransaction(transaction) {
    Transaction.add(transaction);
  },
  
  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
    Form.category.value = "";
    Form.group.value = "";
  },
  
  submit(event) {
    event.preventDefault();
    
    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      Form.saveTransaction(transaction);
      Form.clearFields();
      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  }
};

// ======================= Analytics (Charts) =======================
let incomeChartInstance;
let expenseChartInstance;
let evolutionChartInstance;

const Analytics = {
  getExpensesByCategory() {
    const filtered = Filter.apply();
    const categories = {};
    
    filtered.forEach(transaction => {
      if (transaction.amount < 0) {
        if (categories[transaction.category]) {
          categories[transaction.category] += Math.abs(transaction.amount);
        } else {
          categories[transaction.category] = Math.abs(transaction.amount);
        }
      }
    });
    
    return categories;
  },
  
  getIncomesByCategory() {
    const filtered = Filter.apply();
    const categories = {};
    
    filtered.forEach(transaction => {
      if (transaction.amount > 0) {
        if (categories[transaction.category]) {
          categories[transaction.category] += transaction.amount;
        } else {
          categories[transaction.category] = transaction.amount;
        }
      }
    });
    
    return categories;
  },
  
  getMonthlyEvolution() {
    // Pega os últimos 6 meses
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
    }
    
    const evolution = months.map(month => {
      const monthTransactions = Transaction.all.filter(t => {
        const transactionDate = Utils.parseDate(t.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        return transactionMonth === month;
      });
      
      const income = monthTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      const expense = Math.abs(monthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
      
      return {
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        income: income / 100,
        expense: expense / 100
      };
    });
    
    return evolution;
  },
  
  renderIncomeChart() {
    if (incomeChartInstance) incomeChartInstance.destroy();
    
    const ctx = document.getElementById('incomeChart')?.getContext('2d');
    if (!ctx) return;
    
    const categoryData = Analytics.getIncomesByCategory();
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData).map(value => value / 100);
    
    if (labels.length === 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = '14px Poppins';
      ctx.fillStyle = '#969cb3';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhuma receita neste período', ctx.canvas.width / 2, ctx.canvas.height / 2);
      return;
    }
    
    incomeChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Receitas (R$)',
          data: data,
          backgroundColor: [
            '#12a454',
            '#49AA26',
            '#3dd705',
            '#2D4A22',
            '#a9f98a',
            '#7ed957'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Poppins' },
              padding: 15
            }
          },
          title: {
            display: false
          }
        }
      }
    });
  },
  
  renderExpenseChart() {
    if (expenseChartInstance) expenseChartInstance.destroy();
    
    const ctx = document.getElementById('expenseChart')?.getContext('2d');
    if (!ctx) return;
    
    const categoryData = Analytics.getExpensesByCategory();
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData).map(value => value / 100);
    
    if (labels.length === 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = '14px Poppins';
      ctx.fillStyle = '#969cb3';
      ctx.textAlign = 'center';
      ctx.fillText('Nenhuma despesa neste período', ctx.canvas.width / 2, ctx.canvas.height / 2);
      return;
    }
    
    expenseChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Despesas (R$)',
          data: data,
          backgroundColor: [
            '#e92929',
            '#ff6384',
            '#c94c4c',
            '#ff8a80',
            '#a02c2c',
            '#ff4d6d'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Poppins' },
              padding: 15
            }
          },
          title: {
            display: false
          }
        }
      }
    });
  },
  
  renderEvolutionChart() {
    if (evolutionChartInstance) evolutionChartInstance.destroy();
    
    const ctx = document.getElementById('evolutionChart')?.getContext('2d');
    if (!ctx) return;
    
    const evolution = Analytics.getMonthlyEvolution();
    
    evolutionChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: evolution.map(e => e.month),
        datasets: [
          {
            label: 'Receitas',
            data: evolution.map(e => e.income),
            borderColor: '#12a454',
            backgroundColor: 'rgba(18, 164, 84, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Despesas',
            data: evolution.map(e => e.expense),
            borderColor: '#e92929',
            backgroundColor: 'rgba(233, 41, 41, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: 'Poppins' },
              padding: 15
            }
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            }
          }
        }
      }
    });
  }
};

// ======================= PDF Generator =======================
const PDF = {
  generate() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const filtered = Filter.apply();
    
    if (filtered.length === 0) {
      alert('Nenhuma transação encontrada para este período!');
      return;
    }
    
    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('💰 FinanceTrack Pro', 14, 20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório Financeiro Mensal', 14, 28);
    
    // Período
    const [year, month] = Filter.currentMonth.split('-');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Período: ${monthNames[parseInt(month) - 1]} de ${year}`, 14, 35);
    
    // Resumo
    const income = filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const total = income + expense;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumo Financeiro:', 14, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(18, 164, 84);
    doc.text(`Receitas: ${Utils.formatCurrency(income)}`, 14, 52);
    
    doc.setTextColor(233, 41, 41);
    doc.text(`Despesas: ${Utils.formatCurrency(expense)}`, 14, 58);
    
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Saldo: ${Utils.formatCurrency(total)}`, 14, 64);
    doc.setFont('helvetica', 'normal');
    
    // Linha separadora
    doc.setDrawColor(200);
    doc.line(14, 68, 196, 68);
    
    // Tabela de transações
    const tableData = filtered.map(t => [
      t.description,
      t.category,
      t.group,
      Utils.formatCurrency(t.amount),
      t.date
    ]);
    
    doc.autoTable({
      startY: 72,
      head: [['Descrição', 'Categoria', 'Grupo', 'Valor', 'Data']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [45, 74, 34],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 30, halign: 'center' }
      },
      didParseCell: function(data) {
        if (data.column.index === 3 && data.section === 'body') {
          const value = filtered[data.row.index].amount;
          if (value > 0) {
            data.cell.styles.textColor = [18, 164, 84];
          } else {
            data.cell.styles.textColor = [233, 41, 41];
          }
        }
      }
    });
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} - Página ${i} de ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Salvar
    const fileName = `relatorio-financeiro-${year}-${month}.pdf`;
    doc.save(fileName);
    
    alert('PDF gerado com sucesso!');
  }
};

// ======================= App Controller =======================
const App = {
  init() {
    Filter.init();
    
    const filtered = Filter.apply();
    
    filtered.forEach((transaction, index) => {
      DOM.addTransaction(transaction, Transaction.all.indexOf(transaction));
    });
    
    DOM.updateBalance();
    Storage.set(Transaction.all);
    
    Analytics.renderIncomeChart();
    Analytics.renderExpenseChart();
    Analytics.renderEvolutionChart();
  },
  
  reload() {
    DOM.clearTransactions();
    App.init();
  }
};

// Inicializar aplicação
App.init();