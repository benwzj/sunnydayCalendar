import { 
  SETUP_TASKS, 
  DELETE_TASK, 
  ADD_TASK,
  UPDATE_TASK
 } from '../actions/tasks'

const initialState = {
  permission: {
    statusCale: '',
    statusRemi: ''
  },
  calendarTitle: '',
  calendarId: '',
  taskList:[]
};

export const tasksReducer = (state = initialState, action) =>{
  switch ( action.type ){
    case SETUP_TASKS:
      {
        const tasks = action.payload
        if ( tasks ){
          return tasks
        }
        return state
      }
    case ADD_TASK:
      {
        const task = action.payload
        const returnObj = {
          ...state, 
          taskList: [
            ...state.taskList,
            task
          ]
        }
        //console.log( 'ADD_TASK reducer', returnObj)
        return returnObj
      }
    case UPDATE_TASK:
      {
        const task = action.payload
        const selectedTask = state.taskList.find(
            item=>item.ID === task.ID
          )
        if ( selectedTask ){
          Object.assign ( selectedTask, task )
          // cause re-render for useSelector in TaskHomeS
          //...
          const returnObj = {
            ...state,
            taskList: [
              ...state.taskList
            ]
          }
          //console.log( 'UPDATE_TASK reducer:', returnObj)
          return returnObj
        }else {
          return state
        }
      }
      case DELETE_TASK:
        const task = action.payload
        const updatedTaskList = state.taskList.filter (
          item => item.ID != task.ID
        )
        const returnObj = {
          ...state, 
          taskList: [
            ...updatedTaskList
          ]
        }
        //console.log ('DELETE_TASK reducer:', returnObj )
        return returnObj

    default: 
      return state
  }
}