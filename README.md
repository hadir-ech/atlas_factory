# Atlas SmartFactory

Plateforme digitale complète pour transformation agro-alimentaire - **Atlas Viandes Agro-Industries**

## 🎯 Vue d'ensemble

**Atlas SmartFactory** est une solution modulaire, intelligente et pilotée par les données pour digitaliser l'ensemble des processus d'une usine agro-alimentaire.

### Objectifs principaux
- ✅ 100% traçabilité des lots (QR Code)
- ✅ Surveillance IoT temps réel des températures
- ✅ Contrôles qualité digitalisés (HACCP)
- ✅ Optimisation de la production (Mini-MES)
- ✅ Maintenance intelligente et prédictive
- ✅ Interface opérateurs simplifiée
- ✅ Espace commercial B2B
- ✅ Dashboards et reporting PowerBI

## 📋 8 Modules Fonctionnels

| Module | Description | État |
|--------|-------------|------|
| **Traçabilité** | QR Code, historique, alertes | ✅ En développement |
| **IoT & Température** | Capteurs temps réel, seuils | ✅ En développement |
| **Contrôle Qualité** | HACCP, checklists digitales | 🔄 À venir |
| **Production (MES)** | Planning, TRG, flux | 🔄 À venir |
| **Maintenance** | Machines, interventions, prédictif | 🔄 À venir |
| **Opérateurs** | Interface tablette simplifiée | 🔄 À venir |
| **Commercial B2B** | CRM, commandes, site | 🔄 À venir |
| **Dashboards** | PowerBI, KPIs, rapports | 🔄 À venir |

## 🏗️ Architecture Technique

### Stack
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + TailwindCSS
- **Real-time**: Socket.io (WebSockets)
- **Authentification**: JWT + Bcrypt
- **Deployment**: Docker + Docker Compose

### Base de données
- PostgreSQL (données transactionnelles)
- TimeSeries DB (futuro pour les données IoT)

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (ou via Docker)

### Option 1: Avec Docker (Recommandé)

```bash
# Cloner et se placer dans le répertoire
cd atlas_factory

# Démarrer tous les services
docker-compose up

# Accéder à l'application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

### Option 2: Installation locale

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

## 📝 Comptes de Test

Utilisateurs pré-créés pour tests:

```
Email: director@atlas.com | Mot de passe: atlas123 | Rôle: director
Email: quality@atlas.com | Mot de passe: atlas123 | Rôle: quality_manager
Email: operator@atlas.com | Mot de passe: atlas123 | Rôle: operator
Email: tech@atlas.com | Mot de passe: atlas123 | Rôle: technician
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Traçabilité
- `GET /api/traceability` - Lister tous les lots
- `POST /api/traceability` - Créer un lot
- `GET /api/traceability/:id` - Détails d'un lot
- `PATCH /api/traceability/:id/status` - Mettre à jour le statut

### IoT
- `GET /api/iot` - Lister les capteurs
- `POST /api/iot` - Ajouter un capteur
- `PATCH /api/iot/:id/reading` - Mettre à jour une lecture

## 👥 Rôles et Permissions

| Rôle | Accès |
|------|-------|
| **admin** | Accès complet |
| **director** | Dashboards, rapports, KPIs |
| **quality_manager** | Contrôles HACCP, alertes |
| **production_manager** | MES, flux, rendement |
| **operator** | Interface simplifiée, saisies |
| **technician** | Maintenance, machines |
| **sales** | CRM, commandes, clients |
| **auditor** | Traçabilité, rapports audit |

## 🔒 Sécurité

- ✅ JWT pour authentification
- ✅ Chiffrement Bcrypt des mots de passe
- ✅ CORS configuré
- ✅ Helmet pour sécurité HTTP
- ✅ Validation des données
- ✅ GDPR ready
- ✅ Audit logging (à implémenter)

## 📊 Structure des Données

### Lots (Traceability)
```json
{
  "id": "uuid",
  "lotNumber": "LOT-1702982400000-ABC123",
  "qrCode": "data:image/png;base64,...",
  "productType": "Viande hachée",
  "quantity": 500,
  "unit": "kg",
  "status": "received|cutting|grinding|seasoning|packaging|storage|shipped|quality_blocked",
  "temperature": -18.5,
  "location": "Chambre froide A",
  "createdAt": "2023-12-19T10:00:00Z"
}
```

### Capteurs IoT
```json
{
  "id": "uuid",
  "sensorId": "SENSOR-001",
  "sensorName": "Thermomètre Chambre A",
  "location": "Chambre froide A",
  "type": "temperature|humidity|pressure",
  "currentValue": -18.5,
  "unit": "°C",
  "minThreshold": -20,
  "maxThreshold": -15,
  "lastReadAt": "2023-12-19T10:00:00Z",
  "status": "active|inactive|error"
}
```

## 📈 Roadmap (18 mois)

- **Mois 1**: ✅ Architecture, design, base de données
- **Mois 2**: Configuration backend, modèles
- **Mois 3**: Traçabilité + IoT (frontend)
- **Mois 4-5**: Qualité HACCP + MES
- **Mois 6-7**: Maintenance + Opérateurs
- **Mois 8-9**: Commercial B2B + CRM
- **Mois 10**: Dashboards PowerBI
- **Mois 11-12**: Tests, audit, formation
- **Mois 13-18**: Optimisations, déploiement, support

## 🎓 Documentation Complète

Voir [docs/](./docs/) pour:
- Architecture détaillée
- Guide de développement
- API documentation (Swagger)
- Manuels utilisateurs (Arabe, Français, Anglais)
- Scripts de déploiement

## 📱 Applications Mobile

À développer (18 mois):
- React Native pour iOS/Android
- Interface opérateurs optimisée
- Mode hors ligne
- Notifications push

## 🤝 Support & Contribution

Pour signaler des bugs ou proposer des améliorations:
1. Créer une issue
2. Forker le repository
3. Créer une branche feature
4. Soumettre une pull request

## 📄 Licence

MIT License © 2025 Atlas Viandes Agro-Industries

---

**Plateforme développée avec ❤️ pour la transformation digitale de l'agro-alimentaire**
