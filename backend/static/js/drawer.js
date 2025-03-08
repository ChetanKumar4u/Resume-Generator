class DrawerHandler {
    constructor() {
        this.drawer = document.getElementById('drawer');
        this.toggleBtn = document.getElementById('drawer-toggle');
        this.closeBtn = document.getElementById('drawer-close');
        this.overlay = document.getElementById('drawer-overlay');
        this.container = document.querySelector('.container');
        this.isPermanentlyHidden = localStorage.getItem('drawerHidden') === 'true';
        this.body = document.body;
        this.mainContent = document.querySelector('.form-container');
        this.previewContainer = document.querySelector('.preview-container');
        
        // Add template options
        this.templates = [
            { id: 'classic', name: 'Classic', icon: 'fa-file-alt' },
            { id: 'modern', name: 'Modern', icon: 'fa-laptop-code' },
            { id: 'minimal', name: 'Minimal', icon: 'fa-feather' },
            { id: 'executive', name: 'Executive', icon: 'fa-briefcase' },
            { id: 'impact', name: 'Impact', icon: 'fa-bolt' }, // Impact template
            { id: 'unique', name: 'Unique', icon: 'fa-fingerprint' } // New Unique template
        ];
    }

    init() {
        // Set initial state based on saved preference
        if (this.isPermanentlyHidden) {
            this.hideDrawer();
        } else {
            this.showDrawer();
        }

        // Add event listeners
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle button clicked');
                this.togglePermanentState();
            });
        }
        
        // Fix close button event listener
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button clicked');
                this.closeDrawer();
            });
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeDrawer());
        }
        
        // Add escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
            }
        });

        // Add resize listener
        window.addEventListener('resize', () => this.updateContainerPosition());
        
        // Initial update
        this.updateContainerPosition();
        this.updateToggleButton();
        
        // Render template options
        this.renderTemplateOptions();
        
        // Debug log
        console.log('Drawer handler initialized', {
            drawer: this.drawer,
            toggleBtn: this.toggleBtn,
            closeBtn: this.closeBtn,
            overlay: this.overlay,
            isPermanentlyHidden: this.isPermanentlyHidden
        });
    }
    
    // Add method to render template options
    renderTemplateOptions() {
        const templateSelector = this.drawer.querySelector('.template-selector');
        if (!templateSelector) return;
        
        // Clear existing options
        templateSelector.innerHTML = '';
        
        // Get current template
        const currentTemplate = window.currentTemplate || 'classic';
        
        // Add template options
        this.templates.forEach(template => {
            const option = document.createElement('div');
            option.className = `template-option ${template.id === currentTemplate ? 'selected' : ''}`;
            option.onclick = () => this.selectTemplate(template.id);
            
            // Create consistent button structure
            option.innerHTML = `
                <div class="template-option-content">
                    <div class="template-icon">
                        <i class="fas ${template.icon}"></i>
                    </div>
                    <div class="template-info">
                        <h3>${template.name}</h3>
                        <span class="template-description">${this.getTemplateDescription(template.id)}</span>
                    </div>
                    <div class="template-select-indicator">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            `;
            
            templateSelector.appendChild(option);
        });

        // Add styles for the template options
        if (!document.getElementById('template-option-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'template-option-styles';
            styleEl.textContent = `
                .template-option {
                    background: #ffffff;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 0.75rem;
                    position: relative;
                    overflow: hidden;
                }

                .dark .template-option {
                    background: #1e1e2e;
                    border-color: #2d2d3a;
                }

                .template-option:hover {
                    transform: translateX(5px);
                    border-color: #6c5ce7;
                    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.1);
                }

                .template-option.selected {
                    background: #6c5ce7;
                    border-color: #6c5ce7;
                    color: white;
                }

                .dark .template-option.selected {
                    background: #8b5cf6;
                    border-color: #8b5cf6;
                }

                .template-option-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .template-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(108, 92, 231, 0.1);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .template-option.selected .template-icon {
                    background: rgba(255, 255, 255, 0.2);
                }

                .template-icon i {
                    font-size: 1.25rem;
                    color: #6c5ce7;
                    transition: all 0.3s ease;
                }

                .template-option.selected .template-icon i {
                    color: white;
                }

                .template-info {
                    flex: 1;
                }

                .template-info h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                    margin-bottom: 0.25rem;
                }

                .template-description {
                    font-size: 0.875rem;
                    color: #64748b;
                    display: block;
                }

                .template-option.selected .template-description {
                    color: rgba(255, 255, 255, 0.8);
                }

                .template-select-indicator {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(108, 92, 231, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    opacity: 0;
                }

                .template-option.selected .template-select-indicator {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }

                .template-select-indicator i {
                    font-size: 0.875rem;
                    color: #6c5ce7;
                }

                .template-option.selected .template-select-indicator i {
                    color: white;
                }

                /* Hover effect */
                .template-option::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }

                .template-option:hover::after {
                    transform: translateX(100%);
                }
            `;
            document.head.appendChild(styleEl);
        }
    }

    // Helper method to get template descriptions
    getTemplateDescription(templateId) {
        const descriptions = {
            'classic': 'Traditional and professional design',
            'modern': 'Contemporary and creative layout',
            'minimal': 'Clean and simple appearance',
            'executive': 'Sophisticated and elegant style',
            'impact': 'Bold and dynamic presentation',
            'unique': 'Distinctive split-layout design'
        };
        return descriptions[templateId] || '';
    }

    // Add method to select template
    selectTemplate(templateId) {
        // Update selected template
        window.currentTemplate = templateId;
        
        // Update template options
        const options = this.drawer.querySelectorAll('.template-option');
        options.forEach(option => {
            option.classList.remove('selected');
            if (option.querySelector('h3').textContent === this.templates.find(t => t.id === templateId).name) {
                option.classList.add('selected');
            }
        });
        
        // Update preview
        if (typeof window.updatePreview === 'function') {
            window.updatePreview();
        }
    }

    toggleDrawer() {
        if (this.drawer.classList.contains('open')) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    togglePermanentState() {
        console.log('Toggling permanent state, current state:', this.isPermanentlyHidden);
        if (this.isPermanentlyHidden) {
            this.showDrawer();
        } else {
            this.hideDrawer();
        }
        this.updateToggleButton();
    }

    openDrawer() {
        console.log('Opening drawer');
        this.drawer.classList.add('open');
        this.drawer.style.transform = 'translateX(0)';
        
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            this.overlay.style.opacity = '1';
            this.overlay.style.pointerEvents = 'auto';
        }
        
        this.body.style.overflow = 'hidden';
        
        // Update container position
        this.updateContainerPosition();
        
        // Add animation class to content
        if (this.mainContent) {
            this.mainContent.classList.add('content-shifted');
        }
        
        if (this.previewContainer) {
            this.previewContainer.classList.add('content-shifted');
        }
    }

    closeDrawer() {
        console.log('Closing drawer');
        this.drawer.classList.remove('open');
        
        if (window.innerWidth < 1024) {
            this.drawer.style.transform = 'translateX(-100%)';
            
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                this.overlay.style.pointerEvents = 'none';
                setTimeout(() => {
                    this.overlay.classList.add('hidden');
                }, 300);
            }
        }
        
        this.body.style.overflow = '';
        
        // Update container position
        this.updateContainerPosition();
        
        // Remove animation class from content
        if (this.mainContent) {
            this.mainContent.classList.remove('content-shifted');
        }
        
        if (this.previewContainer) {
            this.previewContainer.classList.remove('content-shifted');
        }
    }

    hideDrawer() {
        console.log('Hiding drawer permanently');
        this.isPermanentlyHidden = true;
        localStorage.setItem('drawerHidden', 'true');
        document.body.classList.add('drawer-hidden');
        this.drawer.style.transform = 'translateX(-100%)';
        
        // Update container position
        this.updateContainerPosition();
        
        // Remove animation class from content
        if (this.mainContent) {
            this.mainContent.classList.remove('content-shifted');
        }
        
        if (this.previewContainer) {
            this.previewContainer.classList.remove('content-shifted');
        }
    }

    showDrawer() {
        console.log('Showing drawer permanently');
        this.isPermanentlyHidden = false;
        localStorage.setItem('drawerHidden', 'false');
        document.body.classList.remove('drawer-hidden');
        this.drawer.style.transform = 'translateX(0)';
        
        // Update container position
        this.updateContainerPosition();
        
        // Add animation class to content
        if (this.mainContent) {
            this.mainContent.classList.add('content-shifted');
        }
        
        if (this.previewContainer) {
            this.previewContainer.classList.add('content-shifted');
        }
    }

    updateToggleButton() {
        if (this.toggleBtn) {
            if (this.isPermanentlyHidden) {
                this.toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
                this.toggleBtn.title = 'Show Drawer';
            } else {
                this.toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                this.toggleBtn.title = 'Hide Drawer';
            }
        }
    }

    updateContainerPosition() {
        if (!this.container) return;
        
        const isDesktop = window.innerWidth >= 1024;
        
        if (isDesktop) {
            if (!this.isPermanentlyHidden) {
                // Drawer is visible on desktop
                this.container.style.marginLeft = '300px';
                this.container.style.width = 'calc(100% - 300px)';
                this.container.style.maxWidth = 'none';
                this.container.style.transition = 'margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            } else {
                // Drawer is hidden on desktop
                this.container.style.marginLeft = '0';
                this.container.style.width = '100%';
                this.container.style.maxWidth = '1200px';
                this.container.style.transition = 'margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        } else {
            // Mobile view
            this.container.style.marginLeft = '0';
            this.container.style.width = '100%';
            this.container.style.maxWidth = 'none';
        }
    }
}

// Initialize the drawer handler when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.drawerHandler = new DrawerHandler();
    window.drawerHandler.init();
}); 