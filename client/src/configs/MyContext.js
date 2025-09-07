import { createContext } from 'react';

export const MyUserContext = createContext(); // current_user
export const MyDispatchContext = createContext(); // dispatch user payload
export const MyRefreshContext = createContext(); // check page refresh status
export const MyNotificationContext = createContext(); // current user notifiaction
