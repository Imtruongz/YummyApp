---
name: yummyapp-clean-architecture
description: Build YummyApp features following Clean Architecture pattern with Redux Toolkit, TypeScript, Error Handling, and Design System integration. Use when building new screens, integrating APIs, managing state, or refactoring features. Enforces strict layer separation (domain/data/presentation), mandatory error handling with Either pattern, design system compliance, and Redux state management.
compatibility: Requires React Native 0.77+, Node 18+, TypeScript 5.0+, Redux Toolkit 2.5+, Axios 1.7+, React Navigation 7.0+
metadata:
  version: '1.0.0'
  author: YummyApp Team
  category: react-native-architecture
  status: Active
---

# YummyApp Clean Architecture

**Status:** 🚀 **Active** (Tier 2/3 - Production Ready)

This skill enforces YummyApp's specific Clean Architecture, Redux state management, TypeScript strict mode, Either-based error handling, design system compliance, and project structure.

> **⚠️ Use Redux Toolkit ALWAYS:** Global state management for authentication, user data, and app configuration
>
> - Redux for server state (API data, user info)
> - Local component state with hooks for UI state
> - Never mix Context API + Redux

> **✅ Implement Clean Architecture (3 Layers):**
>
> - **Domain Layer**: Business entities, abstract repositories, use cases
> - **Data Layer**: API datasources, repository implementations, data models
> - **Presentation Layer**: Redux slices, screens, components, hooks
> - Strict layer separation - no cross-layer shortcuts

> **⚠️ Use TypeScript Strict Mode:** Enable `"strict": true` in tsconfig.json
>
> - Catch type errors at compile-time
> - Mandatory return types
> - No implicit `any` types

> **🔐 Error Handling with Either Pattern:**
>
> - ALWAYS return `Either<Failure, Success>` from repository methods
> - Map errors to custom Failure types
> - Never throw errors in repositories
> - Handle errors in Redux thunks and UI layers

> **🎨 Use Design System ALWAYS:**
>
> - Import from `@/utils/color`
> - Import from design system spacing tokens
> - Import from `@/utils/fonts` (Poppins fontFamily)
> - NO hardcoded values

> **📡 API Integration Pattern:**
>
> - Create datasource in `data/datasources/`
> - Create repository implementation in `data/repositories/`
> - Wire up in Redux slice via createAsyncThunk
> - Never call API directly in components

> **🧪 Testing Ready:**
>
> - Write unit tests for repositories
> - Write component tests for screens
> - Mock datasources in tests

---

## 📚 Quick Navigation

**Just started? Begin here based on your task:**

