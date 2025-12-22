# 🚀 Guide de Déploiement - Atlas SmartFactory

## Déploiement en Production

### 1. Préparation de l'environnement

```bash
# Variables d'environnement (production)
DB_USER=atlas_prod_user
DB_PASSWORD=<STRONG_PASSWORD>
DB_NAME=atlas_smartfactory_prod
DB_HOST=<RDS_ENDPOINT>
JWT_SECRET=<STRONG_SECRET_KEY>
NODE_ENV=production
```

### 2. Base de données

```bash
# Migration (première fois)
npm run migrate

# Seed données initiales
npm run seed

# Backup régulier
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup.sql
```

### 3. Déploiement Docker

```bash
# Build des images
docker-compose build

# Push sur registry
docker tag atlas-backend:latest registry.com/atlas-backend:v1.0
docker push registry.com/atlas-backend:v1.0

# Deploy
docker stack deploy -c docker-compose.prod.yml atlas
```

### 4. SSL/TLS

```bash
# Certificat Let's Encrypt
certbot certonly --standalone -d atlas-smartfactory.com

# Configuration Nginx
upstream backend {
  server backend:5000;
}

server {
  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/atlas-smartfactory.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/atlas-smartfactory.com/privkey.pem;
  
  location /api {
    proxy_pass http://backend;
  }
}
```

### 5. Monitoring

```bash
# ELK Stack pour logs
docker run -d -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.0.0

# Prometheus pour metrics
docker run -d -p 9090:9090 prom/prometheus
```

---

## Checklist Production

- [ ] Base de données sauvegardée
- [ ] Secrets configurés (ne pas en git)
- [ ] SSL/TLS activé
- [ ] Rate limiting activé
- [ ] Logging centralisé
- [ ] Monitoring en place
- [ ] Backups automatiques
- [ ] Plan de disaster recovery
- [ ] Tests de charge réussis (99.5% uptime)
- [ ] Formation utilisateurs complétée

---

## Rollback Plan

```bash
# En cas de problème
docker service rollback atlas_backend

# Restaurer DB
psql -U atlas_prod_user -f backup.sql -d atlas_smartfactory_prod
```
