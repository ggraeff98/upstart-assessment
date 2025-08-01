# Upstart Assessment

A full-stack TypeScript project providing geocoding and weather forecast services with a modern React frontend and robust API backend.

---

## Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Axios**
- **Vite**
- **React**
- **TailwindCSS**
- **Vite** **TypeScript**

### Testing

- **Vitest**
- **@testing-library/react**
- **@testing-library/jest-dom**
- **Cypress**

---

## Getting Started

### Prerequisites

- **Node.js** v22.11.0+
- **pnpm**

### Installation

```sh
pnpm install
```

---

## Running the Application

### Development Mode

Runs both the API and the React app with hot reload:

```sh
pnpm dev
```

### Production Build

Build and serve the app for production:

```sh
# Build
pnpm build:app
pnpm build:client
pnpm build:server

# Start production server
pnpm preview
```

---

## Testing

### Unit & Integration Tests (Vitest)

- Located in `src/__tests__`.
- Uses Testing Library for React components and API mocks.

Run all tests:

```sh
pnpm test
```

### End-to-End (E2E) Tests (Cypress)

- Located in `cypress/`.
- Configured via `cypress.config.cjs`.

Run Cypress UI:

```sh
pnpm test:e2e
```

---
