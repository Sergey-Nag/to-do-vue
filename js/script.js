const routes = [
   {
      path: '/',
      component: mainPage
   },
   {
      path: '/edit/:id',
      component: editPage
   }
]

const router = new VueRouter({
   routes
});

const app = new Vue({
   el: '#app',
   router,
   data: {
      popup: false,
      notes: [
         {
            title: 'Тестовая запись 1',
            todo_items: [
               {
                  title: 'Сделать Первое',
                  isDone: false
                    },
               {
                  title: 'Сделать Второе',
                  isDone: false
                    },
                ]
            },
         {
            title: 'Еще одна запись',
            todo_items: []
            },
         {
            title: 'Тестовая запись 2',
            todo_items: [
               {
                  title: 'Сделать АБВ',
                  isDone: false
                    },
               {
                  title: 'Сделать БГД',
                  isDone: true
                    },
               {
                  title: 'Сделать ЕЁЖ',
                  isDone: false
                    },
               {
                  title: 'Сделать ЗИКл',
                  isDone: true
                    },
               {
                  title: 'Сделать ЗИКл',
                  isDone: true
                    },
               {
                  title: 'Сделать ЗИКл',
                  isDone: true
                    },
                ]
            }
        ],
      editNote: false
   },
   created: function () {},
   methods: {
      showPopup(data) {
         this.popup = data
      },
      // Popup handler
      donePopup(data) {
         if (data.name == 'delete-note') this.deleteNote(data.id);
      },
      // Remove 'note' from array with shift 
      deleteNote(id) {
         this.notes.splice(id, 1);
         this.clearPopup();
      },
      // Clear popup data and close popup block
      clearPopup() {
         this.popup = false
      },
   }
});
