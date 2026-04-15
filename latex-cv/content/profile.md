# Harsh Saw — Raw Profile Content
# This file is the single source of truth for all resume content.
# Edit here first, then regenerate LaTeX variants.

## Contact
- Name: Harsh Saw
- Phone: +1 (778) 583-2260
- Location: Kelowna, BC, Canada
- Email: mister.harshkumar@gmail.com
- LinkedIn: linkedin.com/in/harshsaw
- GitHub: github.com/harshsaw
- Portfolio: harshsaw.me

## Education
- Degree: Bachelor of Computer Information Systems
- School: Okanagan College
- Location: Kelowna, BC, Canada
- Expected: Dec 2026
- Work Auth: Study permit + co-op work permit (authorized to work in Canada)

## Work Experience

### OmMuse — Software Engineer Intern | Seattle, US (Remote) | Nov 2025–Present
B1: Architecting AI-powered semantic search and natural language chat for enterprise studio workflows using a RAG pipeline (MongoDB Vector Store, AWS Bedrock), enabling producers to query projects, tracks, and collaborators conversationally.
B2: Built HubSpot CRM sync for a 12K+ user music platform in Go — async batch worker using sync.Map deduplication (30s flush, 100-user chunks) syncing live metrics across 8 API trigger points; platform manages 18K+ tracks and 67 GB of user audio.
B3: Engineered a cross-platform desktop uploader (Electron) with persistent folder-sync engine (chokidar + SQLite WAL), parallelized S3 multipart uploads, OAuth 2.0 PKCE auth flow, and a typed IPC bridge exposing 70+ gRPC service methods to the renderer.
B4: Shipped features across a polyglot monorepo (Go gRPC/protobuf, TypeScript/React, Python) unified by Bazel, owning full deployment infrastructure — AWS (S3, SQS, ECR), Docker, Pulumi IaC, Envoy proxy, and GitHub Actions CI/CD.

### MoreThinks Solutions Ltd. — Full-Stack Developer Intern | Burnaby, BC | Jun–Sept 2025
B1: Developed full-stack features using Qwik.js and SurrealDB in a monorepo, with CI/CD automation via AWS EKS and API Gateway.
B2: Engineered automated token generation and vector embedding pipelines, producing structured data consumed by ML services for recommendation.

### Bwisher Ltd. — Software Engineer Intern | Remote | Dec 2024–Jun 2025
B1: Architected a multi-channel marketing platform using Apache Kafka and BullMQ, orchestrating personalized SMS, email, and WhatsApp campaigns with custom offers across 30K+ users while feeding real-time CRM and analytics pipelines.
B2: Designed idempotent NestJS and FastAPI microservices for payment and credit workflows with retry and exponential backoff strategies, eliminating duplicate transactions in high-stakes financial operations.
B3: Owned end-to-end deployment infrastructure with Jenkins, Kubernetes, Prometheus, and Grafana; shipped features behind feature flags enabling safe tenant-by-tenant rollouts with instant kill-switch control.
B4: Built FastAPI services for customer behavior aggregation and demand forecasting, generating segmented targeting data consumed by the Kafka-driven campaign pipeline to optimize offer personalization across 30K+ users.

### Jythu Ltd. — Full-Stack Developer Intern | Remote | Jan–Dec 2024
B1: Shipped two production React Native apps (LMS + admin panel) with Node.js backends serving 2K+ learners; provisioned full AWS infrastructure with Terraform and GitHub Actions CI/CD, with multi-layer anti-piracy controls including device-bound auth.
B2: Built an end-to-end video streaming pipeline using FFmpeg HLS transcoding delivered via S3/CloudFront, orchestrated through SQS, Lambda, and SNS — reducing seek time from 30s to 1.5s and cutting bandwidth by approximately 70%.

## Projects

### Document Intelligence Platform (RAG)
Stack: FastAPI, LangChain, Qdrant, Groq, Gemini, AWS ECS Fargate, Docker
Links: harshsaw.me | github.com/harshsaw
B1: Architected a multi-tenant RAG platform with session-isolated Qdrant indexes, enabling semantic search and conversational Q&A over PDF, DOCX, and TXT documents.
B2: Engineered resilient LLM orchestration using LangChain RunnableWithFallbacks, implementing automatic provider failover (Groq to Gemini) with streaming retrieval pipelines featuring context-aware query rewriting and hybrid document chunking.
B3: Deployed to AWS ECS Fargate with GitHub Actions CI/CD; designed idempotent ingestion using SHA-256 fingerprinting to deduplicate embeddings and reduce redundant indexing.

### CodeExpo — Browser-Based IDE & Sandbox
Stack: React, Node.js, WebSocket, Docker, Nginx, xterm.js, Socket.IO
Links: harshsaw.me | github.com/harshsaw
B1: Engineered a full-stack browser-based IDE with live terminal via xterm.js and WebSocket, real-time code execution with browser preview pane, and Socket.IO file synchronization.
B2: Architected containerized sandbox environments using Docker with multi-stage builds and Nginx reverse proxy, managing isolated execution contexts per session.

## Skills
Languages: JavaScript (ES6+), TypeScript, Python, Go (Golang), Bash
Frontend & Mobile: React, Next.js, React Native, Qwik.js, Electron
Backend & Messaging: NestJS, FastAPI, Express, Fastify, GraphQL, gRPC/Protobuf, Apache Kafka, BullMQ, RabbitMQ
Databases: PostgreSQL, MongoDB, DynamoDB, Redis, MySQL, SurrealDB, SQLite
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, Terraform, Pulumi, Bazel, Jenkins, GitHub Actions
AI & GenAI: LangChain, LangSmith, AutoGen, RAG, FAISS, Pinecone, Qdrant, AstraDB, AWS Bedrock

## Achievements
A1: Built an end-to-end stock prediction pipeline covering 500 S&P 500 constituents over 5 years of 15-minute bar data — XGBoost models trained across 26 intraday horizons on 4x NVIDIA H100 GPUs (DRAC), with automated warm-start retraining every 15 minutes during market hours.
A2: Ranked in the top 2% of verified freelancers on Freelancer.com with a 5-star rating, delivering 25+ production-grade projects.
A3: Won an inter-university college hackathon, demonstrating innovative problem-solving and technical proficiency.

---
# ADD MORE DETAILS BELOW THIS LINE
# Paste anything: new projects, certifications, courses, publications,
# open source contributions, personal strengths, anything you want on your resume.
# Format doesn't matter — just write naturally and I'll integrate it.
