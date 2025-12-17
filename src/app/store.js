import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loggedUserReducer from '../features/users/userSlice';
import roleSlice  from '../features/roles/roleSlice';
import permissionSlice from '../features/permissions/permissionSlice';
import centerSlice from '../features/centers/centerSlice';
import memberSlice from '../features/members/memberSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    loggedUser:loggedUserReducer,
    role:roleSlice,
    permission:permissionSlice,
    center:centerSlice,
    member:memberSlice
    
    
  },
});
