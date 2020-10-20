run project:
yarn start


first object structure: 
tasks{
  permission: {
    statusCale: '',
    statusRemi: ''
  },
  calendarTitle: 'Sunnyday Calendar',
  calendarId: '',
  taskList:[
    {
      date: "2020-10-01",
      dateTaskList: [
        {
          "ID": "9EEB0498-67A3-40A1-9486-D1F939AA5BA1",
          "alarmOn": true,
          "startTime": "2020-10-01T01:32:56.000Z",
          "color": "rgb(243,216,133)",
          "notes": "Hi",
          "title": "Hi, how are you",
        },
      ],
    },
  ],
}

second object structure: 
tasks{
  permission: {
    statusCale: '',
    statusRemi: ''
  },
  calendarTitle: 'Sunnyday Calendar',
  calendarId: '4EEB0498-67A3-40A2-9486-D1F939AA5BA2',
  taskList:[
    {
      "ID": "9EEB0498-67A3-40A1-9486-D1F939AA5BA1",
      "alarmOn": true,
      "startDateTime": "2020-10-01T01:32:56.000Z",
      "endDateTime": "2020-10-01T01:32:56.000Z",
      "color": "rgb(243,216,133)",
      "notes": "Hi",
      "title": "Hi, how are you",
    },
  ],
}

section structure:
{
  title: '2020-10-18', 
  data: [
    {
      hour: '12am', 
      duration: '1h', 
      title: 'First Yoga', 
      ID: "9EEB0498-67A3-40A1-9486-D1F939AA5BA1", 
      color: "rgb(243,216,133)",
      alarm: 0,
      note: 'test from RN'
    },
  ]
},
