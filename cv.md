# CV -- Harsh Saw

**Location:** Kelowna, BC, Canada
**Phone:** +1 (778) 583-2260
**Email:** mister.harshkumar@gmail.com
**LinkedIn:** linkedin.com/in/harshsaw
**GitHub:** github.com/harshsaw
**Portfolio:** harshsaw.me

## Professional Summary

Full-stack software engineer with 2+ years of internship experience shipping production systems across distributed messaging, cloud infrastructure, and AI pipelines. Currently building RAG and agentic workflows at OmMuse; prior work spans real-time marketing platforms, video streaming infrastructure, and mobile apps serving thousands of users.

## Work Experience

### OmMuse -- Seattle, US
**Software Engineer Intern**
Nov 2025 – Present

- Architecting AI-powered semantic search and natural language chat for enterprise studio workflows using a RAG pipeline (MongoDB Vector Store, AWS Bedrock), enabling producers to query projects, tracks, and collaborators conversationally
- Built HubSpot CRM sync for a 12K+ user music platform in Go — async batch worker using sync.Map deduplication (30s flush, 100-user chunks) syncing live metrics across 8 API trigger points; platform manages 18K+ tracks and 67 GB of user audio
- Engineered a cross-platform desktop uploader (Electron) with persistent folder-sync engine (chokidar + SQLite WAL), parallelized S3 multipart uploads, OAuth 2.0 PKCE auth flow, and a typed IPC bridge exposing 70+ gRPC service methods to the renderer
- Shipped features across a polyglot monorepo (Go gRPC/protobuf, TypeScript/React, Python) unified by Bazel, owning full deployment infrastructure — AWS (S3, SQS, ECR), Docker, Pulumi IaC, Envoy proxy, and GitHub Actions CI/CD

### MoreThinks Solutions Ltd. -- Burnaby, BC
**Full-Stack Developer Intern**
Jun 2025 – Sept 2025

- Developed full-stack features using Qwik.js and SurrealDB in a monorepo, with CI/CD automation via AWS EKS and API Gateway
- Engineered automated token generation and vector embedding pipelines, producing structured data consumed by ML services for recommendation

### Bwisher Ltd -- Remote
**Software Engineer Intern**
Dec 2024 – Jun 2025

- Architected a multi-channel marketing platform using Apache Kafka and BullMQ, orchestrating personalized SMS, email, and WhatsApp campaigns with custom offers across 30K+ users while feeding real-time CRM and analytics pipelines
- Designed idempotent NestJS and FastAPI microservices for payment and credit workflows with retry and exponential backoff strategies, eliminating duplicate transactions in high-stakes financial operations
- Owned end-to-end deployment infrastructure with Jenkins, Kubernetes, Prometheus, and Grafana; shipped features behind feature flags enabling safe tenant-by-tenant rollouts with instant kill-switch control
- Built FastAPI services for customer behavior aggregation and demand forecasting, generating segmented targeting data consumed by the Kafka-driven campaign pipeline to optimize offer personalization across 30K+ users

### Jythu Ltd -- Remote
**Full-Stack Developer Intern**
Jan 2024 – Dec 2024

- Shipped two production React Native apps (LMS + admin panel) with Node.js backends serving 2K+ learners; provisioned full AWS infrastructure with Terraform and GitHub Actions CI/CD, with multi-layer anti-piracy controls including device-bound auth
- Built an end-to-end video streaming pipeline using FFmpeg HLS transcoding delivered via S3/CloudFront, orchestrated through SQS, Lambda, and SNS — reducing seek time from 30s to 1.5s and cutting bandwidth by approximately 70%

## Projects

- **Document Intelligence Platform (RAG)** -- Multi-tenant RAG platform with session-isolated Qdrant indexes, resilient LLM orchestration (Groq → Gemini failover), streaming retrieval pipelines, and idempotent ingestion via SHA-256 fingerprinting. Deployed on AWS ECS Fargate. [Live Demo](#) | [GitHub](#)
- **CodeExpo -- Browser-Based IDE & Sandbox** -- Full-stack browser IDE with live terminal (xterm.js + WebSocket), containerized Docker sandboxes, Monaco Editor, and real-time file sync via Socket.IO. [Live Demo](#) | [GitHub](#)

## Education

- Bachelor of Computer Information Systems, Okanagan College (Expected Dec 2026)

## Skills

- **Languages:** JavaScript (ES6+), TypeScript, Python, Go (Golang), Bash
- **Frontend & Mobile:** React, Next.js, React Native, Qwik.js, Electron
- **Backend & Messaging:** NestJS, FastAPI, Express, Fastify, GraphQL, gRPC/Protobuf, Apache Kafka, BullMQ, RabbitMQ
- **Databases:** PostgreSQL, MongoDB, DynamoDB, Redis, MySQL, SurrealDB, SQLite
- **Cloud & DevOps:** AWS, Azure, Docker, Kubernetes, Terraform, Pulumi, Bazel, Jenkins, GitHub Actions
- **AI & GenAI:** LangChain, LangSmith, AutoGen, RAG, FAISS, Pinecone, Qdrant, AstraDB, AWS Bedrock

## Achievements

- Built an end-to-end stock prediction pipeline covering 500 S&P 500 constituents over 5 years of 15-minute bar data — XGBoost models trained across 26 intraday horizons on 4x NVIDIA H100 GPUs (DRAC), with automated warm-start retraining every 15 minutes during market hours
- Ranked in the top 2% of verified freelancers on Freelancer.com with a 5-star rating, delivering 25+ production-grade projects
- Won an inter-university college hackathon, demonstrating innovative problem-solving and technical proficiency
