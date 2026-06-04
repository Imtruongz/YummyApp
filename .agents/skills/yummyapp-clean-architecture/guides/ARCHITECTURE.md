# YummyApp Clean Architecture Guide

## Understanding the 3 Layers

### Layer 1: Domain Layer (Pure Business Logic)

**Location:** `src/features/[feature]/domain/`

**Purpose:** 
- Defines what your feature does (business rules)
- Zero dependencies on external frameworks
- Framework-agnostic pure logic

**Contains:**
- `entities/` - Data structures representing business concepts
- `repositories/` - Abstract interfaces defining repository contracts

**Example: Authentication**

```typescript
// src/features/authentication/domain/entities/user.ts
export type User = {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  createdAt: Date
}

// src/features/authentication/domain/repositories/auth_repository.ts
import { Either } from '@shared/errors'
import { Failure } from '@shared/errors'

export interface IAuthRepository {
  login(email: string, password: string): Promise<Either<Failure, User>>
  register(userData: RegisterInput): Promise<Either<Failure, User>>
  logout(): Promise<Either<Failure, void>>
  getCurrentUser(): Promise<Either<Failure, User>>
  refreshToken(): Promise<Either<Failure, string>>
}
```

**Key Rules:**
- ✅ NO imports from `react-native`, `redux`, or external libraries
- ✅ Pure TypeScript/Dart types and interfaces
- ✅ Repository is abstract (interface/protocol)
- ✅ No implementation details
- ✅ Focused on business rules

---

### Layer 2: Data Layer (API & Storage)

**Location:** `src/features/[feature]/data/`

**Purpose:**
- Implements repository interfaces
- Handles API calls and data storage
- Converts between network/storage format and domain entities

**Contains:**
- `datasources/` - External data sources (APIs, local storage)
- `repositories/` - Repository implementations
- `models/` - Data models for API responses

**Example: Authentication**

```typescript
// src/features/authentication/data/datasources/auth_remote_datasource.ts
import { apiClient } from '@shared/services'

export type LoginResponse = {
  accessToken: string
  user: UserDto
}

export type UserDto = {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  createdAt: string
}

export class AuthRemoteDatasource {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  }

  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/register', { email, password, name })
    return response.data
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  }
}

// src/features/authentication/data/datasources/auth_local_datasource.ts
import { storage } from '@shared/services'

export class AuthLocalDatasource {
  async saveToken(token: string): Promise<void> {
    await storage.setString('auth_token', token)
  }

  async getToken(): Promise<string | null> {
    return await storage.getString('auth_token')
  }

  async clearToken(): Promise<void> {
    await storage.delete('auth_token')
  }

  async saveUser(user: UserDto): Promise<void> {
    await storage.setString('user', JSON.stringify(user))
  }

  async getUser(): Promise<UserDto | null> {
    const user = await storage.getString('user')
    return user ? JSON.parse(user) : null
  }
}

// src/features/authentication/data/models/user_model.ts
import { User } from '../../domain/entities/user'
import { UserDto } from '../datasources/auth_remote_datasource'

export class UserModel {
  static fromJson(json: UserDto): User {
    return {
      id: json.id,
      email: json.email,
      name: json.name,
      phone: json.phone,
      avatar: json.avatar,
      createdAt: new Date(json.createdAt),
    }
  }

  static toJson(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
    }
  }
}

// src/features/authentication/data/repositories/auth_repository_impl.ts
import { Either, right, left } from '@shared/errors'
import { Failure } from '@shared/errors'
import { ErrorMapper } from '@shared/errors'
import { IAuthRepository } from '../../domain/repositories/auth_repository'
import { User } from '../../domain/entities/user'
import { AuthRemoteDatasource } from '../datasources/auth_remote_datasource'
import { AuthLocalDatasource } from '../datasources/auth_local_datasource'
import { UserModel } from '../models/user_model'

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private remoteDatasource: AuthRemoteDatasource,
    private localDatasource: AuthLocalDatasource,
  ) {}

  async login(email: string, password: string): Promise<Either<Failure, User>> {
    try {
      const response = await this.remoteDatasource.login(email, password)
      const user = UserModel.fromJson(response.user)
      
      // Save token and user locally
      await this.localDatasource.saveToken(response.accessToken)
      await this.localDatasource.saveUser(response.user)
      
      return right(user)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }

  async register(userData: RegisterInput): Promise<Either<Failure, User>> {
    try {
      const response = await this.remoteDatasource.register(
        userData.email,
        userData.password,
        userData.name,
      )
      const user = UserModel.fromJson(response.user)
      
      await this.localDatasource.saveToken(response.accessToken)
      await this.localDatasource.saveUser(response.user)
      
      return right(user)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }

  async logout(): Promise<Either<Failure, void>> {
    try {
      await this.remoteDatasource.logout()
      await this.localDatasource.clearToken()
      return right(undefined)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }

  async getCurrentUser(): Promise<Either<Failure, User>> {
    try {
      const user = await this.localDatasource.getUser()
      if (!user) {
        return left(Failure({ message: 'No user found' }))
      }
      return right(UserModel.fromJson(user))
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }

  async refreshToken(): Promise<Either<Failure, string>> {
    try {
      const response = await this.remoteDatasource.refreshToken()
      await this.localDatasource.saveToken(response)
      return right(response)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }
}

// src/features/authentication/data/data.ts (Barrel export)
export * from './datasources/auth_remote_datasource'
export * from './datasources/auth_local_datasource'
export * from './repositories/auth_repository_impl'
export * from './models/user_model'
```

