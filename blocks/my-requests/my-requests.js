/**
 * My Requests Block - AEM Documents and Content Fragments Display
 * Renders links to documents stored in AEM assets repository and content fragments
 * with configurable display options, filtering, sorting, and pagination
 */

class MyRequestsBlock {
  constructor(block) {
    this.block = block;
    this.config = this.getConfig();
    this.items = [];
    this.filteredItems = [];
    this.currentPage = 1;
    this.itemsPerPage = this.config.itemsPerPage || 10;
    this.filters = {
      search: '',
      dateRange: '',
      documentType: '',
      status: ''
    };
    this.sortBy = this.config.sortBy || 'dateCreated';
    this.sortOrder = this.config.sortOrder || 'desc';
    this.displayType = this.config.displayType || 'grid';
    this.init();
  }

  getConfig() {
    // Get configuration from block attributes or default values
    const config = {};
    
    // Extract configuration from block attributes
    const style = this.block.getAttribute('data-style') || 'default';
    const displayType = this.block.getAttribute('data-display-type') || 'grid';
    const sortBy = this.block.getAttribute('data-sort-by') || 'dateCreated';
    const sortOrder = this.block.getAttribute('data-sort-order') || 'desc';
    const itemsPerPage = parseInt(this.block.getAttribute('data-items-per-page')) || 10;
    const showFilters = this.block.getAttribute('data-show-filters')?.split(',') || [];
    const showActions = this.block.getAttribute('data-show-actions')?.split(',') || [];
    
    // Folder-based configuration
    const requestsFolder = this.block.getAttribute('data-requests-folder') || '/content/dam/rs-thinkhub/requests';
    const folderStructure = this.block.getAttribute('data-folder-structure') || 'folderAsName';
    const includeSubfolders = this.block.getAttribute('data-include-subfolders') === 'true';
    const maxDepth = parseInt(this.block.getAttribute('data-max-depth')) || 0;

    return {
      title: this.block.getAttribute('data-title') || 'My Requests',
      subtitle: this.block.getAttribute('data-subtitle') || 'View and manage your submitted requests',
      style,
      displayType,
      sortBy,
      sortOrder,
      itemsPerPage,
      showFilters,
      showActions,
      requestsFolder,
      folderStructure,
      includeSubfolders,
      maxDepth
    };
  }

  async init() {
    this.createStructure();
    await this.loadItems();
    this.bindEvents();
    this.render();
  }

  createStructure() {
    this.block.innerHTML = `
      <div class="my-requests ${this.config.style}">
        <!-- Header -->
        <div class="header">
          <h2>${this.config.title}</h2>
          <p>${this.config.subtitle}</p>
        </div>

        <!-- Filters -->
        ${this.createFiltersHTML()}

        <!-- Content Container -->
        <div class="content-container">
          <div class="loading-state" id="loading-state">
            <div class="spinner"></div>
            <p>Loading your requests...</p>
          </div>
          
          <div class="empty-state" id="empty-state" style="display: none;">
            <div class="icon">📄</div>
            <h3>No requests found</h3>
            <p>You haven't submitted any requests yet. Start by creating a new request.</p>
          </div>

          <div class="${this.displayType}-layout" id="content-layout" style="display: none;">
            <!-- Items will be rendered here -->
          </div>

          <!-- Pagination -->
          <div class="pagination" id="pagination" style="display: none;">
            <!-- Pagination controls will be rendered here -->
          </div>
        </div>
      </div>
    `;
  }

  createFiltersHTML() {
    if (this.config.showFilters.length === 0) return '';

    const filterHTML = this.config.showFilters.map(filter => {
      switch (filter) {
        case 'search':
          return `
            <div class="filter-group search-box">
              <label for="search-input">Search requests</label>
              <input type="text" id="search-input" placeholder="Search by title, description, or reference number...">
            </div>
          `;
        case 'dateRange':
          return `
            <div class="filter-group">
              <label for="date-range">Date Range</label>
              <select id="date-range">
                <option value="">All dates</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="quarter">This quarter</option>
                <option value="year">This year</option>
              </select>
            </div>
          `;
        case 'documentType':
          return `
            <div class="filter-group">
              <label for="document-type">Document Type</label>
              <select id="document-type">
                <option value="">All types</option>
                <option value="request">Request</option>
                <option value="quote">Quote</option>
                <option value="order">Order</option>
                <option value="invoice">Invoice</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>
          `;
        case 'status':
          return `
            <div class="filter-group">
              <label for="status-filter">Status</label>
              <select id="status-filter">
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          `;
        default:
          return '';
      }
    }).join('');

    return `
      <div class="filters">
        <div class="filter-row">
          ${filterHTML}
        </div>
      </div>
    `;
  }

