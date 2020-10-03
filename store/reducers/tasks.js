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
        console.log('tasksReducer : ', tasks )
        if ( tasks ){
          return tasks
        }
        return state
      }
    case ADD_TASK:
      {
        const task = action.payload
        const date = new Date(task.startDate).toISOString().split('T')[0]
        const selectedDateTask = state.taskList.find (
          dateTask => dateTask.date === date
        )
        if ( selectedDateTask ){
          selectedDateTask.dateTaskList = [
            ...selectedDateTask.dateTaskList, 
            task
          ]
          const returnObj = {
            ...state, 
            taskList: [
              ...state.taskList.filter (dateTask => dateTask.date != date),
              {...selectedDateTask}
            ]
          }
          console.log ( 'reducers addTask---1:',returnObj )
          return returnObj
        }else {
          const newDateTask = {
            date: date,
            dateTaskList: [task]
          }
          const returnObj = {
            ...state, 
            taskList: [
              ...state.taskList,
              newDateTask
            ]
          }
          console.log ( 'reducers addTask---2:',returnObj )
          return returnObj
        }
      }
    case UPDATE_TASK:
      {
        const task = action.payload
        const date = new Date(task.startDate).toISOString().split('T')[0]
        const selectedDateTask = state.taskList.find (
          dateTask => dateTask.date === date
        )
        if ( selectedDateTask ){
          const selectedTask = selectedDateTask.dateTaskList.find(
            item=>item.ID === task.ID
          )
          Object.assign ( selectedTask, task )
          // cause re-render for useSelector in TaskHomeSC
          selectedDateTask.dateTaskList = [
            ...selectedDateTask.dateTaskList, 
          ]
          const returnObj = {
            ...state,
            taskList: [
              ...state.taskList
            ]
          }
          console.log( 'updateTask reducer: ', returnObj)
          return returnObj
        }else {
          return state
        }
      }
      case DELETE_TASK:
        const task = action.payload
        const date = new Date(task.startDate).toISOString().split('T')[0]
        const selectedDateTask = state.taskList.find (
          item => item.date === date
        )
        if (selectedDateTask){
          selectedDateTask.dateTaskList = selectedDateTask.dateTaskList.filter (
            item => item.ID != task.ID
          )
        }
        if ( selectedDateTask && selectedDateTask.dateTaskList.length > 0){
          return {
            ...state, 
            taskList: [
              ...state.taskList.filter (dateTask => dateTask.date != date),
              selectedDateTask
            ]
          }
        }else {
          return {
            ...state, 
            taskList: [
              ...state.taskList.filter (dateTask => dateTask.date != date)
            ]
          }
        }

    default: 
      return state
  }
}