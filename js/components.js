var mainPage = Vue.component('main-page', {
   props: ['notes', 'popup-main'],
   data: function () {
      return {
         key: this.$vnode.key,
      }
   },
   mounted: function () {
      console.log(this.popupMain)
   },
   methods: {
      showPopup(data) {
         this.$emit('show-popup', data);
      },
      pushNote(data) {
         this.notes.push(data);
      },
   },
   template: `<div className="page-wrapp">
               <h1 class="title">Мои заметки <span class="notes-length">{{ notes.length }}</span></h1>
                  <note @show-popup="showPopup" v-for="(note, i) in notes" :key="i" :title='note.title' :todolist="note.todo_items" :editable="false"></note>
                  <add-note @add-note="pushNote"></add-note>
               </div>`
});

var editPage = Vue.component('edit-page', {
   props: ['notes'],
   data: function () {
      return {
         key: this.$vnode.key,
         editNote: {}
      }
   },
   created: function () {
      this.editNote = Object.assign({}, this.notes[this.$route.params.id]);
   },
   methods: {
      showPopup(data) {
         this.popup = data
      },
      pushNote(data) {
         this.notes.push(data);
      },
   },
   template: `<div className="page-wrapp">
               <router-link to="/" class="btn"><i class="fa fa-chevron-left" aria-hidden="true"></i> Вернуться к списку</router-link>
               <h1 class="title">Заметка <span class="notes-length"></span></h1>
               <add-note @add-note="pushNote" :edit="editNote"></add-note>
            </div>`
});


Vue.component('note', {
   props: ['title', 'todolist', 'editable'],
   data: function () {
      return {
         key: this.$vnode.key
      }
   },
   created: function () {
      this.sortList();
   },
   methods: {
      // Move "done" items to end of the list
      sortList: function () {
         this.todolist.sort((a) => {
            return a.isDone ? 1 : -1
         });
      },
      // Switch checkbox
      check: function (i) {
         this.todolist[i].isDone = !this.todolist[i].isDone;
         this.sortList();
      },
      // Removing note by index
      delete_note: function (i) {
         let key = this.key;
         this.$emit('show-popup', {
            question: 'Удалить запись',
            title: this.title,
            note_id: this.key,
            emit: {
               name: 'delete-note',
               id: key
            }
         })
      },
      edit_note: function (key) {
         this.$emit('edit-note', {
            key: key
         });
      }
   },
   computed: {
      // If editable == false > return last 4 else return full todo list
      returnRightList: function () {
         return this.editable ? this.todolist : this.todolist.slice(0, 4);
      }
   },
   template: `<div class="note">
                    <div class="note-head">
                        <div class="title-side"><h4>{{title}}</h4></div>
                        <div class="control-side">
                        <router-link :to="'/edit/'+key" class="btn btn-icon"><i class="fa fa-pencil" aria-hidden="true"></i></router-link>
                            <button
                                class="btn btn-icon"
                                v-on:click="delete_note(key)">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div class="note-body">
                        <ul class="todolist">

                            <li v-for="(item, i) in returnRightList"
                                :key="i" class="item"
                                :class="{ checked: item.isDone}" >

                                <label 
                                    :for="'todo'+key+i"
                                    v-on:click.prevent="(editable ? check(i):'')">
                                    <input
                                        type="checkbox"
                                        :id="'todo'+key+i"
                                        :checked="item.isDone"
                                        :disabled="!editable">
                                        {{item.title}}
                                </label>
                            </li>
                           <li v-if="todolist.length > 4" class="item etc">...</li>
                        </ul>
                    </div>
                </div>`
});