| Task | Reference |
| --- | --- |
| 🏗️ Build new feature/screen | [YummyApp Folder Structure](#yummyapp-folder-structure) + [ARCHITECTURE.md](guides/ARCHITECTURE.md) |
| 📋 Copy code templates | [Templates Guide](templates/README.md) — Ready-to-use components |
| 🧠 Understand architecture | [ARCHITECTURE.md](guides/ARCHITECTURE.md) |
| ⚠️ Handle errors properly | [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) |
| 🎛️ Manage state with Redux | [REDUX.md](guides/REDUX.md) |
| 🎨 Use design system | [DESIGN_SYSTEM.md](guides/DESIGN_SYSTEM.md) |
| 🔍 Naming & Import rules | [CONVENTIONS.md](guides/CONVENTIONS.md) |
| ⚠️ Common mistakes | [COMMON_PITFALLS.md](guides/COMMON_PITFALLS.md) |
| 📈 Refactor old feature | [MIGRATION.md](guides/MIGRATION.md) |

---

## YummyApp Folder Structure

```
src/
├── features/                                    ← Feature folders (auth, category, etc.)
│   ├── authentication/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.ts
│   │   │   └── repositories/
│   │   │       └── auth_repository.ts
│   │   │
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── auth_remote_datasource.ts
│   │   │   │   └── auth_local_datasource.ts
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository_impl.ts
│   │   │   ├── models/
│   │   │   │   └── user_model.ts
│   │   │   └── data.ts
│   │   │
│   │   ├── presentation/
│   │   │   ├── redux/
│   │   │   │   ├── auth_slice.ts
│   │   │   │   └── auth.ts
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── SignupScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   └── presentation.ts
│   │   │
│   │   └── authentication.ts
│   │
│   ├── category/
│   │   ├── domain/
│   │   ├── data/
│   │   ├── presentation/
│   │   └── category.ts
│   │
│   └── ... (other features)
│
├── shared/                                      ← Shared code
│   ├── components/
│   │   ├── buttons/
│   │   ├── inputs/
│   │   └── loaders/
│   │
│   ├── design-system/
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── errors/
│   │   ├── failures.ts
│   │   └── error-mapper.ts
│   │
│   └── constants/
│       └── app-constants.ts
│
├── core/                                        ← Core app setup
│   ├── navigation/
│   │   └── app-navigator.tsx
│   ├── redux/
│   │   ├── store.ts
│   │   ├── root-reducer.ts
│   │   └── middleware.ts
│   └── di/
│       └── service-locator.ts
│
├── i18n/                                        ← Internationalization
│   ├── locales/
│   └── i18n.ts
│
└── main.tsx                                     ← Entry point
```

---

## Decision Tree: What to Build

```
Task → What are you building?
  │
  ├─ New screen/feature (e.g., Categories List)
  │   └─ Full feature with Clean Architecture:
  │      1. Create feature folder (src/features/[feature]/)
  │      2. Define domain entities
  │      3. Create data layer (datasources, repositories)
  │      4. Create Redux slice
  │      5. Build UI (screens, components)
  │
  ├─ New component only
  │   ├─ Feature-specific: src/features/[feature]/presentation/components/
  │   ├─ Shared: src/shared/components/
  │   └─ Use design system (NO hardcoded values)
  │
  ├─ API integration
  │   └─ Create data layer:
  │      1. Datasource (src/features/[feature]/data/datasources/)
  │      2. Repository impl (src/features/[feature]/data/repositories/)
  │      3. Wire in Redux slice
  │
  └─ Refactoring
      └─ Check for:
         1. Hardcoded colors/spacing → Use design system
         2. API calls in components → Move to datasources
         3. Business logic in screens → Move to repositories
         4. Unhandled errors → Use Either pattern
         5. Direct Redux slices usage → Use Redux hooks
```

---

## Layer Definitions

### **Domain Layer** (Business Logic)
- Pure, framework-independent
- Entities and repository interfaces
- No external dependencies

```typescript
// features/[feature]/domain/entities/[entity].ts
export type Entity = {
  id: string;
  name: string;
  // ... properties
}

// features/[feature]/domain/repositories/[feature]_repository.ts
export interface I[Feature]Repository {
  get[Items](): Promise<Either<Failure, Entity[]>>;
  get[Item]ById(id: string): Promise<Either<Failure, Entity>>;
}
```

### **Data Layer** (API & Storage)
- Datasources (external data sources)
- Repository implementations
- Data models and mappers

```typescript
// features/[feature]/data/datasources/[feature]_remote_datasource.ts
export class [Feature]RemoteDatasource {
  async get[Items](): Promise<Response[]> {
    const response = await apiClient.get('/endpoint');
    return response.data;
  }
}

// features/[feature]/data/repositories/[feature]_repository_impl.ts
export class [Feature]RepositoryImpl implements I[Feature]Repository {
  async get[Items](): Promise<Either<Failure, Entity[]>> {
    try {
      const response = await this.datasource.get[Items]();
      return right(response);
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error));
    }
  }
}
```

### **Presentation Layer** (Redux + UI)
- Redux slices and thunks
- Screens and components
- React hooks for UI state

```typescript
// features/[feature]/presentation/redux/[feature]_slice.ts
export const [feature]Slice = createSlice({
  name: '[feature]',
  initialState: { data: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder.addCase(fetch[Items].fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
  }
})

// features/[feature]/presentation/screens/[Feature]Screen.tsx
export function [Feature]Screen() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.[feature]);

  useEffect(() => {
    dispatch(fetch[Items]());
  }, [dispatch]);

  return <View>{/* UI */}</View>;
}
```

---

## Naming Conventions

- ✅ Features: `kebab-case` (authentication, category, food-detail)
- ✅ Files: `kebab-case` (user-repository.ts, login-screen.tsx)
- ✅ Components: `PascalCase` (LoginScreen, UserCard)
- ✅ Variables/functions: `camelCase` (userData, getUserData)
- ✅ Constants: `UPPER_CASE` (API_BASE_URL, MAX_RETRIES)
- ✅ Redux slices: `camelCase` (auth, category)

---

## YummyApp Design System

### Colors
Import from `@/utils/color`:
- `colors.primary`: `'#F59624'` (Warm orange)
- `colors.success`: `'#5cb85c'` (Green)
- `colors.danger`: `'#d9534f'` (Red)
- `colors.primaryText`: `'#0F172A'` (Dark text)

### Spacing
Import from `@/shared/design-system`:
- `AppSpacing.xs`: `4`
- `AppSpacing.sm`: `8`
- `AppSpacing.md`: `16`
- `AppSpacing.lg`: `24`
- `AppSpacing.xl`: `32`

---

## Import Patterns

✅ **CORRECT** - Import using path alias and barrel exports:
```typescript
import { User, IAuthRepository } from '@/features/authentication';
import { colors } from '@/utils/color';
import { Typography } from '@/components/Typography';
```

❌ **WRONG** - Deep relative imports:
```typescript
import User from '../../domain/entities/user';
import colors from '../../../utils/color';
```

---

## Checklist Before Shipping

- [ ] Feature folder created in `src/features/[feature]/`
- [ ] Domain layer (entities, repositories) defined
- [ ] Data layer (datasources, repositories) implemented
- [ ] Redux slice created and integrated
- [ ] Screens and components built
- [ ] All values from design system (no hardcoded colors/spacing)
- [ ] Error handling with Either pattern
- [ ] TypeScript strict mode enabled
- [ ] Import patterns follow barrel exports & path alias
- [ ] Code reviewed for layer violations

---

## Next Steps

1. Read [ARCHITECTURE.md](guides/ARCHITECTURE.md) for detailed patterns
2. Learn [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) for error patterns
3. Read [DESIGN_SYSTEM.md](guides/DESIGN_SYSTEM.md) for UI spacing & typography rules
4. Learn [REDUX.md](guides/REDUX.md) for slice & AsyncThunk structure
5. Use [templates/](templates/) for code generation
6. Follow [CONVENTIONS.md](guides/CONVENTIONS.md) for naming rules
7. Read [MIGRATION.md](guides/MIGRATION.md) for refactoring steps