  async loadItems() {
    try {
      // Load items from the configured AEM folder
      this.items = await this.loadItemsFromFolder();
    } catch (error) {
      console.error('Error loading items from folder:', error);
      // Fallback to sample data if folder loading fails
      this.items = this.getSampleData();
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async loadItemsFromFolder() {
    // In a real implementation, this would make an AEM API call
    // For now, we'll simulate the folder-based loading
    
    const folderPath = this.config.requestsFolder;
    const folderStructure = this.config.folderStructure;
    const includeSubfolders = this.config.includeSubfolders;
    const maxDepth = this.config.maxDepth;

    // Simulate AEM folder structure with subfolder titles
    const folderData = {
      '/content/dam/rs-thinkhub/requests': {
        title: 'My Requests',
        children: {
          'industrial-automation': {
            title: 'Industrial Automation System Design', // This becomes the request name
            type: 'folder',
            dateCreated: '2024-01-15T10:30:00Z',
            dateModified: '2024-01-20T14:45:00Z',
            status: 'in-progress',
            documents: [
              {
                name: 'design-specification.pdf',
                path: '/content/dam/rs-thinkhub/requests/industrial-automation/design-specification.pdf',
                type: 'pdf',
                size: '2.5MB',
                metadataTitle: 'PLC Design Specification'
              },
              {
                name: 'requirements.docx',
                path: '/content/dam/rs-thinkhub/requests/industrial-automation/requirements.docx',
                type: 'docx',
                size: '1.2MB',
                metadataTitle: 'System Requirements Document'
              }
            ],
            contentFragments: [
              {
                name: 'automation-requirements',
                path: '/content/dam/rs-thinkhub/fragments/automation-requirements'
              }
            ]
          },
          'power-distribution': {
            title: 'Power Distribution Components Selection', // This becomes the request name
            type: 'folder',
            dateCreated: '2024-01-10T09:15:00Z',
            dateModified: '2024-01-18T16:20:00Z',
            status: 'completed',
            documents: [
              {
                name: 'component-specs.pdf',
                path: '/content/dam/rs-thinkhub/requests/power-distribution/component-specs.pdf',
                type: 'pdf',
                size: '3.1MB',
                metadataTitle: 'Power Component Specifications'
              }
            ],
            contentFragments: [
              {
                name: 'power-requirements',
                path: '/content/dam/rs-thinkhub/fragments/power-requirements'
              }
            ]
          },
          'safety-systems': {
            title: 'Safety System Integration Consultation', // This becomes the request name
            type: 'folder',
            dateCreated: '2024-01-22T11:00:00Z',
            dateModified: '2024-01-22T11:00:00Z',
            status: 'pending',
            documents: [
              {
                name: 'safety-assessment.pdf',
                path: '/content/dam/rs-thinkhub/requests/safety-systems/safety-assessment.pdf',
                type: 'pdf',
                size: '1.8MB',
                metadataTitle: 'Safety System Assessment Report'
              }
            ],
            contentFragments: [
              {
                name: 'safety-requirements',
                path: '/content/dam/rs-thinkhub/fragments/safety-requirements'
              }
            ]
          },
          'control-panels': {
            title: 'Custom Control Panel Design', // This becomes the request name
            type: 'folder',
            dateCreated: '2024-01-25T14:30:00Z',
            dateModified: '2024-01-26T09:15:00Z',
            status: 'in-progress',
            documents: [
              {
                name: 'panel-layout.pdf',
                path: '/content/dam/rs-thinkhub/requests/control-panels/panel-layout.pdf',
                type: 'pdf',
                size: '4.2MB',
                metadataTitle: 'Control Panel Layout Design'
              },
              {
                name: 'wiring-diagram.pdf',
                path: '/content/dam/rs-thinkhub/requests/control-panels/wiring-diagram.pdf',
                type: 'pdf',
                size: '2.8MB',
                metadataTitle: 'Wiring Diagram Specification'
              }
            ],
            contentFragments: [
              {
                name: 'control-panel-specs',
                path: '/content/dam/rs-thinkhub/fragments/control-panel-specs'
              }
            ]
          }
        }
      }
    };

    const items = [];
    const folder = folderData[folderPath];
    
    if (!folder) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    // Process folder structure based on configuration
    Object.entries(folder.children).forEach(([folderName, folderInfo]) => {
      if (folderStructure === 'folderAsName') {
        // Use subfolder title as request name
        const item = {
          id: `RH-${folderName.toUpperCase()}`,
          title: folderInfo.title, // This is the subfolder title
          description: `Request for ${folderInfo.title.toLowerCase()}`,
          type: 'request',
          status: folderInfo.status,
          dateCreated: folderInfo.dateCreated,
          dateModified: folderInfo.dateModified,
          documentType: 'request',
          referenceNumber: `RH-${folderName.toUpperCase()}`,
          aemPath: folderInfo.documents?.[0]?.path || '',
          contentFragment: folderInfo.contentFragments?.[0]?.path || '',
          folderName: folderName,
          documents: folderInfo.documents || [],
          contentFragments: folderInfo.contentFragments || []
        };
        items.push(item);
      } else if (folderStructure === 'subfolderStructure') {
        // Create items for each document in subfolders, using subfolder title
        folderInfo.documents?.forEach((doc, index) => {
          const item = {
            id: `RH-${folderName.toUpperCase()}-${index + 1}`,
            title: folderInfo.title, // Use subfolder title as primary title
            description: `Document: ${doc.name.replace(/\.[^/.]+$/, '')} from ${folderInfo.title}`,
            type: 'request',
            status: folderInfo.status,
            dateCreated: folderInfo.dateCreated,
            dateModified: folderInfo.dateModified,
            documentType: doc.type,
            referenceNumber: `RH-${folderName.toUpperCase()}-${index + 1}`,
            aemPath: doc.path,
            contentFragment: folderInfo.contentFragments?.[0]?.path || '',
            folderName: folderName,
            fileName: doc.name
          };
          items.push(item);
        });
      } else if (folderStructure === 'fileName') {
        // Use file names as request names, but include subfolder context
        folderInfo.documents?.forEach((doc, index) => {
          const fileName = doc.name.replace(/\.[^/.]+$/, ''); // Remove extension
          const item = {
            id: `RH-${folderName.toUpperCase()}-${index + 1}`,
            title: fileName, // Use file name as title
            description: `File from ${folderInfo.title} folder`,
            type: 'request',
            status: folderInfo.status,
            dateCreated: folderInfo.dateCreated,
            dateModified: folderInfo.dateModified,
            documentType: doc.type,
            referenceNumber: `RH-${folderName.toUpperCase()}-${index + 1}`,
            aemPath: doc.path,
            contentFragment: folderInfo.contentFragments?.[0]?.path || '',
            folderName: folderName,
            fileName: doc.name
          };
          items.push(item);
        });
      } else if (folderStructure === 'metadataTitle') {
        // Use metadata title if available, fallback to subfolder title
        folderInfo.documents?.forEach((doc, index) => {
          const item = {
            id: `RH-${folderName.toUpperCase()}-${index + 1}`,
            title: doc.metadataTitle || folderInfo.title, // Use metadata title or fallback to subfolder title
            description: `Document from ${folderInfo.title}`,
            type: 'request',
            status: folderInfo.status,
            dateCreated: folderInfo.dateCreated,
            dateModified: folderInfo.dateModified,
            documentType: doc.type,
            referenceNumber: `RH-${folderName.toUpperCase()}-${index + 1}`,
            aemPath: doc.path,
            contentFragment: folderInfo.contentFragments?.[0]?.path || '',
            folderName: folderName,
            fileName: doc.name
          };
          items.push(item);
        });
      }
    });

    return items;
  }

  getSampleData() {
    // Fallback sample data
    return [
      {
        id: 'RH-ABC123-DEF',
        title: 'Industrial Automation System Design',
        description: 'Request for design services for a new industrial automation system including PLC programming and HMI interface.',
        type: 'request',
        status: 'in-progress',
        dateCreated: '2024-01-15T10:30:00Z',
        dateModified: '2024-01-20T14:45:00Z',
        documentType: 'request',
        referenceNumber: 'RH-ABC123-DEF',
        aemPath: '/content/dam/rs-thinkhub/requests/industrial-automation-design.pdf',
        contentFragment: '/content/dam/rs-thinkhub/fragments/automation-requirements'
      },
      {
        id: 'RH-XYZ789-GHI',
        title: 'Power Distribution Components Selection',
        description: 'Need assistance selecting appropriate power distribution components for a 480V 3-phase system.',
        type: 'request',
        status: 'completed',
        dateCreated: '2024-01-10T09:15:00Z',
        dateModified: '2024-01-18T16:20:00Z',
        documentType: 'request',
        referenceNumber: 'RH-XYZ789-GHI',
        aemPath: '/content/dam/rs-thinkhub/requests/power-distribution-selection.pdf',
        contentFragment: '/content/dam/rs-thinkhub/fragments/power-requirements'
      }
    ];
  }

  bindEvents() {
    // Search filter
    const searchInput = this.block.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.search = e.target.value;
        this.applyFilters();
      });
    }