Vue.component('add-note', {
   props: ['edit'],
   data: function () {
      return {
         isActive: false, // Активен ли компонент?
         newNoteTitle: '',
         newItem: '', // Текущий записываемый пункт
         isReadyForConfirm: false,
         newItems: [], // Массив с пунктами
         editItemKey: false
      }
   },
   created: function () {
      if (this.edit) {
         this.isActive = true;
         this.newNoteTitle = this.edit.title;
         this.newItems = this.edit.todo_items.map((el) => Object.assign({}, {
            ...el,
            editing: false
         }));
      }
   },
   methods: {
      // Add new item to list
      checkItem: function () {
         if (this.newItem != '') {
            this.newItems.push({
               title: this.newItem,
               isDone: false
            });
            this.newItem = '';
            this.isReady();
         }
      },
      // Return last item to focus input
      returnItem: function () {
         if (this.newItem == '' && this.newItems.length > 0) {
            // Cut lust item from todolist
            // and paste to current input, then focus new item input 
            let lastItem = this.newItems.splice(this.newItems.length - 1, 1);
            this.newItem = lastItem[0].title;
            this.focusInput();
            this.isReady();
         } else if (this.newItem == '' && this.newItems.length == 0) this.focusTitleInput()
      },
      focusInput: function () {
         setTimeout(function () {
            document.getElementById('add-item-input').focus()
         }, 100);
      },
      focusTitleInput: function () {
         setTimeout(function () {
            document.getElementById('add-note-title').focus()
         }, 100);
      },
      cancel: function () {
         this.newNoteTitle = '',
            this.newItem = '',
            this.newItems = [];
         this.isActive = false;
      },
      isReady: function () {
         this.isReadyForConfirm = (this.newNoteTitle != '' && this.newItems.length > 0) ? true : false;
      },
      editItem: function (i) {
         this.newItems[i].editing = true
         setTimeout(() => {
            document.querySelectorAll('.item-edit')[i].focus();
         }, 100);
      },
      saveItem: function (i) {
         this.newItems[i].title = document.querySelectorAll('.item-edit')[i].value
         this.newItems[i].editing = false
      },
      removeItem: function (i) {
         this.newItems.splice(i, 1);
      },
      addNote: function () {
         if (this.newNoteTitle != '' && this.newItems.length > 0) {
            this.$emit('add-note', {
               title: this.newNoteTitle,
               todo_items: this.newItems
            });
            this.newNoteTitle = '';
            this.newItems = [];
         }
      }
   },
   computed: {},
   template: `<div class="note add-btn" :class="{active: isActive}">
                    <div v-if="isActive" class="form-wrapp">
                        <h3 v-if="edit">Редактирование заметки</h3>
                        <h3 v-else>Добавление заметки</h3>
                        <input type="text" id="add-note-title" v-model="newNoteTitle" v-on:blur="isReady" v-on:keyup.enter="focusInput" class="form-input title" placeholder="Заголовок">
                        <ul class="todolist">
                           <li class="item" v-for="(item, i) in newItems">
                                 <label 
                                    :for="'todo-new'+i"
                                    v-on:click="item.isDone = !item.isDone">
                                    <input
                                        type="checkbox"
                                        :id="'todo-new'+i"
                                        :checked="item.isDone">
                                 </label>
                                 <input class="item-edit" type="text" :value="item.title" :disabled="!item.editing" v-on:keyup.enter="saveItem(i)" @blur="saveItem(i)">

                                 <button class="btn btn-icon" v-on:click="editItem(i)">
                                       <i class="fa fa-pencil" aria-hidden="true"></i>
                                 </button>
                                 <button class="btn btn-icon" v-on:click="removeItem(i)">
                                    <i class="fa fa-close" aria-hidden="true"></i>
                                 </button>
                           </li>

                            <li class="item" >
                                <input type="checkbox" disabled><input id="add-item-input" v-on:keyup.enter="checkItem" v-on:keyup.delete.prevent="returnItem" v-model="newItem" type="text" class="form-input item" placeholder="+ Добавить пункт">
                                 <button class="btn btn-icon" v-on:click="checkItem">
                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                 </button>
                            </li>

                           <li v-if="newItem != ''" class="item">
                                <input type="checkbox" disabled><input v-on:keyup="checkItem"  type="text" class="form-input item" placeholder="+ Добавить пункт">
                            </li>

                        </ul>
                        <span class="hint">Добавляйте новые элементы <code>Enter</code>, возвращайтесь к предыдущим <code>Backspace</code></span>
                        <div class="note-footer">
                            <button class="btn cancel" v-on:click="cancel()"><i class="fa fa-close" aria-hidden="true"></i> Отмена</button>
                            <button v-if="edit" class="btn confirm" :disabled="!isReadyForConfirm" v-on:click="addNote()"><i class="fa fa-floppy-o"></i> Сохранить</button>
                            <button v-else class="btn confirm" :disabled="!isReadyForConfirm" v-on:click="addNote()"><i class="fa fa-plus" aria-hidden="true"></i> Добавить</button>
                        </div>
                    </div>
                    <div v-else v-on:click.prevent="isActive = true">
                        <span class="add-note"><i class="fa fa-plus" aria-hidden="true"></i> Добавить заметку</span>
                    </div>
                </div>`
})

Vue.component('popup', {
   props: ['dataPopup'],
   data: function () {
      return {}
   },
   methods: {
      confirmed(data) {
         this.$emit('done-popup', data)
      },
      close() {
         this.$emit('close-popup')
      }
   },
   template: `<div class="popup-wrapp">
                    <transition name="fade">
                    <div class="popup">
                        <div class="note-head">
                            <h4>{{dataPopup.question}} <i>{{ dataPopup.title }}</i>?</h4>
                        </div>
                        <div class="note-body"></div>
                        <div class="note-footer">
                            <button class="btn cancel" v-on:click="close()">Отмена</button>
                            <button class="btn confirm" v-on:click="confirmed(dataPopup.emit)">Принять</button>
                        </div>
                    </div>
                    </transition>
                </div>`
});
