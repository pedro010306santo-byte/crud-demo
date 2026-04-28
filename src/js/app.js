const API = 'api/users.php';

async function loadUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="empty">Carregando...</td></tr>';

  try {
    const res  = await fetch(API);
    const data = await res.json();

    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum usuário cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.created_at}</td>
        <td>
          <button class="action-btn edit" onclick="editUser(${u.id}, '${u.name}', '${u.email}')">✏️ Editar</button>
          <button class="action-btn delete" onclick="deleteUser(${u.id})">🗑️ Excluir</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Erro ao carregar usuários.</td></tr>';
  }
}

async function saveUser() {
  const id    = document.getElementById('edit-id').value;
  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) { showMsg('Preencha nome e e-mail.', 'error'); return; }

  const isEdit = !!id;
  const url    = isEdit ? `${API}?id=${id}` : API;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) });
    const data = await res.json();

    if (!res.ok) { showMsg(data.error || 'Erro ao salvar.', 'error'); return; }

    showMsg(isEdit ? 'Usuário atualizado!' : 'Usuário criado!', 'success');
    clearForm();
    loadUsers();
  } catch (e) {
    showMsg('Erro de conexão.', 'error');
  }
}

async function deleteUser(id) {
  if (!confirm('Remover este usuário?')) return;
  try {
    const res  = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    showMsg(data.message || data.error, res.ok ? 'success' : 'error');
    loadUsers();
  } catch (e) {
    showMsg('Erro ao excluir.', 'error');
  }
}

function editUser(id, name, email) {
  document.getElementById('edit-id').value  = id;
  document.getElementById('name').value     = name;
  document.getElementById('email').value    = email;
  document.getElementById('form-title').textContent = `Editando usuário #${id}`;
  document.getElementById('btn-cancel').classList.remove('hidden');
  document.getElementById('name').focus();
}

function cancelEdit() {
  clearForm();
  showMsg('', '');
}

function clearForm() {
  document.getElementById('edit-id').value  = '';
  document.getElementById('name').value     = '';
  document.getElementById('email').value    = '';
  document.getElementById('form-title').textContent = 'Novo Usuário';
  document.getElementById('btn-cancel').classList.add('hidden');
}

function showMsg(text, type) {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className   = `msg ${type}`;
  if (!text) el.classList.add('hidden');
}

// Init
loadUsers();
