# 📘 Documentation - Atlas SmartFactory

## Table des matières

1. [Installation](#installation)
2. [Architecture](#architecture)
3. [Modules](#modules)
4. [API Documentation](#api-documentation)
5. [Déploiement](#déploiement)
6. [Manuels Utilisateurs](#manuels-utilisateurs)

---

## Installation

### Démarrage rapide avec Docker

```bash
# 1. Cloner le projet
git clone <repo> atlas_factory
cd atlas_factory

# 2. Configurer les variables d'environnement
cp backend/.env.example backend/.env

# 3. Démarrer les services
docker-compose up

# 4. Initialiser la base de données (premier démarrage)
docker exec atlas_backend npm run seed
```

### Installation manuelle (développement)

```bash
# Backend
cd backend
npm install
npm run dev  # Démarre sur http://localhost:5000

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev  # Démarre sur http://localhost:3000
```

---

## Architecture

### Schéma général

```
┌─────────────────────────────────────────┐
│       Clients (Web + Mobile)             │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐         ┌────▼────┐
    │ Frontend │         │ Mobile  │
    │  React   │         │ RN/Flttr│
    └────┬─────┘         └────┬────┘
         │                    │
         └─────────┬──────────┘
                   │ Socket.io
         ┌─────────▼──────────┐
         │   Backend API      │
         │  Node.js/Express   │
         └─────────┬──────────┘
         ┌─────────▼──────────┐
         │  PostgreSQL + IoT  │
         │      TimeSeries    │
         └────────────────────┘
```

### Couches applicatives

**Frontend (React)**
- Components réutilisables
- State management (Zustand)
- API client (Axios)
- Pages par module

**Backend (Express)**
- Routes modulaires
- Controllers pour logique métier
- Modèles (Sequelize ORM)
- Services pour intégrations IoT

**Base de données**
- PostgreSQL: Données transactionnelles
- TimeSeries DB: Lectures capteurs (futur)

---

## Modules

### Module 1: Traçabilité 📦

**Objectif**: 100% traçabilité digitale chaque lot

**Données principales**:
- Lot ID + QR Code
- Historique d'états
- Température/Humidité
- Alertes chaîne du froid

**Endpoints**:
```
GET    /api/traceability              # Tous les lots
POST   /api/traceability              # Créer lot
GET    /api/traceability/:id          # Détails
PATCH  /api/traceability/:id/status   # Changer statut
```

### Module 2: IoT & Température 🌡️

**Objectif**: Monitoring temps réel des températures

**Capteurs**:
- Chambres froides (-20 à 0°C)
- Zones découpe (10-15°C)
- Emballage (15-20°C)
- Expédition (-25 à -15°C)

**Endpoints**:
```
GET    /api/iot                   # Tous les capteurs
POST   /api/iot                   # Ajouter capteur
PATCH  /api/iot/:id/reading       # Nouvelle lecture
```

**Seuils d'alerte**:
- Dépassement min/max
- Rupture de lecture (timeout)
- Anomalie prédictive (futur IA)

### Modules 3-8 (En cours de dev)

Les 6 autres modules suivront la même structure:
- Modèles de données
- Routes API
- Contrôleurs
- Frontend pages
- Tests

---

## API Documentation

### Format requêtes

```bash
# Header requis
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

# Exemple
curl -H "Authorization: Bearer xyz..." \
     http://localhost:5000/api/traceability
```

### Erreurs standards

```json
{
  "error": "Message d'erreur descriptif"
}
```

**Codes HTTP**:
- `200`: OK
- `201`: Créé
- `400`: Erreur validation
- `401`: Non authentifié
- `403`: Non autorisé
- `404`: Non trouvé
- `500`: Erreur serveur

---

## Déploiement

### Sur AWS

```bash
# 1. Configuration AWS (EC2 + RDS)
# - Instance t3.medium (Backend)
# - Instance t3.medium (Frontend)
# - RDS PostgreSQL

# 2. Déployer avec CI/CD (GitHub Actions)
# Voir .github/workflows/deploy.yml

# 3. Configuration DNS
# atlas-smartfactory.com → ALB
```

### Sur Azure

```bash
# 1. Créer App Services
az appservice plan create --resource-group atlas \
  --name atlas-plan --sku B2

# 2. Déployer conteneurs
az webapp create --resource-group atlas \
  --plan atlas-plan --name atlas-backend \
  --deployment-container-image-name ...
```

### Sur OVH/Cloud classique

```bash
# Via Docker Swarm ou Kubernetes
docker swarm init
docker stack deploy -c docker-compose.yml atlas
```

---

## Manuels Utilisateurs

### Interface Directeur Général

1. **Tableau de Bord** → KPIs, alertes critiques
2. **Alertes en temps réel** → Notifications push
3. **Rapports exportables** → PDF, Excel
4. **Prévisions IA** → Recommandations

### Interface Responsable Qualité

1. **Contrôles HACCP** → Checklists digitales
2. **Alertes lots** → Blocages auto qualité
3. **Rapports conformité** → Audit ready
4. **Historique** → Traçabilité complète

### Interface Opérateur (Tablette)

1. **Mode simplifié** → 3 boutons max
2. **Procédures vidéo** → Mode hors ligne
3. **Alertes visuelles** → Code couleur
4. **Validation 1 clic**

---

## Support

📧 support@atlas-smartfactory.com
📞 +212 6XX XXX XXX
🕐 Lun-Ven: 8h-18h (GMT+1)

---

*Dernière mise à jour: Décembre 2025*