**Key Rules:**
- ✅ Implements repository interface from Domain
- ✅ Handles all error cases
- ✅ Uses Either<Failure, Success> pattern
- ✅ Converts between DTO and Entity
- ✅ Manages external data sources

---

### Layer 3: Presentation Layer (Redux + UI)

**Location:** `src/features/[feature]/presentation/`

**Purpose:**
- Redux state management for feature
- Screens and UI components
- React hooks and event handlers

**Contains:**
- `redux/` - Redux slices and thunks
- `screens/` - Feature screens
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks

**Example: Authentication**

```typescript
// src/features/authentication/presentation/redux/auth_slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../domain/entities/user'
import { AuthRepositoryImpl } from '../../data/repositories/auth_repository_impl'

const authRepository = new AuthRepositoryImpl(
  new AuthRemoteDatasource(),
  new AuthLocalDatasource(),
)

// Define thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const result = await authRepository.login(email, password)
    return result.fold(
      (failure) => rejectWithValue(failure.message),
      (user) => user,
    )
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterInput, { rejectWithValue }) => {
    const result = await authRepository.register(userData)
    return result.fold(
      (failure) => rejectWithValue(failure.message),
      (user) => user,
    )
  },
)

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  const result = await authRepository.logout()
  return result.fold(
    (failure) => rejectWithValue(failure.message),
    () => undefined,
  )
})

// Define slice
interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.error = null
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
        state.error = null
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.loading = false
        state.error = null
        state.isAuthenticated = false
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = authSlice.actions

// src/features/authentication/presentation/redux/auth.ts (Barrel export)
export { authSlice, login, register, logout, clearError }
export type { AuthState }

// src/features/authentication/presentation/screens/LoginScreen.tsx
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@core/redux'
import { login, clearError } from '../redux/auth_slice'
import { AppColors, AppSpacing } from '@shared/design-system'
import { TextInput } from '@shared/components'
import { LoginForm } from '../components/LoginForm'

export function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleLogin = async (email: string, password: string) => {
    const result = await dispatch(login({ email, password }))
    if (result.type === login.fulfilled.type) {
      navigation.replace('Home')
    }
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home')
    }
  }, [isAuthenticated, navigation])

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background_main }}>
      <View style={{ padding: AppSpacing.lg }}>
        <Text style={{ color: AppColors.text_primary, marginBottom: AppSpacing.md }}>
          Login to YummyApp
        </Text>

        <LoginForm onSubmit={handleLogin} loading={loading} />

        {error && (
          <Text
            style={{
              color: AppColors.error,
              marginTop: AppSpacing.md,
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        )}
      </View>
    </View>
  )
}

// src/features/authentication/presentation/components/LoginForm.tsx
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { TextInput } from '@shared/components'
import { AppColors, AppSpacing } from '@shared/design-system'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  loading: boolean
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handlePress = () => {
    if (email && password) {
      onSubmit(email, password)
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        style={{ marginBottom: AppSpacing.md }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{ marginBottom: AppSpacing.lg }}
      />

      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        style={{
          backgroundColor: loading ? AppColors.text_tertiary : AppColors.primary,
          padding: AppSpacing.md,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: AppColors.background_main,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

// src/features/authentication/presentation/presentation.ts (Barrel export)
export { LoginScreen, SignupScreen } from './screens'
export { LoginForm, SignupForm } from './components'
export { authSlice, login, register, logout } from './redux/auth_slice'
```

**Key Rules:**
- ✅ Redux for server state (user data, loading, errors)
- ✅ Local useState for temporary UI state
- ✅ createAsyncThunk for async operations
- ✅ Use repository from Data layer
- ✅ Handle errors gracefully
- ✅ Use design system tokens

---

## Feature Barrel Exports

Create barrel exports for easy imports:

```typescript
// src/features/authentication/authentication.ts
export * from './domain'
export * from './data'
export * from './presentation'

// Usage:
import { login, LoginScreen, IAuthRepository, User } from '@features/authentication'
```

---

## Dependency Injection

Setup repository dependencies in store or service locator:

```typescript
// src/core/redux/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '@features/authentication'
import { authRepository } from '@core/di/service-locator'

// Pass repository to thunks
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // ... other slices
  },
})

// src/core/di/service-locator.ts
import { AuthRepositoryImpl } from '@features/authentication'
import { AuthRemoteDatasource, AuthLocalDatasource } from '@features/authentication'

export const authRepository = new AuthRepositoryImpl(
  new AuthRemoteDatasource(),
  new AuthLocalDatasource(),
)
```

---

## Summary

| Layer | Location | Purpose | Example |
|-------|----------|---------|---------|
| **Domain** | `domain/` | Business rules | Entities, Repository interfaces |
| **Data** | `data/` | API & Storage | Datasources, Repository impl, Models |
| **Presentation** | `presentation/` | UI & State | Redux slices, Screens, Components |

**Flow:**
```
Component (User interaction)
  ↓
Redux slice (State management)
  ↓
Repository impl (Business logic)
  ↓
Datasource (API call)
  ↓
Server/Storage
  ↓
Response mapped back through layers
```

**Remember:**
- ✅ Keep layers independent
- ✅ Always use Either<Failure, Success>
- ✅ Use design system tokens
- ✅ Handle errors consistently
- ✅ Test each layer separately
