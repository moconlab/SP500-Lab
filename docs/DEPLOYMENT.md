# Deployment Guide

This guide covers deploying the SP500-Lab application to various environments.

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker (optional)
- dbt Core (optional)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/moconlab/SP500-Lab.git
cd SP500-Lab
```

2. **Start Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on `http://localhost:5000`

3. **Start Frontend (in new terminal):**
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Docker Deployment

### Single Command Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MLflow: http://localhost:5001

### Individual Container Builds

**Backend:**
```bash
cd backend
docker build -t sp500-backend .
docker run -p 5000:5000 --env-file .env sp500-backend
```

**Frontend:**
```bash
cd frontend
docker build -t sp500-frontend .
docker run -p 3000:80 sp500-frontend
```

## Cloud Deployment

### AWS Deployment

#### Prerequisites
- AWS Account
- AWS CLI configured
- ECR repository created

#### Steps

1. **Push Images to ECR:**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push backend
docker tag sp500-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sp500-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sp500-backend:latest

# Tag and push frontend
docker tag sp500-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/sp500-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/sp500-frontend:latest
```

2. **Deploy to ECS:**
```bash
# Create task definitions
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create or update service
aws ecs create-service --cluster sp500-cluster --service-name sp500-service --task-definition sp500-task --desired-count 2
```

3. **Configure Load Balancer:**
- Create Application Load Balancer
- Configure target groups
- Set up health checks
- Configure SSL certificate

#### AWS Redshift Setup

1. **Create Redshift Cluster:**
```bash
aws redshift create-cluster \
  --cluster-identifier sp500-cluster \
  --node-type dc2.large \
  --master-username admin \
  --master-user-password <password> \
  --number-of-nodes 2
```

2. **Configure dbt:**
```yaml
# profiles.yml
sp500_analytics:
  outputs:
    prod:
      type: redshift
      host: sp500-cluster.xxxxxxxx.us-east-1.redshift.amazonaws.com
      port: 5439
      dbname: sp500_prod
      schema: public
      user: admin
      password: <password>
```

### GCP Deployment

#### Prerequisites
- GCP Account
- gcloud CLI configured
- GCR enabled

#### Steps

1. **Push Images to GCR:**
```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Tag and push backend
docker tag sp500-backend:latest gcr.io/<project-id>/sp500-backend:latest
docker push gcr.io/<project-id>/sp500-backend:latest

# Tag and push frontend
docker tag sp500-frontend:latest gcr.io/<project-id>/sp500-frontend:latest
docker push gcr.io/<project-id>/sp500-frontend:latest
```

2. **Deploy to Cloud Run:**
```bash
# Deploy backend
gcloud run deploy sp500-backend \
  --image gcr.io/<project-id>/sp500-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend
gcloud run deploy sp500-frontend \
  --image gcr.io/<project-id>/sp500-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### BigQuery Setup

1. **Create Dataset:**
```bash
bq mk --dataset --location=US <project-id>:sp500_prod
```

2. **Configure dbt:**
```yaml
# profiles.yml
sp500_analytics:
  outputs:
    prod:
      type: bigquery
      method: oauth
      project: <project-id>
      dataset: sp500_prod
      location: US
```

3. **Run dbt:**
```bash
cd dbt-project
dbt run --profiles-dir .
```

### Azure Deployment

#### Prerequisites
- Azure Account
- Azure CLI configured
- ACR created

#### Steps

1. **Push Images to ACR:**
```bash
# Login to ACR
az acr login --name <registry-name>

# Tag and push images
docker tag sp500-backend:latest <registry-name>.azurecr.io/sp500-backend:latest
docker push <registry-name>.azurecr.io/sp500-backend:latest
```

2. **Deploy to AKS:**
```bash
# Create AKS cluster
az aks create \
  --resource-group sp500-rg \
  --name sp500-cluster \
  --node-count 2 \
  --enable-addons monitoring

# Get credentials
az aks get-credentials --resource-group sp500-rg --name sp500-cluster

# Deploy using kubectl
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## Databricks Setup

### Workspace Configuration

1. **Create Workspace:**
- Navigate to Databricks portal
- Create new workspace
- Configure cloud provider integration

2. **Create Cluster:**
```yaml
cluster_name: sp500-ml-cluster
spark_version: 13.3.x-cpu-ml-scala2.12
node_type_id: Standard_DS3_v2
autoscale:
  min_workers: 1
  max_workers: 4
