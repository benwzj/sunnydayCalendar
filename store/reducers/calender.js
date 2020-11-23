/*
Object {
    "allowedAvailabilities": Array [],
    "allowsModifications": true,
    "color": "#0000FF",
    "entityType": "event",
    "id": "AAE9A1B7-B3D1-4CD6-B526-F8660DE6E3A1",
    "source": Object {
      "id": "71682B4B-9E11-4A3C-979E-70FE47E4EFB0",
      "name": "Default",
      "type": "local",
    },
    "title": "Calendar title(08404900765208079)",
    "type": "local",
  },
*/ 

import { 
  SETUP_CALENDARS, 
  DELETE_CALENDAR, 
  ADD_CALENDAR,
  ASK_CALENDAR_PERMISSTION } from '../actions/calendars'

const initialState = {
  array: [],
  permission: {
    statusCale: '',
    statusRemi: ''
  }
};

export const calendarsReducer = (state = initialState, action) =>{
  switch ( action.type ){
    case SETUP_CALENDARS:
    case DELETE_CALENDAR:
    case ADD_CALENDAR:
      const calendars = action.payload
      //console.log('reducer -- inside',calendars)

      if ( calendars ){
        return { ...state, array: calendars }
      }
      return state
    case ASK_CALENDAR_PERMISSTION:
      return {
        ...state,
        permission: action.payload
      }
    default: 
      return state
  }
}
