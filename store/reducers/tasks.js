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
          return {
            ...state, 
            taskList: [
              ...state.taskList.filter (dateTask => dateTask.date === date),
              {...selectedDateTask}
            ]
          }
        }else {
          const newDateTask = {
            date: date,
            dateTaskList: [task]
          }
          return {
            ...state, 
            taskList: [
              ...state.taskList,
              newDateTask
            ]
          }
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
          selectedDateTask.dateTaskList = selectedDateTask.dateTaskList.filter (
            item => item.ID != task.ID
          )

          selectedDateTask.dateTaskList = [
            ...selectedDateTask.dateTaskList, 
            task
          ]
          return {
            ...state, 
            taskList: [
              ...state.taskList.filter (dateTask => dateTask.date === date),
              {...selectedDateTask}
            ]
          }
        }else {
          // const newDateTask = {
          //   date: date,
          //   dateTaskList: [task]
          // }
          // return {
          //   ...state, 
          //   taskList: [
          //     ...state.taskList,
          //     newDateTask
          //   ]
          // }
          return state
        }
      }
      case DELETE_TASK:
        const {date, id} = action.payload
        const selectedDateTask = state.taskList.find (
          dateTask => dateTask.date === date
        )
        if (selectedDateTask){
          selectedDateTask.dateTaskList = selectedDateTask.dateTaskList.filter (
            task => task.ID != id
          )
        }
  
        return {
          ...state, 
          array: [
            ...state.array.filter (dateTask => dateTask.date === date),
            {...selectedDateTask}
          ]
        }
    default: 
      return state
  }
}