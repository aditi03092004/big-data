# E-Commerce Big Data Analytics Platform — Complete Setup Guide

> **Target Audience**: Team members setting up the project on a completely new Windows PC with zero prior software installed.  
> **Rule**: Every step is sequential. Do not skip steps. Continue only if the previous step succeeds.

---

# Table of Contents
1. [Project Overview & Architecture](#1-project-overview--architecture)
2. [PC Requirements](#2-pc-requirements)
3. [Windows Subsystem for Linux (WSL2) Setup](#3-windows-subsystem-for-linux-wsl2-setup)
4. [Ubuntu Environment Preparation & Utilities](#4-ubuntu-environment-preparation--utilities)
5. [SSH Passwordless Authentication Setup](#5-ssh-passwordless-authentication-setup)
6. [Java OpenJDK Installation & Environment Configuration](#6-java-openjdk-installation--environment-configuration)
7. [Apache Hadoop HDFS Installation & Cluster Configuration](#7-apache-hadoop-hdfs-installation--cluster-configuration)
8. [HDFS Formatting & Cluster Startup](#8-hdfs-formatting--cluster-startup)
9. [Real E-Commerce Dataset Ingestion into HDFS](#9-real-e-commerce-dataset-ingestion-into-hdfs)
10. [Python & PySpark Batch Analytics Engine Setup](#10-python--pyspark-batch-analytics-engine-setup)
11. [Apache Kafka Real-Time Event Streaming Setup](#11-apache-kafka-real-time-event-streaming-setup)
12. [Node.js & npm Installation on Windows](#12-nodejs--npm-installation-on-windows)
13. [Project Installation & Dependency Setup](#13-project-installation--dependency-setup)
14. [Environment Configuration & Database Placement](#14-environment-configuration--database-placement)
15. [Running the Application (Backend & Frontend)](#15-running-the-application-backend--frontend)
16. [Verification of All 10 Application Modules](#16-verification-of-all-10-application-modules)
17. [Platform Health API & Status Verification](#17-platform-health-api--status-verification)
18. [Production Build Verification](#18-production-build-verification)
19. [Daily Startup Procedure (4 Terminals)](#19-daily-startup-procedure)
20. [Daily Shutdown Procedure](#20-daily-shutdown-procedure)
21. [Demo Day & Presentation Execution Flow](#21-demo-day--presentation-execution-flow)
22. [Comprehensive Troubleshooting Guide (30 Scenarios)](#22-comprehensive-troubleshooting-guide)
23. [Final Setup Verification Checklist](#23-final-setup-verification-checklist)

---

# 1. Project Overview & Architecture

The **E-Commerce Big Data Analytics Platform** is an enterprise analytics command center combining distributed Big Data infrastructure with a modern web application:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    REACT + VITE FRONTEND (PORT 5173)                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ REST / Server-Sent Events (SSE)
┌────────────────────────────────────▼────────────────────────────────────┐
│               NODE.JS + EXPRESS + TYPESCRIPT BACKEND (PORT 5000)        │
└───────┬────────────────────┬────────────────────┬────────────────┬──────┘
        │ WebHDFS API        │ PySpark Jobs       │ kafkajs / SSE  │ mongodb driver
┌───────▼───────┐    ┌───────▼───────┐    ┌───────▼───────┐ ┌──────▼──────┐
│  HADOOP HDFS  │    │ APACHE SPARK  │    │ APACHE KAFKA  │ │   MONGODB   │
│  Block Storage│    │ Batch Engine  │    │ Event Stream  │ │    ATLAS    │
│  100k+ Records│    │ PySpark Aggs  │    │ topic: orders │ │App Metadata │
└───────────────┘    └───────────────┘    └───────────────┘ └─────────────┘
```

### Storage Responsibilities
- **Hadoop HDFS**: Primary source of truth for raw Big Data CSV datasets (`/ecommerce/orders`, `/ecommerce/customers`, `/ecommerce/products`, `/ecommerce/transactions`, `/ecommerce/delivery`).
- **Apache Spark / PySpark**: Executes batch processing, analytical joins, and revenue aggregations.
- **Apache Kafka**: High-throughput distributed streaming broker (`localhost:9092`) on topic `ecommerce-orders`.
- **Apache Hive**: Distributed SQL query engine on HiveServer2 (`localhost:10000`).
- **MongoDB Atlas**: Stores application-level metadata (`profiles`, `reports`, `saved_filters`, `dashboard_preferences`). *Note: Big Data datasets are NEVER copied into MongoDB.*

---

# 2. PC Requirements

- **Operating System**: Windows 10 (Build 19041+) or Windows 11 64-bit
- **Hardware Virtualization**: Enabled in BIOS/UEFI (VT-x / AMD-V)
- **RAM**: Minimum 8 GB (16 GB recommended)
- **Disk Space**: At least 25 GB free disk space on drive `C:` or `E:`

---

# 3. Windows Subsystem for Linux (WSL2) Setup

### Step 1 — Check WSL Status
Open **Windows PowerShell** as **Administrator** and run:

```powershell
wsl --status
```

---

### Step 2 — Enable Virtual Machine Platform & WSL
Run this in **PowerShell (Admin)**:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

---

### Step 3 — Install or Update WSL2 Kernel
Run this in **PowerShell (Admin)**:

```powershell
wsl --update
wsl --set-default-version 2
```

---

### Step 4 — Install Ubuntu Distribution
Run this in **PowerShell**:

```powershell
wsl --install -d Ubuntu
```

*Note: When prompted, enter a UNIX username (e.g. `arihant` or `analytics`) and a password you will remember.*

---

### Step 5 — Verify WSL2 Ubuntu Installation
Run this in **PowerShell**:

```powershell
wsl -l -v
```

Expected output:
```text
  NAME      STATE           VERSION
* Ubuntu    Running         2
```
*Continue only if Ubuntu is listed with Version 2.*

---

# 4. Ubuntu Environment Preparation & Utilities

### Step 1 — Open Ubuntu Terminal
From your Windows Start Menu, open **Ubuntu**, or run in PowerShell:

```powershell
wsl -d Ubuntu
```

---

### Step 2 — Update Package Repositories
Run this inside **Ubuntu**:

```bash
sudo apt update
sudo apt upgrade -y
```

---

### Step 3 — Install Essential Build Utilities
Run this inside **Ubuntu**:

```bash
sudo apt install -y curl wget git unzip tar build-essential software-properties-common net-tools
```

---

# 5. SSH Passwordless Authentication Setup

Hadoop requires passwordless SSH access to `localhost` to manage NameNode and DataNode daemons.

### Step 1 — Install OpenSSH Server & Client
Run this inside **Ubuntu**:

```bash
sudo apt install -y openssh-server openssh-client
```

---

### Step 2 — Generate SSH Keypair
Run this inside **Ubuntu** (press Enter on all prompts to use defaults):

```bash
ssh-keygen -t rsa -P "" -f ~/.ssh/id_rsa
```

---

### Step 3 — Authorize the Public Key
Run this inside **Ubuntu**:

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys
```

---

### Step 4 — Start SSH Service
Run this inside **Ubuntu**:

```bash
sudo service ssh start
```

---

### Step 5 — Verify SSH Passwordless Login
Run this inside **Ubuntu**:

```bash
ssh -o StrictHostKeyChecking=no localhost whoami
```

Expected output:
```text
your-ubuntu-username
```
*Continue only if your username prints without asking for a password.*

---

# 6. Java OpenJDK Installation & Environment Configuration

Hadoop and Spark require a compatible Java Development Kit (JDK 8 or JDK 11).

### Step 1 — Install OpenJDK 11
Run this inside **Ubuntu**:

```bash
sudo apt install -y openjdk-11-jdk
```

---

### Step 2 — Determine Java Path
Run this inside **Ubuntu**:

```bash
readlink -f /usr/bin/javac | sed "s:/bin/javac::"
```

Expected output:
```text
/usr/lib/jvm/java-11-openjdk-amd64
```

---

### Step 3 — Configure JAVA_HOME in ~/.bashrc
Run this inside **Ubuntu**:

```bash
cat << 'EOF' >> ~/.bashrc

# Java Environment
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
EOF
source ~/.bashrc
```

---

### Step 4 — Verify Java Installation
Run this inside **Ubuntu**:

```bash
java -version
```

Expected output:
```text
openjdk version "11.0..."
OpenJDK Runtime Environment
```

---

# 7. Apache Hadoop HDFS Installation & Cluster Configuration

### Step 1 — Download Apache Hadoop (3.5.0 / 3.3.6)
Run this inside **Ubuntu**:

```bash
cd ~
wget https://archive.apache.org/dist/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz -O hadoop.tar.gz
```

---

### Step 2 — Extract and Move Hadoop
Run this inside **Ubuntu**:

```bash
tar -xzf hadoop.tar.gz
sudo mv hadoop-3.3.6 /usr/local/hadoop
sudo chown -R $USER:$USER /usr/local/hadoop
rm hadoop.tar.gz
```

---

### Step 3 — Configure Hadoop Environment Variables
Run this inside **Ubuntu**:

```bash
cat << 'EOF' >> ~/.bashrc

# Hadoop Environment
export HADOOP_HOME=/usr/local/hadoop
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
EOF
source ~/.bashrc
```

---

### Step 4 — Configure hadoop-env.sh
Run this inside **Ubuntu**:

```bash
cat << 'EOF' >> /usr/local/hadoop/etc/hadoop/hadoop-env.sh
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export HADOOP_HOME=/usr/local/hadoop
EOF
```

---

### Step 5 — Configure core-site.xml
Run this inside **Ubuntu**:

```bash
cat << 'EOF' > /usr/local/hadoop/etc/hadoop/core-site.xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>hadoop.http.staticuser.user</name>
        <value>analytics</value>
    </property>
</configuration>
EOF
```

---

### Step 6 — Configure hdfs-site.xml
Run this inside **Ubuntu**:

```bash
mkdir -p /home/$USER/hadoop_data/hdfs/namenode
mkdir -p /home/$USER/hadoop_data/hdfs/datanode

cat << EOF > /usr/local/hadoop/etc/hadoop/hdfs-site.xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
    <property>
        <name>dfs.namenode.name.dir</name>
        <value>file:///home/$USER/hadoop_data/hdfs/namenode</value>
    </property>
    <property>
        <name>dfs.datanode.data.dir</name>
        <value>file:///home/$USER/hadoop_data/hdfs/datanode</value>
    </property>
    <property>
        <name>dfs.webhdfs.enabled</name>
        <value>true</value>
    </property>
    <property>
        <name>dfs.http.address</name>
        <value>0.0.0.0:9870</value>
    </property>
</configuration>
EOF
```

---

# 8. HDFS Formatting & Cluster Startup

> [!WARNING]
> **CRITICAL RULE**: Run `hdfs namenode -format` **ONLY ON FIRST INSTALLATION**.  
> **DO NOT RUN `hdfs namenode -format` AGAIN ON AN EXISTING WORKING SETUP**, as formatting destroys all existing NameNode cluster IDs and metadata.

### Step 1 — Format NameNode (FIRST INSTALL ONLY)
Run this inside **Ubuntu**:

```bash
hdfs namenode -format
```

*Look for `Storage directory ... has been successfully formatted` near the end of output.*

---

### Step 2 — Start HDFS Daemons
Run this inside **Ubuntu**:

```bash
start-dfs.sh
```

---

### Step 3 — Verify Running Daemons with jps
Run this inside **Ubuntu**:

```bash
jps
```

Expected output:
```text
12345 NameNode
12456 DataNode
12567 SecondaryNameNode
12678 Jps
```
*Continue only if NameNode, DataNode, and SecondaryNameNode are all running.*

---

### Step 4 — Verify HDFS Web UI
Open your Windows browser and navigate to:
```text
http://localhost:9870
```
*You should see the Hadoop NameNode Overview interface confirming live cluster status.*

---

# 9. Real E-Commerce Dataset Ingestion into HDFS

The platform requires 5 core e-commerce datasets stored in HDFS block storage.

### Step 1 — Create HDFS Directory Structure
Run this inside **Ubuntu**:

```bash
hdfs dfs -mkdir -p /ecommerce/customers
hdfs dfs -mkdir -p /ecommerce/products
hdfs dfs -mkdir -p /ecommerce/orders
hdfs dfs -mkdir -p /ecommerce/transactions
hdfs dfs -mkdir -p /ecommerce/delivery
hdfs dfs -mkdir -p /ecommerce/analytics
```

---

### Step 2 — Verify or Generate Dataset CSVs
If `./data` in the repository does not have the CSV files, generate them:

Run this inside **Ubuntu** (from repository root):

```bash
python3 scripts/generate_data.py --orders 100000 --customers 10000 --products 5000 --output ./data
```

---

### Step 3 — Ingest CSVs into HDFS
Run the repository's automated ingestion script:

```bash
bash bigdata/hdfs/hdfs_init.sh
```

Or manually upload the files into HDFS block storage:

```bash
hdfs dfs -put -f ./data/customers.csv /ecommerce/customers/
hdfs dfs -put -f ./data/products.csv /ecommerce/products/
hdfs dfs -put -f ./data/orders.csv /ecommerce/orders/
hdfs dfs -put -f ./data/transactions.csv /ecommerce/transactions/
hdfs dfs -put -f ./data/delivery.csv /ecommerce/delivery/
```

---

### Step 4 — Verify Files in HDFS
Run this inside **Ubuntu**:

```bash
hdfs dfs -ls /ecommerce/*
```

Expected output:
```text
/ecommerce/customers/customers.csv
/ecommerce/products/products.csv
/ecommerce/orders/orders.csv
/ecommerce/transactions/transactions.csv
/ecommerce/delivery/delivery.csv
```

---

### Step 5 — Verify Dataset Record Counts
Run this inside **Ubuntu**:

```bash
hdfs dfs -cat /ecommerce/products/products.csv | head -n 5
hdfs dfs -cat /ecommerce/orders/orders.csv | head -n 5
```

---

# 10. Python & PySpark Batch Analytics Engine Setup

### Step 1 — Install Python 3, pip, and venv
Run this inside **Ubuntu**:

```bash
sudo apt install -y python3 python3-pip python3-venv
```

---

### Step 2 — Create PySpark Virtual Environment
Run this inside **Ubuntu**:

```bash
cd ~
python3 -m venv pyspark-env
source ~/pyspark-env/bin/activate
```

---

### Step 3 — Install PySpark
Run this inside **Ubuntu** (with virtual environment active):

```bash
pip install --upgrade pip
pip install pyspark==3.5.0
```

---

### Step 4 — Configure Spark in ~/.bashrc
Run this inside **Ubuntu**:

```bash
cat << 'EOF' >> ~/.bashrc

# Spark Environment
export SPARK_HOME=/usr/local/spark
export PYSPARK_PYTHON=python3
EOF
source ~/.bashrc
```

---

### Step 5 — Verify PySpark Reading HDFS
Run this inside **Ubuntu** (with `pyspark-env` active):

```bash
python3 -c "
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('hdfs-test').master('local[*]').getOrCreate()
df = spark.read.option('header', True).csv('hdfs://localhost:9000/ecommerce/products')
print('=== SPARK HDFS READ SUCCESS ===')
df.show(5)
spark.stop()
"
```

---

# 11. Apache Kafka Real-Time Event Streaming Setup

### Step 1 — Download & Extract Apache Kafka
Run this inside **Ubuntu**:

```bash
cd ~
wget https://archive.apache.org/dist/kafka/3.6.1/kafka_2.13-3.6.1.tgz -O kafka.tgz
tar -xzf kafka.tgz
sudo mv kafka_2.13-3.6.1 /usr/local/kafka
sudo chown -R $USER:$USER /usr/local/kafka
rm kafka.tgz
```

---

### Step 2 — Start Zookeeper
Run this inside **Ubuntu** (Terminal 1 for Kafka):

```bash
/usr/local/kafka/bin/zookeeper-server-start.sh -daemon /usr/local/kafka/config/zookeeper.properties
```

---

### Step 3 — Start Kafka Broker
Run this inside **Ubuntu**:

```bash
/usr/local/kafka/bin/kafka-server-start.sh -daemon /usr/local/kafka/config/server.properties
```

---

### Step 4 — Verify Kafka Port (9092)
Run this inside **Ubuntu**:

```bash
netstat -tuln | grep 9092
```

---

### Step 5 — Create topic `ecommerce-orders`
Run this inside **Ubuntu**:

```bash
/usr/local/kafka/bin/kafka-topics.sh --create --topic ecommerce-orders --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --if-not-exists
```

---

### Step 6 — Verify Topic Creation
Run this inside **Ubuntu**:

```bash
/usr/local/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Expected output:
```text
ecommerce-orders
```

---

# 12. Node.js & npm Installation on Windows

The Node.js backend and React frontend run directly on your Windows host.

### Step 1 — Download & Install Node.js (v18 or v20 LTS)
1. Download the Windows Installer (`.msi`) from [nodejs.org](https://nodejs.org/).
2. Run installer and ensure **"Add to PATH"** is checked.
3. Finish installation.

---

### Step 2 — Verify Node & npm in Windows PowerShell
Open a new **PowerShell** window and run:

```powershell
node -v
npm -v
```

Expected:
```text
v20.x.x (or v18.x.x / v22.x.x)
10.x.x
```

---

# 13. Project Installation & Dependency Setup

### Step 1 — Clone the Repository
Run this in **PowerShell**:

```powershell
git clone <your-repository-url> Data-Asset-Hub
cd Data-Asset-Hub
```

---

### Step 2 — Install Backend Dependencies
Run this in **PowerShell**:

```powershell
cd backend
npm install
```

---

### Step 3 — Install Frontend Dependencies
Run this in **PowerShell**:

```powershell
cd ../frontend
npm install
```

---

# 14. Environment Configuration & Database Placement

> [!NOTE]
> **Database Credentials**: MongoDB Atlas credentials are supplied by your project lead in the `.env` file. You do **not** need to create a MongoDB database or cluster.

### Step 1 — Place the Supplied `.env`
Place the `.env` file inside the `backend/` directory (`backend/.env`).

Ensure `backend/.env` contains the required keys:

```env
NODE_ENV=development
BACKEND_PORT=5000
FRONTEND_URL=http://localhost:5173

DATA_MODE=bigdata

MONGODB_URI=<Provided MongoDB Atlas URI>
MONGODB_DB_NAME=big_data_hub

HDFS_NAMENODE_HOST=localhost
HDFS_NAMENODE_PORT=9870
HDFS_USER=analytics

KAFKA_BROKERS=localhost:9092
KAFKA_TOPIC=ecommerce-orders
KAFKA_CLIENT_ID=ecommerce-bigdata-backend
KAFKA_GROUP_ID=ecommerce-analytics-consumer

SPARK_HOME=/home/analytics/pyspark-env/lib/python3.10/site-packages/pyspark
PYSPARK_PYTHON=python3
SPARK_MASTER=local[*]

HIVE_HOME=/usr/local/hive
HIVE_HOST=localhost
HIVE_PORT=10000
HIVE_DATABASE=ecommerce_analytics

CUSTOMERS_DATASET_PATH=/ecommerce/customers
PRODUCTS_DATASET_PATH=/ecommerce/products
ORDERS_DATASET_PATH=/ecommerce/orders
TRANSACTIONS_DATASET_PATH=/ecommerce/transactions
DELIVERY_DATASET_PATH=/ecommerce/delivery
```

---

### Step 2 — Verify DATA_MODE
Confirm that `DATA_MODE=bigdata` is set in `backend/.env`.

---

# 15. Running the Application (Backend & Frontend)

### Step 1 — Run Backend Typecheck
Run this in **PowerShell** (`backend/` directory):

```powershell
cd backend
npm run typecheck
```
*Expected: 0 errors.*

---

### Step 2 — Run Frontend Typecheck
Run this in **PowerShell** (`frontend/` directory):

```powershell
cd ../frontend
npm run typecheck
```
*Expected: 0 errors.*

---

### Step 3 — Start the Backend Server
Run this in **PowerShell** (Terminal 1):

```powershell
cd backend
npm run dev
```

Expected output:
```text
🚀 E-Commerce Big Data Analytics Platform — API Backend
📡 Listening on: http://localhost:5000
📊 Mode: BIGDATA MODE
```

---

### Step 4 — Start the Frontend Development Server
Run this in a **separate PowerShell** (Terminal 2):

```powershell
cd frontend
npm run dev
```

Expected output:
```text
VITE v6.x.x  ready in 300 ms
➜  Local:   http://localhost:5173/
```

---

# 16. Verification of All 10 Application Modules

Open your browser at `http://localhost:5173` and verify each module:

| Module | Route | Primary Data Source | Expected Display / Proof of Working |
| :--- | :--- | :--- | :--- |
| **1. Dashboard** | `/dashboard` | HDFS `/ecommerce/*` + WebHDFS | Header shows **`BIG DATA MODE`** badge. Revenue: `₹16.93 Cr`, Orders: `16,548`, Customers: `10,000`, Products: `5,000`, AOV: `₹10,228`. |
| **2. Customer Analytics** | `/customers` | HDFS `/ecommerce/customers` | Search bar filters 10,000 customer records. Displays spending velocity and tier badges. |
| **3. Products & Sales** | `/products` | HDFS `/ecommerce/products` | Paginated catalog of 5,000 SKU items with category breakdowns (Audio, Wearables, Computer, Lifestyle, Home). |
| **4. Orders & Fulfillment** | `/orders` | HDFS `/ecommerce/orders` | 100,000 order stream with filter controls by status (`delivered`, `processing`, `pending`, `cancelled`). |
| **5. Financial Revenue** | `/revenue` | HDFS `/ecommerce/transactions` | Monthly, yearly, and daily revenue breakdown charts with location distribution. |
| **6. Live Streaming** | `/live` | Apache Kafka (`ecommerce-orders`) | Real-time event ticker broadcasting live orders via Server-Sent Events (SSE). |
| **7. Data Explorer** | `/data-explorer` | HDFS Block Metadata | Displays storage engine, records size, and Hadoop lineage. |
| **8. Governed Queries** | `/queries` | Apache Hive / Spark Engine | List of 7 governed analytical SQL query templates with execution triggers. |
| **9. Reports Compiler** | `/reports` | MongoDB Atlas (`reports`) | Generated report records stored and listed from MongoDB Atlas with CSV export download. |
| **10. Settings & Health** | `/settings` | Backend Driver Probes | Real-time status cards for HDFS, Spark, Kafka, MongoDB, and Hive. Profile saved to MongoDB Atlas. |

---

# 17. Platform Health API & Status Verification

### Test the Health API Endpoint
Run this in **PowerShell**:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get | ConvertTo-Json
```

Expected Response:
```json
{
  "application": "healthy",
  "mode": "bigdata",
  "hdfs": "connected",
  "spark": "connected",
  "hive": "disconnected",
  "kafka": "connected",
  "mongodb": "connected",
  "checkedAt": "2026-08-23T10:26:45.555Z"
}
```

### Health Status Legend:
- **`hdfs: connected`**: WebHDFS Namenode responding on `http://localhost:9870`.
- **`spark: connected`**: PySpark framework configured and available.
- **`kafka: connected`**: Kafka broker reachable on `localhost:9092`.
- **`mongodb: connected`**: Live `{ ping: 1 }` probe to MongoDB Atlas cluster succeeded.
- **`hive: disconnected`**: Honest status indicating HiveServer2 is not currently listening on port 10000.

---

# 18. Production Build Verification

Verify that the frontend builds cleanly into a static distribution bundle:

```powershell
cd frontend
npm run build
```

Expected output:
```text
✓ built in 7.xxs
dist/index.html
dist/assets/...
```

---

# 19. Daily Startup Procedure

Every time you restart your PC or start your work session, open 4 terminals:

### Terminal 1 — Start Hadoop HDFS (Ubuntu WSL)
```bash
sudo service ssh start
start-dfs.sh
jps
```

### Terminal 2 — Start Kafka (Ubuntu WSL)
```bash
/usr/local/kafka/bin/zookeeper-server-start.sh -daemon /usr/local/kafka/config/zookeeper.properties
/usr/local/kafka/bin/kafka-server-start.sh -daemon /usr/local/kafka/config/server.properties
```

### Terminal 3 — Start Node Backend (Windows PowerShell)
```powershell
cd backend
npm run dev
```

### Terminal 4 — Start React Frontend (Windows PowerShell)
```powershell
cd frontend
npm run dev
```

*Open browser at `http://localhost:5173`.*

---

# 20. Daily Shutdown Procedure

To cleanly stop the cluster at the end of the day:

### Step 1 — Stop Frontend & Backend
In both PowerShell terminals, press `Ctrl + C`.

### Step 2 — Stop Kafka (Ubuntu WSL)
```bash
/usr/local/kafka/bin/kafka-server-stop.sh
/usr/local/kafka/bin/zookeeper-server-stop.sh
```

### Step 3 — Stop Hadoop HDFS (Ubuntu WSL)
```bash
stop-dfs.sh
```

> [!CAUTION]
> - **DO NOT** delete the HDFS directories.
> - **DO NOT** run `hdfs namenode -format`.

---

# 21. Demo Day & Presentation Execution Flow

Follow this exact checklist for team presentations or client demonstrations:

1. **Start Services**: Run the Daily Startup procedure (HDFS &rarr; Kafka &rarr; Backend &rarr; Frontend).
2. **Open Dashboard**: Navigate to `http://localhost:5173/dashboard`.
3. **Point Out Big Data Mode**: Highlight the top-right green `BIG DATA MODE` badge.
4. **Show Real HDFS Numbers**:
   - Total Revenue: **`₹16.93 Cr`**
   - Total Orders: **`16,548`**
   - Total Customers: **`10,000`**
   - Total Products: **`5,000`**
   - Average Order Value: **`₹10,228`**
5. **Show Live Streaming**: Navigate to `/live`, click "Emit Order", and demonstrate live Kafka event streaming.
6. **Show Health Status**: Navigate to `/settings` and show active connections to HDFS, Spark, Kafka, and MongoDB.
7. **Show Reports**: Navigate to `/reports`, generate a new report, and show it stored in MongoDB Atlas with export functionality.

---

# 22. Comprehensive Troubleshooting Guide

| # | Problem | Cause | Check Command | Fix Command | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `wsl: command not found` | WSL feature disabled | `dism.exe /online /get-features` | Enable WSL in Windows Features | `wsl --status` |
| **2** | Ubuntu won't start | Virtualization disabled | Task Manager &rarr; Performance &rarr; CPU | Enable VT-x/AMD-V in BIOS | `wsl -d Ubuntu` |
| **3** | `Permission denied (publickey)` | SSH key not authorized | `ssh localhost` | `cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys` | `ssh localhost whoami` |
| **4** | `JAVA_HOME is not set` | Variable missing in `.bashrc` | `echo $JAVA_HOME` | Add `export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64` to `~/.bashrc` | `java -version` |
| **5** | `hdfs: command not found` | Hadoop bin not in PATH | `echo $PATH` | Add `export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin` to `~/.bashrc` | `hdfs version` |
| **6** | `NameNode is not running` | HDFS not started | `jps` | `start-dfs.sh` | `jps` shows NameNode |
| **7** | `DataNode is not running` | Incompatible cluster ID | `cat /home/$USER/hadoop_data/hdfs/datanode/current/VERSION` | Stop HDFS, clear datanode directory, restart HDFS | `jps` shows DataNode |
| **8** | HDFS Web UI (`:9870`) unreachable | NameNode not started | `netstat -tuln \| grep 9870` | `start-dfs.sh` | Browse `http://localhost:9870` |
| **9** | `/ecommerce` directory missing | HDFS init script not run | `hdfs dfs -ls /` | `bash bigdata/hdfs/hdfs_init.sh` | `hdfs dfs -ls /ecommerce` |
| **10** | `Connection refused: localhost/127.0.0.1:9000` | core-site.xml misconfigured | `cat $HADOOP_HOME/etc/hadoop/core-site.xml` | Ensure `fs.defaultFS` is `hdfs://localhost:9000` | `hdfs dfsadmin -report` |
| **11** | Dataset CSV missing | Not generated yet | `ls -la ./data` | `python3 scripts/generate_data.py --orders 100000 --output ./data` | `ls ./data/*.csv` |
| **12** | PySpark import error | PySpark not installed in venv | `python3 -c "import pyspark"` | `pip install pyspark==3.5.0` | `python3 -c "import pyspark; print(pyspark.__version__)"` |
| **13** | Spark cannot connect to HDFS | HDFS port mismatch | `echo $HADOOP_HOME` | Use `hdfs://localhost:9000/...` in Spark session | Run PySpark test script |
| **14** | `npm: command not found` in Windows | Node.js not in PATH | `node -v` | Install Node.js LTS from nodejs.org | `npm -v` |
| **15** | Backend fails with `EADDRINUSE: 5000` | Port 5000 in use | `Get-NetTCPConnection -LocalPort 5000` | Stop existing node process | `npm run dev` in backend |
| **16** | Frontend fails with `Port 5173 in use` | Another Vite server open | `Get-NetTCPConnection -LocalPort 5173` | Close other Vite instance | `npm run dev` in frontend |
| **17** | Kafka broker won't start | Zookeeper not started | `netstat -tuln \| grep 2181` | Start Zookeeper daemon before Kafka | `netstat -tuln \| grep 9092` |
| **18** | Kafka topic `ecommerce-orders` missing | Topic not created | `kafka-topics.sh --list` | Run topic creation command | `kafka-topics.sh --list` |
| **19** | Backend reports `hdfs: disconnected` | WebHDFS disabled or NameNode down | Check `http://localhost:9870` | Verify `dfs.webhdfs.enabled=true` in `hdfs-site.xml` | `GET /api/health` |
| **20** | Backend reports `kafka: disconnected` | Kafka broker offline | `netstat -tuln \| grep 9092` | Start Kafka server | `GET /api/health` |
| **21** | Backend reports `spark: disconnected` | SPARK_HOME empty | Check `backend/.env` | Set `SPARK_HOME` path in `backend/.env` | `GET /api/health` |
| **22** | Backend reports `mongodb: disconnected` | Invalid URI or network timeout | Test `npm run init:mongodb` | Check Internet connection / `.env` MONGODB_URI | `GET /api/health` |
| **23** | Backend reports `hive: disconnected` | HiveServer2 not running | `netstat -tuln \| grep 10000` | Normal/Expected if not running HiveServer2 | `GET /api/health` |
| **24** | Dashboard showing `DEMO MODE` | DATA_MODE set to demo | `cat backend/.env` | Set `DATA_MODE=bigdata` in `backend/.env` | Top badge shows `BIG DATA MODE` |
| **25** | API CORS Error | Port mismatch in `.env` | Inspect browser console | Set `FRONTEND_URL=http://localhost:5173` in `.env` | Refresh frontend |
| **26** | TypeScript errors on build | Outdated node_modules | `npm run typecheck` | Run `npm install` in backend and frontend | `npm run typecheck` |
| **27** | Production build fails | Asset missing | `npm run build` | Check build log errors | `npm run build` exits 0 |
| **28** | SSE stream not updating on `/live` | Kafka producer inactive | Check network tab `/api/live/stream` | Emit live test event on `/live` page | Live order appears |
| **29** | Reports not saving | MongoDB connection dropped | `POST /api/reports/generate` | Verify MongoDB Atlas health | `GET /api/reports` returns items |
| **30** | HDFS SafeMode active | NameNode in read-only mode | `hdfs dfsadmin -safemode get` | `hdfs dfsadmin -safemode leave` | `hdfs dfsadmin -safemode get` is OFF |

---

# 23. Final Setup Verification Checklist

Print or review this checklist before marking your PC setup complete:

- [ ] **WSL2 Installed**: Windows Subsystem for Linux version 2 active.
- [ ] **Ubuntu Running**: Ubuntu LTS installed and updated.
- [ ] **SSH Configured**: Passwordless `ssh localhost` working without prompt.
- [ ] **Java 11 Installed**: `java -version` returns OpenJDK 11.
- [ ] **Hadoop Configured**: `core-site.xml` and `hdfs-site.xml` populated.
- [ ] **NameNode & DataNode Running**: `jps` confirms active Hadoop daemons.
- [ ] **HDFS Web UI Accessible**: `http://localhost:9870` displays live cluster.
- [ ] **HDFS Datasets Ingested**: All 5 directories in `/ecommerce/*` populated with CSVs.
- [ ] **PySpark Working**: PySpark reads `/ecommerce/products` from HDFS.
- [ ] **Kafka Broker Running**: Port 9092 active and topic `ecommerce-orders` created.
- [ ] **Node.js Installed**: Node v18+ and npm installed on Windows host.
- [ ] **Backend Dependencies**: `npm install` completed with 0 errors.
- [ ] **Frontend Dependencies**: `npm install` completed with 0 errors.
- [ ] **Environment File Placed**: `backend/.env` configured with `DATA_MODE=bigdata`.
- [ ] **MongoDB Atlas Connected**: `GET /api/health` returns `"mongodb": "connected"`.
- [ ] **Backend Server Active**: Listening on `http://localhost:5000`.
- [ ] **Frontend Application Active**: Accessible at `http://localhost:5173`.
- [ ] **Dashboard Verified**: Displays `BIG DATA MODE`, Revenue `₹16.93 Cr`, Orders `16,548`.
- [ ] **Live Kafka Analytics Verified**: Real-time event streaming functional on `/live`.
- [ ] **Backend Typecheck**: `npm run typecheck` exits with 0 errors.
- [ ] **Frontend Typecheck**: `npm run typecheck` exits with 0 errors.
- [ ] **Frontend Production Build**: `npm run build` succeeds cleanly.
