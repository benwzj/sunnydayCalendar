import * as ExpoCalendar from 'expo-calendar'

export const ADD_CALENDAR = 'ADD_CALENDAR'
export const SETUP_CALENDARS = 'SETUP_CALENDARS'
export const DELETE_CALENDAR = 'DELETE_CALENDAR'
export const ASK_CALENDAR_PERMISSTION = 'ASK_CALENDAR_PERMISSTION'

export const askCalendarPermission = () =>{
  return async (dispatch) => {
    const { status: statusCale } = await ExpoCalendar.requestCalendarPermissionsAsync();
    const { status: statusRemi } = await ExpoCalendar.requestRemindersPermissionsAsync()
    if (statusCale === 'granted') {
      console.log('requestCalendarPermissionsAsync is granted!');
    }
    if (statusRemi === 'granted') {
      console.log('requestRemindersPermissionsAsync is granted!');
    }
    dispatch ({ 
      type: ASK_CALENDAR_PERMISSTION, 
      payload: {
        statusCale: statusCale,
        statusRemi: statusRemi
      }
    })
  }
}

export const setupCalendars = () => {
  return async (dispatch) => {
    try {
      const calendars = await ExpoCalendar.getCalendarsAsync ()
      //console.log('action -- setupCalendars',calendars )
      dispatch ({ type: SETUP_CALENDARS, payload: calendars })
    }catch (err){
      throw err;
    }
  }
}

export const deleteCalendar = ( id ) => {
  return async (dispatch) => {
    try {
      await ExpoCalendar.deleteCalendarAsync (id)
      const calendars = await ExpoCalendar.getCalendarsAsync ()
      dispatch ({ type: DELETE_CALENDAR, payload: calendars })
    }catch (err){
      throw err
    }
  }
}

export const addCalendar = () => {
  return async ( dispatch ) => {
    try {
      let calendars = await ExpoCalendar.getCalendarsAsync()
      const defaultCalendars = calendars.filter(each => each.source.name === 'Default' || each.source.name === 'iCloud')
      const iosSource = defaultCalendars[0].source
      
      const defaultCalendarSource =
        Platform.OS === 'ios'
          ? iosSource
          : { isLocalAccount: true, name: 'Expo Calendar' };

      await ExpoCalendar.createCalendarAsync({
        title: `Calendar title(${Math.random().toString().substring(2)})`,
        color: 'blue',
        entityType: ExpoCalendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
      });

      calendars = await ExpoCalendar.getCalendarsAsync ()
      dispatch ({ type: ADD_CALENDAR, payload: calendars })

    }catch (err) {
      throw err
    }
  }
}