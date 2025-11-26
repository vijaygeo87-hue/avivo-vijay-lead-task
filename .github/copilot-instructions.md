# AI Agent Instructions for React Chakra User Portal

## Architecture Overview

This is a **Create React App** project managing a user directory with client-side CRUD operations and search functionality. The architecture follows a **Redux Toolkit + Chakra UI** pattern for state management and styling.

### Key Data Flow
1. **App.js** (entry point) → wraps content in `ChakraProvider` for styling
2. **Redux Store** (`src/redux/store.js`) → manages global `users` state via `usersReducer`
3. **UsersList.js** → only component consuming Redux; dispatches thunks from `userMethods.js`
4. **userMethods.js** → all async actions, form data structures, and Redux slice definition

### Data Schema
Users follow this structure (from dummyjson API):
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  address: { country: string },
  company: { name: string, title: string }
}
```

Form validation enforces all 5 fields as required.

## Critical Patterns & Conventions

### Redux Operations (src/services/userMethods.js)
- Uses **Redux Toolkit's `createSlice` + `createAsyncThunk`** pattern
- All async thunks defined in userMethods.js; extraReducers handle state updates
- **Important**: `deleteUser` and `searchUser` are client-side only—thunks receive full user list and return filtered results
- API calls use: `dummyjson.com/users` (fetch) and `jsonplaceholder.typicode.com` (update)
- Status tracking via `state.status`: 'idle' → 'loading' → 'succeeded'/'failed'

### Component Patterns
- **UsersList.js** (only component with Redux logic):
  - Uses `useDispatch()` and `useSelector()` for state access
  - Validates form fields individually in `validateForm()` before dispatch
  - Search operates on in-memory state; does NOT refetch API
  - Toast notifications on success via Chakra's `useToast()`
  - Table rendering iterates over users with `.map()`

### Chakra UI Integration
- All styling through Chakra components; **no CSS files**
- Color scheme: `colorPalette="teal"` and `colorPalette="green"` for primary actions
- Form controls use `isInvalid` prop with `FormErrorMessage` for validation display
- Modal for "Add User" via `useDisclosure()` hook
- Icons from `@chakra-ui/icons` and `react-icons` library

### Theme Configuration (src/config/theme.js)
- Extends Chakra's default theme
- `initialColorMode: "system"` but `useSystemColorMode: false` (manual toggle preferred)
- ToggleTheme component available but not integrated into App.js

## Development Workflows

### Available npm scripts
```bash
npm start          # Dev server on localhost:3000 (hot reload enabled)
npm run build      # Production build to /build folder
npm test           # Jest runner in watch mode
npm run lint       # ESLint checks on src/**/*.{js,jsx}
```

### Key Dependencies
- **@reduxjs/toolkit** ^2.11.0 — state management
- **@chakra-ui/react** ^2.5.0 — component library
- **axios** ^1.13.2 — HTTP client (used in userMethods.js)
- **react-router-dom** ^6.8.1 — installed but not used (routing not implemented)
- **framer-motion** ^9.0.2 — animation library (unused)

## Common Development Tasks

### Adding a new user action
1. Define `createAsyncThunk` in `src/services/userMethods.js`
2. Add reducer case in `extraReducers` builder
3. Dispatch from UsersList.js with `dispatch(actionName(payload))`
4. Export action from userMethods.js for component import

### Modifying the user form
- Update `formData` state initial shape in UsersList.js
- Add new `FormControl` in the Modal
- Add validation rule in `validateForm()`
- Update `newUserArr` object construction before dispatch

### Changing table columns
- Edit table headers in `<Thead>` section
- Add/remove `<Td>` in the map function rendering user data
- Ensure field names match Redux state schema

## Known Issues & Gaps

- **ToggleTheme component** exists (`src/components/ToggleTheme.js`) but is commented out in App.js—theme switching is incomplete
- **CreateUser.js** file is empty; functionality consolidated into UsersList.js modal
- **Search** does not use API—filters in-memory user list (add `useCallback` optimization if scaling)
- **React Router** installed but no routing implemented (single-page app)
- **Update user** API call uses JSONPlaceholder; changes don't persist to Redux state properly

## Testing Notes

- ESLint config extends `react-app` preset
- No test files present; setup via Create React App's `@testing-library/react`
- Run `npm test` to start interactive test runner

## Integration Points

- **External APIs**: dummyjson.com (user fetch), jsonplaceholder.typicode.com (user update)
- **No backend API** — all delete/search are client-side operations
- **No environment variables used** — hardcoded API URLs in userMethods.js
