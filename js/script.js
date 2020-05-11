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
                  title: 'Сделать ГД',
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
                  title: 'Сделать МНО',
                  isDone: true
                    },
               {
                  title: 'Сделать ПРС',
                  isDone: true
                    },
                ]
            }
        ],
      editNote: false,
      isReadyForSave: false
   },
<<<<<<< HEAD
   created: function () {},
=======
   created: function () {
      this.currentPage = {page: this.pages.home, title: 'To Do Vue'}
   },
>>>>>>> 4c8c1e99d3f1dbe3e57b354355f4b4fd203fde1f
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
<<<<<<< HEAD
=======
      pushNote(data) {
         this.notes.push(data);
      },
      editPage: function(data) {
         this.editNote = this.notes[data.key];         
         this.currentPage = {page: this.pages.note, title: 'Редактирование • '+this.editNote.title};
      }
   },
   computed: {
      currentPage: {
         get: function() {
            return {page: this.currpage, title: document.title}
         },
         set: function(val) {
            this.currpage = val.page;
            window.history.pushState(val, val.title, '');
            document.title = val.title
         }
      }
>>>>>>> 4c8c1e99d3f1dbe3e57b354355f4b4fd203fde1f
   }
});
window.onpopstate = function(event) {
   app.currentPage = event.state;
};