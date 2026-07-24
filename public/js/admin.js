/**
 * LeadDesk Mini - Admin Dashboard Client Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const filterBtns = document.querySelectorAll('.filter-status-btn');
  const tbody = document.getElementById('leads-tbody');
  const visibleCountEl = document.getElementById('visible-count');
  const refreshBtn = document.getElementById('refresh-btn');
  const adminToast = document.getElementById('admin-toast');
  const toastMessage = document.getElementById('toast-message');

  let activeStatusFilter = 'All';

  // Attach status change listeners to initial dropdowns
  bindStatusSelectEvents();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.trim();
      if (clearSearchBtn) {
        if (val.length > 0) {
          clearSearchBtn.classList.remove('d-none');
        } else {
          clearSearchBtn.classList.add('d-none');
        }
      }
      filterRows();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearSearchBtn.classList.add('d-none');
      filterRows();
    });
  }

  // Filter button handlers
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach((b) => b.classList.add('btn-outline-secondary'));

      btn.classList.remove('btn-outline-secondary');
      btn.classList.add('active', 'btn-primary');

      activeStatusFilter = btn.dataset.status;
      filterRows();
    });
  });

  // Filter table rows
  function filterRows() {
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const rows = tbody.querySelectorAll('tr:not(#empty-state-row)');

    let visibleCount = 0;

    rows.forEach((row) => {
      const name = row.dataset.name || '';
      const email = row.dataset.email || '';
      const budget = row.dataset.budget || '';
      const status = row.dataset.status || '';

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        budget.toLowerCase().includes(searchTerm) ||
        status.toLowerCase().includes(searchTerm);

      const matchesStatus =
        activeStatusFilter === 'All' || status === activeStatusFilter;

      if (matchesSearch && matchesStatus) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visibleCount;

    // Toggle Empty State row
    let emptyRow = document.getElementById('empty-state-row');
    if (visibleCount === 0) {
      if (!emptyRow) {
        emptyRow = document.createElement('tr');
        emptyRow.id = 'empty-state-row';
        emptyRow.innerHTML = `
          <td colspan="6" class="text-center py-5">
            <div class="py-4">
              <i class="bi bi-search fs-1 text-secondary mb-3 d-block"></i>
              <h5 class="text-light fw-medium">No matching leads found</h5>
              <p class="text-muted small mb-0">Try adjusting your search query or status filter.</p>
            </div>
          </td>
        `;
        tbody.appendChild(emptyRow);
      } else {
        emptyRow.style.display = '';
      }
    } else if (emptyRow) {
      emptyRow.style.display = 'none';
    }
  }

  // Bind Status Dropdown Change Events (AJAX PATCH)
  function bindStatusSelectEvents() {
    const statusSelects = document.querySelectorAll('.status-select');

    statusSelects.forEach((select) => {
      // Remove existing event listener if re-binding
      select.replaceWith(select.cloneNode(true));
    });

    // Re-query newly cloned selects
    document.querySelectorAll('.status-select').forEach((select) => {
      select.addEventListener('change', async function () {
        const leadId = this.dataset.id;
        const newStatus = this.value;
        const parentCell = this.closest('td');
        const parentRow = this.closest('tr');
        const spinner = parentCell.querySelector('.status-spinner');

        // Visual feedback during update
        this.disabled = true;
        if (spinner) spinner.classList.remove('d-none');

        try {
          const response = await fetch(`/api/leads/${leadId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
          });

          const result = await response.json();

          if (response.status === 401) {
            showToast('danger', 'Session expired. Redirecting to login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
            return;
          }

          if (!response.ok || !result.success) {
            showToast('danger', result.message || 'Failed to update status.');
          } else {
            // Success update!
            showToast('success', `Status updated to "${newStatus}"!`);

            // Update status badge class
            this.className = `form-select form-select-sm status-select status-badge-${newStatus.toLowerCase()} rounded-pill px-3 py-1 fw-semibold cursor-pointer border-0`;
            
            // Update data attribute on row for search filtering
            if (parentRow) {
              parentRow.dataset.status = newStatus;
            }

            // Update Metric Stat Counters dynamically
            if (result.stats) {
              updateStatCounters(result.stats);
            }

            // Re-apply filtering
            filterRows();
          }
        } catch (err) {
          console.error('[Update Status Error]:', err);
          showToast('danger', 'Network error. Status could not be updated.');
        } finally {
          this.disabled = false;
          if (spinner) spinner.classList.add('d-none');
        }
      });
    });
  }

  // Dynamically update Metric Stat Cards
  function updateStatCounters(stats) {
    const totalEl = document.getElementById('stat-total');
    const newEl = document.getElementById('stat-new');
    const contactedEl = document.getElementById('stat-contacted');
    const closedEl = document.getElementById('stat-closed');

    if (totalEl && stats.total !== undefined) totalEl.textContent = stats.total;
    if (newEl && stats.new !== undefined) newEl.textContent = stats.new;
    if (contactedEl && stats.contacted !== undefined) contactedEl.textContent = stats.contacted;
    if (closedEl && stats.closed !== undefined) closedEl.textContent = stats.closed;
  }

  // Toast Notification Helper
  function showToast(type, message) {
    if (!adminToast || !toastMessage) return;

    adminToast.className = `alert alert-${type} alert-dismissible fade show rounded-3 mb-4 shadow-sm border-0`;
    toastMessage.textContent = message;
    adminToast.classList.remove('d-none');

    setTimeout(() => {
      adminToast.classList.add('d-none');
    }, 4000);
  }

  // Refresh Button Handler
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      const icon = refreshBtn.querySelector('i');
      if (icon) icon.classList.add('spin-animation');

      try {
        const response = await fetch('/api/leads');
        
        if (response.status === 401) {
          showToast('danger', 'Session expired. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          return;
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          renderTableRows(result.data);
          if (result.stats) updateStatCounters(result.stats);
          showToast('success', 'Lead data refreshed!');
        }
      } catch (err) {
        showToast('danger', 'Failed to refresh data.');
      } finally {
        refreshBtn.disabled = false;
        if (icon) icon.classList.remove('spin-animation');
      }
    });
  }

  // Render Table Rows dynamically
  function renderTableRows(leads) {
    tbody.innerHTML = '';

    if (leads.length === 0) {
      tbody.innerHTML = `
        <tr id="empty-state-row">
          <td colspan="6" class="text-center py-5">
            <div class="py-4">
              <i class="bi bi-inbox fs-1 text-secondary mb-3 d-block"></i>
              <h5 class="text-light fw-medium">No leads found</h5>
              <p class="text-muted small mb-3">Submissions from the lead form will appear here dynamically.</p>
              <a href="/#lead-form" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                Submit Sample Lead
              </a>
            </div>
          </td>
        </tr>
      `;
      if (visibleCountEl) visibleCountEl.textContent = '0';
      return;
    }

    leads.forEach((lead) => {
      const dateFormatted = new Date(lead.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const tr = document.createElement('tr');
      tr.id = `lead-row-${lead._id}`;
      tr.dataset.name = (lead.name || '').toLowerCase();
      tr.dataset.email = (lead.email || '').toLowerCase();
      tr.dataset.budget = lead.budget || '';
      tr.dataset.status = lead.status || 'New';

      tr.innerHTML = `
        <td class="px-4 py-3">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-circle rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center">
              ${(lead.name || 'L').charAt(0).toUpperCase()}
            </div>
            <div>
              <span class="fw-semibold text-white d-block">${escapeHtml(lead.name)}</span>
            </div>
          </div>
        </td>
        <td class="px-3 py-3 text-light-muted">
          <a href="mailto:${escapeHtml(lead.email)}" class="text-decoration-none text-light-muted hover-white">
            <i class="bi bi-envelope me-1 text-secondary"></i>${escapeHtml(lead.email)}
          </a>
        </td>
        <td class="px-3 py-3">
          <span class="badge bg-secondary-subtle text-light border border-secondary-subtle px-2 py-1 rounded-2">
            ${escapeHtml(lead.budget)}
          </span>
        </td>
        <td class="px-3 py-3 text-light-muted fs-7">
          <div class="message-truncate" title="${escapeHtml(lead.message)}">
            ${escapeHtml(lead.message)}
          </div>
        </td>
        <td class="px-3 py-3 text-secondary fs-7">
          ${dateFormatted}
        </td>
        <td class="px-4 py-3 text-end">
          <div class="d-inline-block position-relative">
            <select 
              class="form-select form-select-sm status-select status-badge-${(lead.status || 'new').toLowerCase()} rounded-pill px-3 py-1 fw-semibold cursor-pointer border-0" 
              data-id="${lead._id}"
              aria-label="Lead Status"
            >
              <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Closed" ${lead.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
            <span class="status-spinner spinner-border spinner-border-sm position-absolute top-50 start-0 translate-middle-y ms-2 d-none" role="status"></span>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });

    bindStatusSelectEvents();
    filterRows();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
