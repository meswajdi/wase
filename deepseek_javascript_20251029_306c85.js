// État global de l'application
class WazeEcoloIA {
    constructor() {
        this.state = {
            currentTab: 'dashboard',
            vehicles: [
                {
                    id: 'vehicule_1',
                    name: 'Camion Hybride 20t',
                    type: 'hybrid',
                    capacity: 15,
                    co2PerKm: 0.25,
                    costPerKm: 0.70,
                    status: 'available',
                    description: 'Camion 20t hybride'
                },
                {
                    id: 'vehicule_2', 
                    name: 'Fourgon Électrique',
                    type: 'electric',
                    capacity: 4,
                    co2PerKm: 0.005,
                    costPerKm: 0.12,
                    autonomy: 300,
                    status: 'available',
                    description: 'Fourgon électrique'
                },
                {
                    id: 'vehicule_3',
                    name: 'Avion Court-Courrier',
                    type: 'air',
                    capacity: 5,
                    co2PerKm: 0.25,
                    costPerKm: 8.50,
                    status: 'available',
                    description: 'Avion court-courrier'
                },
                {
                    id: 'vehicule_4',
                    name: 'Utilitaire Diesel',
                    type: 'diesel',
                    capacity: 2,
                    co2PerKm: 0.18,
                    costPerKm: 0.50,
                    status: 'maintenance',
                    description: 'Utilitaire diesel'
                },
                {
                    id: 'vehicule_5',
                    name: 'Camion Électrique 40t',
                    type: 'electric',
                    capacity: 26,
                    co2PerKm: 0.02,
                    costPerKm: 0.45,
                    autonomy: 400,
                    status: 'available',
                    description: 'Camion 40t électrique'
                }
            ],
            deliveries: [],
            currentDelivery: null,
            stats: {
                co2Saved: 1247,
                distanceOptimized: 8456,
                aiRecommendations: 156,
                aiAccuracy: 98.2,
                co2Reduction: 67,
                costSavings: 42,
                timeSavings: 35
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.updateVehiclesList();
        this.updateFleetView();
        this.updateRecentDeliveries();
        this.showNotification('Application Waze Écolo IA chargée avec succès!', 'success');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = this.getAttribute('item, 'data-tab');
                this.showTab(tab);
            });
        });

