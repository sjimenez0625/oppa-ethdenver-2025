# OPPA ICP Dev Account Controller

## Overview
OPPA ICP Dev Account Controller is a Web3-based service designed to facilitate the seamless creation and management of users and Internet Computer Protocol (ICP) wallets. The platform provides a secure and scalable solution for handling digital identities and financial transactions within the ICP ecosystem. 

The system enables users to create ICP wallets, manage their balances, and conduct transactions both internally (between users in the system) and externally (with wallets outside the system). Additionally, it includes webhook support to monitor and track real-time account activities, providing integrations for automated processes and notifications. 

Built with a focus on security and ease of integration, OPPA ICP Dev Account Controller offers a robust API that allows developers to integrate decentralized financial operations into their applications. Whether managing identities, performing ICP transactions, or automating workflows via webhooks, the platform ensures a smooth and reliable experience for Web3 applications.

## Features
- **User Management:** Create and manage user accounts.
- **ICP Wallet Creation:** Generate ICP wallets for users.
- **Funds Transfers:** Transfer ICP tokens between internal wallets and external ICP addresses.
- **Webhook Management:** Configure webhooks to track events.
- **Secure API Access:** Authentication and authorization mechanisms for secure interactions.
- **Transaction History:** Retrieve transaction logs to ensure transparency and track user activity.
- **Scalable Infrastructure:** Designed to support a high number of concurrent transactions with optimized performance.

## API Documentation
The API is documented using Swagger and can be accessed here:
[ICP Dev Account Controller Swagger](https://account-control.icp.ommacash.com/swagger)

## Getting Started
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended LTS version)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)
- A Web3-compatible wallet for testing ICP transactions

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sjimenez0625/oppa-ethdenver-2025.git
   cd oppa-ethdenver-2025
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in required configuration values (e.g., database connection, blockchain API keys)

### Running the Application
#### Development Mode
```sh
npm run dev
```
#### Production Mode
```sh
npm run start
```

## API Endpoints
### General
- **`GET /api/v1/health`** - Check system health.
- **`GET /api/v1/error`** - Debugging endpoint that throws an error.

### User Management
- **`GET /api/v1/user/me`** - Retrieve authenticated user info.
- **`PATCH /api/v1/user/me`** - Update authenticated user profile.
- **`GET /api/v1/user/{id}`** - Retrieve a specific user by ID.
- **`PATCH /api/v1/user/{id}`** - Partially update a user.
- **`PUT /api/v1/user/{id}`** - Replace a user.
- **`DELETE /api/v1/user/{id}`** - Delete a user.
- **`GET /api/v1/user`** - Retrieve multiple users.
- **`POST /api/v1/user`** - Create a new user.
- **`POST /api/v1/user/bulk`** - Create multiple users in bulk.

### ICP Wallet (Identity) Management
- **`POST /api/v1/user/{userId}/identity`** - Create a Web3 identity for a user.
- **`GET /api/v1/user/{userId}/identity/{id}`** - Retrieve an identity.
- **`POST /api/v1/user/{userId}/identity/balance`** - Retrieve ICP wallet balance.
- **`POST /api/v1/user/{userId}/identity/transfer`** - Transfer ICP tokens between wallets.
- **`POST /api/v1/user/{userId}/identity/history`** - Retrieve ICP wallet transaction history.

### Webhook Management
- **`GET /api/v1/webhook/{id}`** - Retrieve a specific webhook.
- **`PATCH /api/v1/webhook/{id}`** - Update a webhook.
- **`PUT /api/v1/webhook/{id}`** - Replace a webhook.
- **`DELETE /api/v1/webhook/{id}`** - Delete a webhook.
- **`GET /api/v1/webhook`** - Retrieve multiple webhooks.
- **`POST /api/v1/webhook`** - Create a new webhook.
- **`POST /api/v1/webhook/bulk`** - Create multiple webhooks in bulk.

### Webhook Log Management
- **`GET /api/v1/webhook_log/{id}`** - Retrieve a specific webhook log.
- **`PATCH /api/v1/webhook_log/{id}`** - Update a webhook log.
- **`PUT /api/v1/webhook_log/{id}`** - Replace a webhook log.
- **`DELETE /api/v1/webhook_log/{id}`** - Delete a webhook log.
- **`GET /api/v1/webhook_log`** - Retrieve multiple webhook logs.
- **`POST /api/v1/webhook_log`** - Create a webhook log.
- **`POST /api/v1/webhook_log/bulk`** - Create multiple webhook logs.

### ICP Transfers
- **`GET /api/v1/transfer/{id}`** - Retrieve details of a specific transfer.

## Deployment
### Docker (Optional)
To deploy using Docker, build and run the container:
```sh
docker build -t oppa-icp-dev-account-controller .
docker run -p 3000:3000 oppa-icp-dev-account-controller
```

## Contact
For inquiries or support, contact:
- [sergio@ommacash.com](mailto:sergio@ommacash.com)
- [victor@ommacash.com](mailto:victor@ommacash.com)
- [isracts@ommacash.com](mailto:isracts@ommacash.com)

