const app = new Vue({
   el: '#app',
   data: {
      pages: {
         home: 'main-page',
         note: 'note-page'
      },
      currpage: false,
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
   created: function () {
      this.currentPage = {page: this.pages.home, title: 'To Do Vue'}
   },
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
   }
});
window.onpopstate = function(event) {
   app.currentPage = event.state;
};