```

3. **Install Libraries:**
```bash
# Using UI or CLI
databricks libraries install --cluster-id <cluster-id> --pypi-package mlflow==2.9.2
databricks libraries install --cluster-id <cluster-id> --pypi-package scikit-learn==1.3.2
databricks libraries install --cluster-id <cluster-id> --pypi-package xgboost==2.0.3
```

4. **Upload Notebooks:**
```bash
databricks workspace import \
  ml-pipeline/notebooks/train_model.py \
  /Workspace/sp500/train_model \
  --language PYTHON
```

5. **Create Job:**
```bash
databricks jobs create --json '{
  "name": "Daily Model Training",
  "schedule": {
    "quartz_cron_expression": "0 0 * * *",
    "timezone_id": "UTC"
  },
  "tasks": [{
    "task_key": "train_model",
    "notebook_task": {
      "notebook_path": "/Workspace/sp500/train_model"
    },
    "existing_cluster_id": "<cluster-id>"
  }]
}'
```

## MLflow Setup

### Local MLflow Server

```bash
# Install MLflow
pip install mlflow

# Start server
mlflow server \
  --backend-store-uri sqlite:///mlflow.db \
  --default-artifact-root ./mlflow-artifacts \
  --host 0.0.0.0 \
  --port 5001
```

Access UI at: http://localhost:5001

### Databricks MLflow

MLflow is integrated with Databricks by default:
- Experiment tracking: Automatic
- Model registry: Built-in
- Model serving: Available

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# BigQuery
GCP_PROJECT_ID=your-project-id
GCP_DATASET=sp500_data

# Snowflake (alternative)
SNOWFLAKE_ACCOUNT=your-account
SNOWFLAKE_USERNAME=your-username
SNOWFLAKE_PASSWORD=your-password

# AWS (alternative)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Databricks
DATABRICKS_HOST=your-databricks-host
DATABRICKS_TOKEN=your-token

# MLflow
MLFLOW_TRACKING_URI=databricks
MLFLOW_EXPERIMENT_NAME=/sp500-recommendation-model
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://api.yourdomai n.com/api
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:80;
    }

    location /api {
        proxy_pass http://backend:5000;
    }
}
```

## Monitoring

### Application Monitoring

**CloudWatch (AWS):**
```bash
aws logs create-log-group --log-group-name /ecs/sp500
```

**Cloud Monitoring (GCP):**
```bash
gcloud logging write sp500-logs "Application started"
```

### Health Checks

```bash
# Backend health
curl https://api.yourdomain.com/health

# Expected response
{"status":"healthy","timestamp":"..."}
```

## Scaling

### Horizontal Scaling

**Docker Compose:**
```bash
docker-compose up -d --scale backend=3
```

**Kubernetes:**
```bash
kubectl scale deployment sp500-backend --replicas=5
```

### Auto-scaling

**AWS ECS:**
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/sp500-cluster/sp500-service \
  --min-capacity 2 \
  --max-capacity 10
```

## Backup and Recovery

### Database Backups

**BigQuery:**
```bash
bq cp <project>:sp500_prod.financial_metrics \
      <project>:sp500_backup.financial_metrics_$(date +%Y%m%d)
```

**Snowflake:**
```sql
CREATE TABLE sp500_backup.financial_metrics_20240115 
CLONE sp500_prod.financial_metrics;
```

### Application Backups

```bash
# Backup Docker volumes
docker run --rm -v sp500_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/sp500_backup_$(date +%Y%m%d).tar.gz /data
```

## Troubleshooting

### Backend Issues

```bash
# Check logs
docker logs sp500-backend

# Check environment
docker exec sp500-backend env

# Test connectivity
curl http://localhost:5000/health
```

### Frontend Issues

```bash
# Check build
npm run build

# Check nginx logs
docker logs sp500-frontend

# Test static files
curl http://localhost:3000/index.html
```

### Database Issues

```bash
# Test dbt connection
cd dbt-project
dbt debug

# Run specific model
dbt run --select financial_metrics
```

## Security Checklist

- [ ] Environment variables stored securely
- [ ] SSL/TLS certificates configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Database credentials rotated
- [ ] API authentication added
- [ ] Security headers configured
- [ ] Regular security updates
- [ ] Monitoring and alerting setup

## Performance Optimization

1. **CDN Configuration:**
   - Serve static assets via CloudFront/CloudFlare
   - Enable compression
   - Set cache headers

2. **Database Optimization:**
   - Create indexes on frequently queried columns
   - Use materialized views
   - Implement query caching

3. **API Optimization:**
   - Enable Redis caching
   - Implement pagination
   - Use connection pooling

4. **Frontend Optimization:**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Minimize bundle size
