# ⚡ PROCHAINES ACTIONS À FAIRE

## Avant de pouvoir tester en local, il faut:

### 1. Installer PostgreSQL (si pas de Docker)
```bash
# Windows
https://www.postgresql.org/download/windows/

# Ou via Docker
docker run --name atlas_db -e POSTGRES_PASSWORD=atlas_password \
  -e POSTGRES_USER=atlas_user -e POSTGRES_DB=atlas_smartfactory \
  -p 5432:5432 -d postgres:15-alpine
```

### 2. Initialiser les dépendances

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Créer les tables (migrations)

```bash
# À la première exécution, Sequelize crée les tables
cd backend
npm run dev
```

### 4. Seed données de test

Les utilisateurs de test seront créés automatiquement la première fois.

### 5. Tester les endpoints

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operator@atlas.com", "password":"atlas123"}'

# Créer un lot
curl -X POST http://localhost:5000/api/traceability \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"productType":"Viande", "quantity":500, "unit":"kg"}'
```

---

## Modules à Compléter

### ✅ Fait (2 modules)
- [x] Traçabilité (QR Code)
- [x] IoT & Température

### 🔄 À Compléter (6 modules)

#### 1. **Contrôle Qualité HACCP**
   Fichiers à créer:
   - `backend/src/controllers/qualityController.js`
   - `frontend/src/pages/QualityControl.js`
   - API endpoints PATCH `/api/quality/:lotId`

#### 2. **Production MES**
   Fichiers à créer:
   - `backend/src/controllers/productionController.js`
   - `frontend/src/pages/Production.js`
   - Dashboard TRG

#### 3. **Maintenance Intelligente**
   Fichiers à créer:
   - `backend/src/controllers/maintenanceController.js`
   - `frontend/src/pages/Maintenance.js`
   - Prédiction pannes (IA - futur)

#### 4. **Interface Opérateurs**
   Fichiers à créer:
   - `frontend/src/pages/OperatorInterface.js`
   - Mode offline avec service workers
   - Vidéo procédures (intégration YT)

#### 5. **Commercial B2B**
   Fichiers à créer:
   - `backend/src/controllers/salesController.js`
   - `frontend/src/pages/Sales.js` (CRM)
   - `frontend/src/pages/BtoB.js` (site commande)

#### 6. **Dashboards PowerBI**
   - Intégration API PowerBI
   - Rapports automatisés

---

## Code Template (Copier/Coller pour nouveaux modules)

### Backend - Controller Template
```javascript
// backend/src/controllers/newModuleController.js
const newModuleService = require('../services/newModuleService');

const getAll = async (req, res) => {
  try {
    const data = await newModuleService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const result = await newModuleService.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll, create };
```

### Backend - Route Template
```javascript
// backend/src/routes/newModuleRoutes.js
const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const controller = require('../controllers/newModuleController');

const router = express.Router();

router.get('/', authenticateToken, controller.getAll);
router.post('/', authenticateToken, authorizeRole('admin', 'manager'), controller.create);

module.exports = router;
```

### Frontend - Component Template
```javascript
// frontend/src/pages/NewModule.js
import React, { useEffect, useState } from 'react';
import { api } from '../utils/apiClient';

const NewModule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/new-module');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nouveau Module</h1>
      {loading ? <p>Chargement...</p> : <div>Contenu</div>}
    </div>
  );
};

export default NewModule;
```

---

## Checklist Démarrage

- [ ] PostgreSQL installé/running
- [ ] `npm install` exécuté (backend + frontend)
- [ ] `.env` configuré
- [ ] Backend démarré (`npm run dev` sur port 5000)
- [ ] Frontend démarré (`npm run dev` sur port 3000)
- [ ] Login fonctionnelle
- [ ] Créer lot de test via interface
- [ ] Vérifier capteurs temps réel
- [ ] Explorer API via Postman

---

## Fichiers Importants à Connaître

| Fichier | Rôle |
|---------|------|
| `backend/src/index.js` | Point d'entrée API |
| `frontend/src/App.js` | Routage principal |
| `backend/src/config/sequelize.js` | Config BD |
| `frontend/src/store/authStore.js` | State auth |
| `frontend/src/utils/apiClient.js` | Requêtes API |
| `docker-compose.yml` | Orchestration |

---

## Commandes Utiles

```bash
# Backend
npm run dev              # Démarrer en dev
npm test                 # Tests
npm run seed             # Données initiales
npm run migrate          # Migrations BD

# Frontend
npm run dev              # Démarrer en dev
npm test                 # Tests
npm run build            # Build production

# Docker
docker-compose up        # Tout démarrer
docker-compose down      # Tout arrêter
docker-compose logs -f   # Logs temps réel
```

---

## Questions Fréquentes

**Q: Comment ajouter un nouvel utilisateur?**
A: Via l'endpoint `/api/auth/register` ou manuellement en DB.

**Q: Où configurer la base de données?**
A: Dans `backend/.env` ou `backend/src/config/database.js`

**Q: Comment déployer en production?**
A: Voir `docs/DEPLOYMENT.md`

**Q: Comment activer HTTPS?**
A: Voir `docs/DEPLOYMENT.md` → SSL/TLS section

**Q: Puis-je modifier le port?**
A: Oui, via la variable `PORT` dans `.env`

---

Bon développement! 🚀