    // Date range filter
    const dateRangeSelect = this.block.querySelector('#date-range');
    if (dateRangeSelect) {
      dateRangeSelect.addEventListener('change', (e) => {
        this.filters.dateRange = e.target.value;
        this.applyFilters();
      });
    }

    // Document type filter
    const documentTypeSelect = this.block.querySelector('#document-type');
    if (documentTypeSelect) {
      documentTypeSelect.addEventListener('change', (e) => {
        this.filters.documentType = e.target.value;
        this.applyFilters();
      });
    }

    // Status filter
    const statusSelect = this.block.querySelector('#status-filter');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredItems = this.items.filter(item => {
      // Search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        const matchesSearch = 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.referenceNumber.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (this.filters.dateRange) {
        const itemDate = new Date(item.dateCreated);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (this.filters.dateRange) {
          case 'today':
            const itemToday = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
            if (itemToday.getTime() !== today.getTime()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            if (itemDate < monthAgo) return false;
            break;
          case 'quarter':
            const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            if (itemDate < quarterAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            if (itemDate < yearAgo) return false;
            break;
        }
      }

      // Document type filter
      if (this.filters.documentType && item.documentType !== this.filters.documentType) {
        return false;
      }

      // Status filter
      if (this.filters.status && item.status !== this.filters.status) {
        return false;
      }

      return true;
    });

    this.sortItems();
    this.currentPage = 1;
    this.render();
  }

