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
                ]
            }
        ]
    },
    created: function() {
        this.currpage = this.pages.home
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
        deleteNote(id){
            this.notes.splice(id, 1);
            this.clearPopup();
        },
        // Clear popup data and close popup block
        clearPopup() {
            this.popup = false
        },
        pushNote(data){

        }
    }
});