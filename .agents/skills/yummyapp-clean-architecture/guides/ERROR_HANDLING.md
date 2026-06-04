# Error Handling with Either Pattern

## Overview

YummyApp uses the **Either<Failure, Success>** pattern for functional error handling. This ensures:
- ✅ No unhandled errors
- ✅ Explicit error types
- ✅ Better error handling in UI
- ✅ Predictable error flow

---

## Either Pattern Basics

```typescript
// @shared/errors/either.ts
export type Either<L, R> = Left<L> | Right<R>

export class Left<L> {
  constructor(readonly value: L) {}

  fold<T>(onLeft: (l: L) => T, onRight: (r: any) => T): T {
    return onLeft(this.value)
  }

  isRight(): this is Right<never> {
    return false
  }

  isLeft(): this is Left<L> {
    return true
  }
}

export class Right<R> {
  constructor(readonly value: R) {}

  fold<T>(onLeft: (l: any) => T, onRight: (r: R) => T): T {
    return onRight(this.value)
  }

  isRight(): this is Right<R> {
    return true
  }

  isLeft(): this is Left<never> {
    return false
  }
}

export const left = <L>(value: L): Either<L, never> => new Left(value)
export const right = <R>(value: R): Either<never, R> => new Right(value)
```

---

## Custom Failure Types

```typescript
// @shared/errors/failures.ts
export abstract class Failure {
  constructor(
    readonly message: string,
    readonly code?: number,
    readonly originalError?: any,
  ) {}

  toString(): string {
    return this.message
  }
}

// Network errors
export class NetworkFailure extends Failure {
  constructor(message: string = 'Network error. Please check your connection.') {
    super(message, -1)
  }
}

// Server errors
export class ServerFailure extends Failure {
  constructor(message: string = 'Server error. Please try again.', code?: number) {
    super(message, code || 500)
  }
}

// Validation errors
export class ValidationFailure extends Failure {
  constructor(message: string = 'Invalid input.') {
    super(message, 422)
  }
}

// Authentication errors
export class AuthFailure extends Failure {
  constructor(message: string = 'Authentication failed.') {
    super(message, 401)
  }
}

// Permission errors
export class PermissionFailure extends Failure {
  constructor(message: string = 'You do not have permission.') {
    super(message, 403)
  }
}

// Not found errors
export class NotFoundFailure extends Failure {
  constructor(message: string = 'Resource not found.') {
    super(message, 404)
  }
}

// Unknown errors
export class UnknownFailure extends Failure {
  constructor(message: string = 'Unknown error occurred.', originalError?: any) {
    super(message, 500, originalError)
  }
}

// Cache/Local storage errors
export class CacheFailure extends Failure {
  constructor(message: string = 'Cache error.') {
    super(message, -2)
  }
}
```

---

## Error Mapper

```typescript
// @shared/errors/error-mapper.ts
import axios from 'axios'

export class ErrorMapper {
  static mapToFailure(error: any): Failure {
    // Network error
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      return new NetworkFailure()
    }

    // Axios error
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message

      switch (status) {
        case 400:
          return new ValidationFailure(message)
        case 401:
          return new AuthFailure(message)
        case 403:
          return new PermissionFailure(message)
        case 404:
          return new NotFoundFailure(message)
        case 500:
        case 502:
        case 503:
          return new ServerFailure(message, status)
        default:
          return new ServerFailure(message, status)
      }
    }

    // Generic error
    if (error instanceof Error) {
      return new UnknownFailure(error.message, error)
    }

    return new UnknownFailure('Unknown error occurred', error)
  }
}
```

---

## Using Either in Repository

**ALWAYS return `Either<Failure, Success>` from repository methods:**

```typescript
// ✅ CORRECT

// features/restaurants/data/repositories/restaurant_repository_impl.ts
export class RestaurantRepositoryImpl implements IRestaurantRepository {
  async getRestaurants(): Promise<Either<Failure, Restaurant[]>> {
    try {
      const response = await this.remoteDatasource.getRestaurants()
      const restaurants = response.map((dto) => RestaurantModel.fromJson(dto).toDomain())
      return right(restaurants)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }

  async getRestaurantById(id: string): Promise<Either<Failure, Restaurant>> {
    try {
      const response = await this.remoteDatasource.getRestaurantById(id)
      const restaurant = RestaurantModel.fromJson(response).toDomain()
      return right(restaurant)
    } catch (error) {
      return left(ErrorMapper.mapToFailure(error))
    }
  }
}

// ❌ WRONG

export class BadRestaurantRepository implements IRestaurantRepository {
  // Throws errors instead of returning Either
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await fetch('/restaurants')
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  }
}
```

---

## Using Either in Redux

```typescript
// features/restaurants/presentation/redux/restaurant_slice.ts

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    const result = await restaurantRepository.getRestaurants()

    // Use fold to handle Either
    return result.fold(
      (failure) => rejectWithValue(failure.message), // Error case
      (restaurants) => restaurants, // Success case
    )
  },
)

export const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})
```

---

## Using Either in Components