        // Form submissions
        document.getElementById('departure')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startDelivery();
        });
        
        document.getElementById('destination')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startDelivery();
        });

        // Analysis form
        document.getElementById('analysis-departure')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.runAnalysis();
        });
    }

    showTab(tabName) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Afficher le contenu
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName)?.classList.add('active');

        this.state.currentTab = tabName;

        // Actions spécifiques par onglet
        if (tabName === 'realtime' && this.state.currentDelivery) {
            this.updateRealTimeDisplay(this.state.currentDelivery);
        }
    }

    // Fonctions de livraison
    async startDelivery() {
        const departure = document.getElementById('departure')?.value || 'Paris, France';
        const destination = document.getElementById('destination')?.value || 'Lyon, France';
        const volume = parseInt(document.getElementById('volume')?.value) || 10;
        const driver = document.getElementById('driver')?.value || 'Chauffeur IA';
        const priority = document.querySelector('input[name="priority"]:checked')?.value || 'balanced';

        if (!departure || !destination) {
            this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        this.showLoading('Analyse IA en cours...');

        // Simulation d'analyse IA
        setTimeout(() => {
            this.hideLoading();
            const analysis = this.simulateIAAnalysis(departure, destination, volume, priority);
            this.showResultsModal(analysis);
        }, 2000);
    }

    simulateIAAnalysis(departure, destination, volume, priority) {
        const distance = Math.random() * 800 + 200; // 200-1000 km
        
        const options = [
            {
                type: 'optimal',
                vehicle: 'Camion Hybride 20t',
                time: Math.round(distance / 65 * 60),
                co2: Math.round(distance * 0.25),
                cost: Math.round(distance * 0.70 + distance * 0.05),
                description: 'Solution équilibrée recommandée par IA'
            },
            {
                type: 'fast',
                vehicle: 'Avion Court-Courrier',
                time: Math.round(distance / 800 * 60 + 120),
                co2: Math.round(distance * 0.25),
                cost: Math.round(distance * 8.50 + 500),
                description: 'Le plus rapide - Idéal pour urgences'
            },
            {
                type: 'eco',
                vehicle: 'Fourgon Électrique',
                time: Math.round(distance / 60 * 60),
                co2: Math.round(distance * 0.005),
                cost: Math.round(distance * 0.12 + (distance > 300 ? 50 : 0)),
                description: 'Le plus écologique - Impact CO₂ minimal'
            },
            {
                type: 'economic',
                vehicle: 'Utilitaire Diesel',
                time: Math.round(distance / 70 * 60),
                co2: Math.round(distance * 0.18),
                cost: Math.round(distance * 0.50 + distance * 0.05),
                description: 'Le plus économique - Coût réduit'
            }
        ];

        return {
            departure,
            destination,
            distance: Math.round(distance),
            volume,
            options,
            priority
        };
    }

    showResultsModal(analysis) {
        // Créer une modal dynamique
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-robot"></i> Résultats de l'analyse IA</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="analysis-summary">
                        <div class="route-info">
                            <h4>📊 Analyse d'itinéraire</h4>
                            <p><strong>${analysis.departure}</strong> → <strong>${analysis.destination}</strong></p>
                            <p>Distance: <strong>${analysis.distance} km</strong> | Volume: <strong>${analysis.volume} m³</strong></p>
                        </div>
                        
                        <div class="options-grid">
                            ${analysis.options.map(option => `
                                <div class="option-card ${option.type}">
                                    <div class="option-header">
                                        <h5>${this.getOptionTitle(option.type)}</h5>
                                        <span class="option-badge ${option.type}">${this.getOptionBadge(option.type)}</span>
                                    </div>
                                    <div class="option-details">
                                        <p><i class="fas fa-truck"></i> ${option.vehicle}</p>
                                        <p><i class="fas fa-clock"></i> ${option.time} min</p>
                                        <p><i class="fas fa-leaf"></i> ${option.co2} kg CO₂</p>
                                        <p><i class="fas fa-euro-sign"></i> ${option.cost} €</p>
                                    </div>
                                    <p class="option-description">${option.description}</p>
                                    <button class="btn btn-primary btn-sm" onclick="wazeApp.selectOption('${option.type}', ${analysis.distance}, ${analysis.volume})">
                                        Choisir cette option
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    selectOption(optionType, distance, volume) {
        document.querySelector('.modal')?.remove();
        this.showLoading('Démarrage de la livraison...');
        
        setTimeout(() => {
            this.hideLoading();
            
            const delivery = {
                id: Date.now(),
                departure: document.getElementById('departure')?.value || 'Paris, France',
                destination: document.getElementById('destination')?.value || 'Lyon, France',
                distance,
                volume,
                option: optionType,
                status: 'in_progress',
                startTime: new Date(),
                progress: 0
            };
            
            this.state.currentDelivery = delivery;
            this.state.deliveries.unshift(delivery);
            
            this.showNotification('Livraison démarrée avec succès!', 'success');
            this.showTab('realtime');
            this.startRealTimeTracking(delivery);
            this.updateRecentDeliveries();
        }, 1500);
    }

    // Suivi temps réel
    startRealTimeTracking(delivery) {
        let progress = 0;
        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
                delivery.status = 'completed';
                delivery.endTime = new Date();
                this.showNotification('Livraison terminée!', 'success');
                this.updateRecentDeliveries();
                return;
            }
            
            progress += Math.random() * 5;
            delivery.progress = Math.min(progress, 100);
            this.updateRealTimeDisplay(delivery);
        }, 2000);
    }

    updateRealTimeDisplay(delivery) {
        const element = document.getElementById('active-delivery');
        if (!element) return;

        const progress = delivery.progress;
        
        element.innerHTML = `
            <div class="delivery-active">
                <div class="delivery-route">
                    <span class="from">${delivery.departure}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="to">${delivery.destination}</span>
                </div>
                <div class="delivery-stats">
                    <div class="delivery-stat">
                        <span>Progression</span>
                        <strong>${Math.round(progress)}%</strong>
                    </div>
                    <div class="delivery-stat">
                        <span>Distance parcourue</span>
                        <strong>${Math.round(delivery.distance * progress / 100)} km</strong>
                    </div>
                    <div class="delivery-stat">
                        <span>Temps écoulé</span>
                        <strong>${Math.round((new Date() - delivery.startTime) / 60000)} min</strong>
                    </div>
                </div>
            </div>
        `;
        
        // Mettre à jour les stats temps réel
        this.updateElementText('rt-distance', Math.round(delivery.distance * progress / 100) + ' km');
        this.updateElementText('rt-time', Math.round((new Date() - delivery.startTime) / 60000) + ' min');
        this.updateElementText('rt-co2', Math.round(delivery.distance * 0.2 * progress / 100) + ' kg');
        this.updateElementText('rt-progress', Math.round(progress) + '%');
    }

    // Analyse de route
    async runAnalysis() {
        const departure = document.getElementById('analysis-departure')?.value || 'Paris, France';
        const destination = document.getElementById('analysis-destination')?.value || 'Lyon, France';
        const volume = parseInt(document.getElementById('analysis-volume')?.value) || 10;

        if (!departure || !destination) {
            this.showNotification('Veuillez spécifier le départ et la destination', 'error');
            return;
        }

        this.showLoading('Analyse IA avancée...');

        setTimeout(() => {
            this.hideLoading();
            const analysis = this.simulateDetailedAnalysis(departure, destination, volume);
            this.displayAnalysisResults(analysis);
        }, 3000);
    }

    simulateDetailedAnalysis(departure, destination, volume) {
        const distance = Math.random() * 1500 + 100; // 100-1600 km
        
        return {
            departure,
            destination,
            distance: Math.round(distance),
            volume,
            recommendations: [
                {
                    type: 'electric',
                    score: 0.92,
                    vehicles: ['Fourgon Électrique', 'Camion Électrique 40t'],
                    advantages: ['Émissions CO₂ minimales', 'Coûts d\'exploitation réduits', 'Silencieux'],
                    considerations: ['Autonomie limitée', 'Temps de recharge']
                },
                {
                    type: 'hybrid',
                    score: 0.85,
                    vehicles: ['Camion Hybride 20t', 'Fourgon Hybride'],
                    advantages: ['Bon compromis écologie/performance', 'Autonomie étendue', 'Polyvalent'],
                    considerations: ['Coût d\'acquisition plus élevé', 'Entretien complexe']
                },
                {
                    type: 'air',
                    score: distance > 800 ? 0.78 : 0.45,
                    vehicles: ['Avion Court-Courrier', 'Avion Long-Courrier'],
                    advantages: ['Extrêmement rapide', 'Idéal longues distances', 'Fiable'],
                    considerations: ['Coût élevé', 'Émissions importantes', 'Restrictions volume']
                }
            ],
            insights: [
                distance < 300 ? 'Court trajet - Véhicule électrique recommandé' :
                distance < 600 ? 'Distance moyenne - Solution hybride optimale' :
                'Long trajet - Envisager transport aérien'
            ]
        };
    }

    displayAnalysisResults(analysis) {
        const container = document.getElementById('analysis-results');
        if (!container) return;
        
        container.innerHTML = `
            <div class="analysis-header">
                <h3>🧠 Analyse IA détaillée</h3>
                <div class="route-summary">
                    <p><strong>${analysis.departure}</strong> → <strong>${analysis.destination}</strong></p>
                    <p>Distance: <strong>${analysis.distance} km</strong> | Volume: <strong>${analysis.volume} m³</strong></p>
                </div>
            </div>
            
            <div class="recommendations-grid">
                ${analysis.recommendations.map(rec => `
                    <div class="recommendation-card ${rec.type}">
                        <div class="rec-header">
                            <h4>${this.getVehicleTypeTitle(rec.type)}</h4>
                            <div class="rec-score">
                                <span class="score-value">${Math.round(rec.score * 100)}%</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${rec.score * 100}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="rec-vehicles">
                            <strong>Véhicules compatibles:</strong>
                            <div class="vehicle-tags">
                                ${rec.vehicles.map(v => `<span class="vehicle-tag">${v}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="rec-advantages">
                            <strong>Avantages:</strong>
                            <ul>
                                ${rec.advantages.map(adv => `<li>${adv}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="rec-considerations">
                            <strong>Considérations:</strong>
                            <ul>
                                ${rec.considerations.map(cons => `<li>${cons}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="insights-section">
                <h4>💡 Insights IA</h4>
                <div class="insights-list">
                    ${analysis.insights.map(insight => `<div class="insight-item">${insight}</div>`).join('')}
                </div>
            </div>
            
            <div class="analysis-actions">
                <button class="btn btn-primary" onclick="wazeApp.showTab('new-delivery')">
                    <i class="fas fa-rocket"></i>
                    Démarrer une livraison
                </button>
            </div>
        `;
    }

    // Mise à jour des vues
    updateVehiclesList() {
        const container = document.getElementById('vehicles-list');
        if (!container) return;

        container.innerHTML = this.state.vehicles.map(vehicle => `
            <div class="vehicle-item ${vehicle.status}">
                <div class="vehicle-icon-small ${vehicle.type}">
                    <i class="${this.getVehicleIcon(vehicle.type)}"></i>
                </div>
                <div class="vehicle-info">
                    <strong>${vehicle.name}</strong>
                    <span>${vehicle.description}</span>
                </div>
                <div class="vehicle-status ${vehicle.status}"></div>
            </div>
        `).join('');
    }

    updateFleetView() {
        const container = document.getElementById('vehicles-grid');
        if (!container) return;

        container.innerHTML = this.state.vehicles.map(vehicle => `
            <div class="vehicle-card">
                <div class="vehicle-header">
                    <div class="vehicle-icon ${vehicle.type}">
                        <i class="${this.getVehicleIcon(vehicle.type)}"></i>
                    </div>
                    <div>
                        <h4>${vehicle.name}</h4>
                        <p class="vehicle-desc">${vehicle.description}</p>
                    </div>
                </div>
                
                <div class="vehicle-specs">
                    <div class="spec">
                        <span class="spec-label">Capacité</span>
                        <span class="spec-value">${vehicle.capacity} m³</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">CO₂/km</span>
                        <span class="spec-value">${vehicle.co2PerKm} kg</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Coût/km</span>
                        <span class="spec-value">${vehicle.costPerKm} €</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Statut</span>
                        <span class="spec-value status-${vehicle.status}">${this.getStatusText(vehicle.status)}</span>
                    </div>
                </div>
                
                ${vehicle.autonomy ? `
                    <div class="vehicle-autonomy">
                        <i class="fas fa-bolt"></i>
                        Autonomie: ${vehicle.autonomy} km
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    updateRecentDeliveries() {
        const container = document.getElementById('recent-deliveries');
        if (!container) return;

        const recent = this.state.deliveries.slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-history"></i>
                    <p>Aucune livraison récente</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recent.map(delivery => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-shipping-fast"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-route">
                        ${delivery.departure} → ${delivery.destination}
                    </div>
                    <div class="activity-details">
                        <span>${delivery.distance} km</span>
                        <span>•</span>
                        <span>${delivery.volume} m³</span>
                        <span>•</span>
                        <span class="status-${delivery.status}">${this.getDeliveryStatusText(delivery.status)}</span>
                    </div>
                </div>
                <div class="activity-time">
                    ${this.formatTime(delivery.startTime)}
                </div>
            </div>
        `).join('');
    }

    loadDashboardData() {
        // Mettre à jour les statistiques du dashboard
        this.updateElementText('co2-saved', this.formatNumber(this.state.stats.co2Saved) + ' kg CO₂');
        this.updateElementText('distance-optimized', this.formatNumber(this.state.stats.distanceOptimized) + ' km');
        this.updateElementText('ai-recommendations', this.formatNumber(this.state.stats.aiRecommendations));
        
        this.updateElementText('ai-accuracy', this.state.stats.aiAccuracy + '%');
        this.updateElementText('co2-reduction', '-' + this.state.stats.co2Reduction + '%');
        this.updateElementText('cost-savings', '-' + this.state.stats.costSavings + '%');
        this.updateElementText('time-savings', '-' + this.state.stats.timeSavings + '%');

        // Mettre à jour les stats de la flotte
        this.updateElementText('total-vehicles', this.state.vehicles.length);
        this.updateElementText('electric-vehicles', this.state.vehicles.filter(v => v.type === 'electric').length);
        this.updateElementText('fuel-vehicles', this.state.vehicles.filter(v => v.type === 'diesel').length);
        this.updateElementText('air-vehicles', this.state.vehicles.filter(v => v.type === 'air').length);
    }

    // Utilitaires d'interface
    showLoading(message = 'Chargement...') {
        const loading = document.getElementById('loading');
        const messageEl = document.getElementById('loading-message');
        if (loading && messageEl) {
            messageEl.textContent = message;
            loading.style.display = 'flex';
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    // Fonctions utilitaires
    getVehicleIcon(type) {
        const icons = {
            electric: 'fa-bolt',
            hybrid: 'fa-car-battery',
            diesel: 'fa-gas-pump',
            air: 'fa-plane'
        };
        return icons[type] || 'fa-truck';
    }

    getStatusText(status) {
        const texts = {
            available: 'Disponible',
            maintenance: 'Maintenance',
            in_use: 'En cours',
            unavailable: 'Indisponible'
        };
        return texts[status] || status;
    }

    getDeliveryStatusText(status) {
        const texts = {
            in_progress: 'En cours',
            completed: 'Terminée',
            cancelled: 'Annulée'
        };
        return texts[status] || status;
    }

    getOptionTitle(type) {
        const titles = {
            optimal: '🏆 Optimum IA',
            fast: '⚡ Plus Rapide',
            eco: '🌿 Plus Écologique',
            economic: '💰 Plus Économique'
        };
        return titles[type] || type;
    }

    getOptionBadge(type) {
        const badges = {
            optimal: 'Recommandé',
            fast: 'Rapide',
            eco: 'Écolo',
            economic: 'Économique'
        };
        return badges[type] || type;
    }

    getVehicleTypeTitle(type) {
        const titles = {
            electric: '⚡ Électrique',
            hybrid: '🔋 Hybride',
            air: '✈️ Aérien',
            diesel: '⛽ Diesel'
        };
        return titles[type] || type;
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    getAttribute(element, attribute) {
        return element.getAttribute(attribute);
    }
}

// Initialisation de l'application
let wazeApp;

document.addEventListener('DOMContentLoaded', function() {
    wazeApp = new WazeEcoloIA();
    
    // Raccourcis globaux pour les événements HTML
    window.showTab = (tabName) => wazeApp.showTab(tabName);
    window.startDelivery = () => wazeApp.startDelivery();
    window.runAnalysis = () => wazeApp.runAnalysis();
    window.initMap = () => {
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = `
                <div class="map-simulation">
                    <div class="map-overlay">
                        <i class="fas fa-map-marked-alt"></i>
                        <h3>Carte temps réel active</h3>
                        <p>Surveillance des livraisons en cours</p>
                        <div class="map-legend">
                            <div class="legend-item">
                                <span class="legend-color electric"></span>
                                Véhicules électriques
                            </div>
                            <div class="legend-item">
                                <span class="legend-color hybrid"></span>
                                Véhicules hybrides
                            </div>
                            <div class="legend-item">
                                <span class="legend-color air"></span>
                                Transport aérien
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    };
});

// Gestion des erreurs
window.addEventListener('error', function(e) {
    console.error('Erreur application:', e.error);
    if (wazeApp) {
        wazeApp.showNotification('Une erreur est survenue', 'error');
    }
});