  sortItems() {
    this.filteredItems.sort((a, b) => {
      let aValue, bValue;

      switch (this.sortBy) {
        case 'dateCreated':
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
          break;
        case 'dateModified':
          aValue = new Date(a.dateModified);
          bValue = new Date(b.dateModified);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        default:
          aValue = new Date(a.dateCreated);
          bValue = new Date(b.dateCreated);
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  render() {
    const loadingState = this.block.querySelector('#loading-state');
    const emptyState = this.block.querySelector('#empty-state');
    const contentLayout = this.block.querySelector('#content-layout');
    const pagination = this.block.querySelector('#pagination');

    // Hide loading state
    loadingState.style.display = 'none';

    if (this.filteredItems.length === 0) {
      emptyState.style.display = 'block';
      contentLayout.style.display = 'none';
      pagination.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    contentLayout.style.display = 'block';

    // Calculate pagination
    const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageItems = this.filteredItems.slice(startIndex, endIndex);

    // Render items
    contentLayout.innerHTML = pageItems.map(item => this.renderItem(item)).join('');

    // Render pagination
    if (totalPages > 1) {
      pagination.style.display = 'flex';
      pagination.innerHTML = this.renderPagination(totalPages);
    } else {
      pagination.style.display = 'none';
    }
  }

  renderItem(item) {
    const icon = this.getIconForType(item.documentType);
    const statusBadge = this.getStatusBadge(item.status);
    const actions = this.renderActions(item);

    switch (this.displayType) {
      case 'list':
        return `
          <div class="item" data-id="${item.id}">
            <div class="icon">${icon}</div>
            <div class="content">
              <h3>${item.title}</h3>
              <div class="meta">
                <span>${statusBadge}</span>
                <span>${this.formatDate(item.dateCreated)}</span>
                <span>${item.referenceNumber}</span>
              </div>
              <div class="description">${item.description}</div>
            </div>
            ${actions}
          </div>
        `;
      
      case 'cards':
        return `
          <div class="item" data-id="${item.id}">
            <div class="card-header">
              <div class="icon">${icon}</div>
              <h3>${item.title}</h3>
              <div class="meta">
                <span>${statusBadge}</span>
                <span>${this.formatDate(item.dateCreated)}</span>
              </div>
            </div>
            <div class="card-body">
              <div class="description">${item.description}</div>
              <div class="meta">
                <span><strong>Reference:</strong> ${item.referenceNumber}</span>
              </div>
              ${actions}
            </div>
          </div>
        `;
      
      default: // grid
        return `
          <div class="item" data-id="${item.id}">
            <div class="icon">${icon}</div>
            <h3>${item.title}</h3>
            <div class="meta">
              <span>${statusBadge}</span>
              <span>${this.formatDate(item.dateCreated)}</span>
            </div>
            <div class="description">${item.description}</div>
            <div class="meta">
              <span><strong>Reference:</strong> ${item.referenceNumber}</span>
            </div>
            ${actions}
          </div>
        `;
    }
  }

  getIconForType(type) {
    const icons = {
      'request': '📋',
      'quote': '💰',
      'order': '📦',
      'invoice': '🧾',
      'documentation': '📄'
    };
    return icons[type] || '📄';
  }

  getStatusBadge(status) {
    return `<span class="status-badge ${status}">${status.replace('-', ' ')}</span>`;
  }

  renderActions(item) {
    if (this.config.showActions.length === 0) return '';

    const actions = [];
    
    if (this.config.showActions.includes('download')) {
      actions.push(`
        <a href="${item.aemPath}" class="action-btn" target="_blank" title="Download document">
          📥 Download
        </a>
      `);
    }
    
    if (this.config.showActions.includes('share')) {
      actions.push(`
        <button class="action-btn" onclick="this.shareItem('${item.id}')" title="Share">
          📤 Share
        </button>
      `);
    }
    
    if (this.config.showActions.includes('edit')) {
      actions.push(`
        <a href="/editor.html${item.contentFragment}" class="action-btn" target="_blank" title="Edit content">
          ✏️ Edit
        </a>
      `);
    }
    
    if (this.config.showActions.includes('delete')) {
      actions.push(`
        <button class="action-btn danger" onclick="this.deleteItem('${item.id}')" title="Delete">
          🗑️ Delete
        </button>
      `);
    }

    return `<div class="actions">${actions.join('')}</div>`;
  }

  renderPagination(totalPages) {
    const pages = [];
    const currentPage = this.currentPage;

    // Previous button
    pages.push(`
      <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="this.goToPage(${currentPage - 1})">
        ← Previous
      </button>
    `);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pages.push(`
          <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="this.goToPage(${i})">
            ${i}
          </button>
        `);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pages.push('<span class="page-btn" disabled>...</span>');
      }
    }

    // Next button
    pages.push(`
      <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="this.goToPage(${currentPage + 1})">
        Next →
      </button>
    `);

    return pages.join('');
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Action methods (to be implemented based on AEM integration)
  shareItem(itemId) {
    console.log('Share item:', itemId);
    // Implement sharing functionality
  }

  deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
      console.log('Delete item:', itemId);
      // Implement deletion functionality
    }
  }
}

/**
 * Decorates the my requests block
 * @param {Element} block The my requests block element
 */
export default function decorate(block) {
  new MyRequestsBlock(block);
}