```typescript
// Option 1: Handle in Redux (Preferred)
export function RestaurantsScreen() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.restaurants)

  useEffect(() => {
    dispatch(fetchRestaurants())
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorView message={error} onRetry={() => dispatch(fetchRestaurants())} />

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <RestaurantCard restaurant={item} />}
      keyExtractor={(item) => item.id}
    />
  )
}

// Option 2: Handle locally with Either
export function RestaurantDetailScreen({ restaurantId }: Props) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRestaurant()
  }, [])

  const loadRestaurant = async () => {
    setLoading(true)
    const result = await repository.getRestaurantById(restaurantId)

    result.fold(
      (failure) => {
        setError(failure.message)
        // Show toast or alert
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: failure.message,
        })
      },
      (data) => {
        setRestaurant(data)
        setError(null)
      },
    )

    setLoading(false)
  }

  return (
    // UI here
  )
}
```

---

## Best Practices

### ✅ DO

```typescript
// 1. Always return Either from repositories
async getRestaurants(): Promise<Either<Failure, Restaurant[]>> {
  try {
    // logic
  } catch (error) {
    return left(ErrorMapper.mapToFailure(error))
  }
}

// 2. Use fold to handle both cases
result.fold(
  (failure) => handleError(failure),
  (data) => handleSuccess(data),
)

// 3. Use specific Failure types
if (error instanceof AuthFailure) {
  navigate('Login')
} else if (error instanceof NetworkFailure) {
  showRetryButton()
}

// 4. Log errors for debugging
catch (error) {
  console.error('RestaurantRepository error:', error)
  return left(ErrorMapper.mapToFailure(error))
}

// 5. Show user-friendly messages
failure.message // Already user-friendly
```

### ❌ DON'T

```typescript
// 1. Don't throw errors in repository
async getRestaurants(): Promise<Restaurant[]> {
  throw new Error('Failed') // ❌ WRONG
}

// 2. Don't ignore Either
const result = await repository.getRestaurants()
// ... using result without fold

// 3. Don't expose internal errors to user
showAlert(internalError.stack) // ❌ WRONG
showAlert(failure.message) // ✅ OK

// 4. Don't mix error handling styles
try {
  const result = await repository.getRestaurants()
  // ... without fold
} catch (error) {
  // ❌ Won't catch Either errors
}

// 5. Don't create untyped failures
return left(new Error('Something')) // ❌ WRONG
return left(new ServerFailure('Something')) // ✅ CORRECT
```

---

## Error Handling Flow

```
User Action
  ↓
Component dispatch Redux thunk
  ↓
Repository method (returns Either<Failure, Success>)
  ↓
  ├─ Failure
  │  ├─ Map to specific Failure type
  │  ├─ Return left(failure)
  │  ↓
  │  Redux catches in rejected case
  │  ↓
  │  Set state.error = failure.message
  │  ↓
  │  Component shows error UI
  │
  └─ Success
     ├─ Return right(data)
     ↓
     Redux catches in fulfilled case
     ↓
     Set state.data = data
     ↓
     Component shows data
```

---

## Testing Error Handling

```typescript
// tests/repositories/restaurant_repository.test.ts

describe('RestaurantRepository', () => {
  let repository: RestaurantRepositoryImpl

  beforeEach(() => {
    repository = new RestaurantRepositoryImpl(mockDatasource)
  })

  test('should return NetworkFailure on network error', async () => {
    mockDatasource.getRestaurants.mockRejectedValueOnce(new Error('Network Error'))

    const result = await repository.getRestaurants()

    result.fold(
      (failure) => {
        expect(failure).toBeInstanceOf(NetworkFailure)
      },
      () => fail('Should be failure'),
    )
  })

  test('should return ServerFailure on server error', async () => {
    const axiosError = {
      response: { status: 500, data: { message: 'Server error' } },
    }
    mockDatasource.getRestaurants.mockRejectedValueOnce(axiosError)

    const result = await repository.getRestaurants()

    result.fold(
      (failure) => {
        expect(failure).toBeInstanceOf(ServerFailure)
        expect(failure.code).toBe(500)
      },
      () => fail('Should be failure'),
    )
  })

  test('should return restaurants on success', async () => {
    const expectedData = [{ id: '1', name: 'Restaurant' }]
    mockDatasource.getRestaurants.mockResolvedValueOnce(expectedData)

    const result = await repository.getRestaurants()

    result.fold(
      () => fail('Should be success'),
      (restaurants) => {
        expect(restaurants).toEqual(expectedData)
      },
    )
  })
})
```

---

## Summary

| Pattern | Use | Example |
|---------|-----|---------|
| **Either pattern** | All async repository methods | `Promise<Either<Failure, Data>>` |
| **Fold** | Handle both success/failure | `result.fold(onError, onSuccess)` |
| **Specific failures** | Type-safe error handling | `AuthFailure`, `NetworkFailure` |
| **ErrorMapper** | Convert exceptions to failures | `ErrorMapper.mapToFailure(error)` |
| **Redux integration** | Thunk error handling | `rejectWithValue(failure.message)` |

**Remember:** Always use Either, never throw errors from repositories!
