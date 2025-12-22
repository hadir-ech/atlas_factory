# DÉMARRAGE RAPIDE - Atlas SmartFactory

## 🎯 En 5 minutes

### Option 1: Docker (Easiest)

```bash
# 1. Démarrer tous les services
cd atlas_factory
docker-compose up

# 2. Ouvrir dans le navigateur
Frontend: http://localhost:3000
API: http://localhost:5000

# 3. Se connecter avec
Email: operator@atlas.com
Password: atlas123
```

### Option 2: Installation locale

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev
# → http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 📱 Premiers pas

1. **Accueil**: http://localhost:3000
2. **Login**: Utiliser les comptes de test
3. **Dashboard**: Vue d'ensemble
4. **Traçabilité**: Créer un lot
5. **IoT**: Voir capteurs temps réel

---

## 🛠️ Développement

### Ajouter un nouveau module

1. **Backend**: `backend/src/routes/newModule.js`
2. **Frontend**: `frontend/src/pages/NewModule.js`
3. **Store**: `frontend/src/store/newModuleStore.js`

### Exemple: Module Maintenance

```javascript
// Backend route
router.get('/machines', authenticateToken, getMachines);
router.post('/machines/:id/maintenance', authenticateToken, recordMaintenance);

// Frontend component
export default Maintenance = () => {
  const [machines, setMachines] = useState([]);
  // ...
};
```

### Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📊 Données de test

### Créer des lots pour tester la traçabilité

```bash
# API request
curl -X POST http://localhost:5000/api/traceability \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productType": "Viande hachée",
    "quantity": 500,
    "unit": "kg"
  }'
```

### Ajouter des capteurs

```bash
curl -X POST http://localhost:5000/api/iot \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "SENSOR-001",
    "sensorName": "Thermomètre Chambre A",
    "location": "Chambre froide A",
    "type": "temperature",
    "minThreshold": -20,
    "maxThreshold": -15,
    "unit": "°C"
  }'
```

---

## 🐛 Troubleshooting

### Port 5000/3000 déjà utilisé
```bash
# Kill les processus
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Connexion base de données échoue
```bash
# Vérifier PostgreSQL
psql -U atlas_user -d atlas_smartfactory -h localhost

# Ou via Docker
docker exec atlas_db psql -U atlas_user -d atlas_smartfactory
```

### Erreur JWT
- Vérifier le token dans localStorage
- Vérifier JWT_SECRET dans .env

---

## 📞 Support

- 📧 Email: support@atlas-smartfactory.com
- 💬 Slack: #atlas-support
- 📚 Docs: `docs/DOCUMENTATION.md`

---

**Bienvenue sur Atlas SmartFactory! 🚀**
