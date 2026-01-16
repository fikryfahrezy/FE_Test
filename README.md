# Highway Front End

- [highway.fahrezy.work](https://highway.fahrezy.work)

### Prerequisites

- Node.js 24 or higher
- npm 11 or higher
- pnpm 10 or higher

### Quick Start

#### Local Development

1. **Clone the repository**:

```bash
git clone <repository-url>
cd <clone directory>
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Setup environment**:

```bash
cp .env.example .env
# Edit values on the .env with the real value if needed
```

5. **Start the development**:

```bash
pnpm run dev
```

### Build the Application

#### Without Docker

```bash
pnpm build
```

#### With Docker

```bash
docker -t <container name:tag> build .
```

#### Run with Docker Compose

```bash
docker compose up --build
```

### Project Structure

```
project-root/
└── src/
    ├── app                             # Next.js default directory for routing
    ├── components/                     # Shareable global component accross the project
    │   └── <group>/                    # The group of component intended for
    │       └──  <component-name>.tsx
    ├── contexts/                       # Global React's custom hook accross the project
    │   └── <context-name>.ts
    ├── features/                       # Feature / domain specific code (components, hooks, contexts, utils, etc)
    │   └── <feature-name>/
    │        ├── <components>/
    │        ├── <hooks>/
    │        └── <other-code>.ts/tsx
    ├── hooks/                          # Shareable global React's custom hook accross the project
    │   └── <hook-name>.ts
    ├── providers/                      # Global React's custom hook accross the project
    │   └── <provider-name>.ts
    ├── services/                       # SDK for external API service
    │    ├── <service-name>.ts
    │    └── use-<service-name>.ts      # Custom hook for managing sever state
    └── utils/
         └── <util-name>.ts             # Shareable utility function
```
