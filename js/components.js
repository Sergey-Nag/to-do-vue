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
                            <button
                                class="btn btn-icon"
                                v-on:click="edit_note(key)">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                            </button>
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
   data: function () {
      return {
         isActive: false,
         newNoteTitle: '',
         newItem: '',
         isReadyForConfirm: false,
         newItems: []
      }
   },
   updated: function () {

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
      editItem: function(i) {
         this.newItems[i].editing = true
      },
      removeItem: function(i) {
         this.newItems.splice(i, 1);
      }
   },
   computed: {},
   template: `<div class="note add-btn" :class="{active: isActive}">
                    <div v-if="isActive" class="form-wrapp">
                        <h3>Добавление заметки</h3>
                        <input type="text" id="add-note-title" v-model="newNoteTitle" v-on:blur="isReady" v-on:keyup.enter="focusInput" class="form-input title" placeholder="Заголовок">
                        <ul class="todolist">
                           <li class="item" v-for="(item, i) in newItems">
                                 <label 
                                    :for="'todo-new'+i">
                                    <input
                                        type="checkbox"
                                        :id="'todo-new'+i"
                                        :checked="item.isDone">

                                        {{item.editing? '' : item.title}}

                                       <input v-show="item.editing" id="add-item-input" v-on:keyup.enter="checkItem" v-on:keyup.delete.prevent="returnItem" v-model="item.title" type="text" class="form-input item" placeholder="+ Добавить пункт">

                                 </label>
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
                            <button class="btn confirm" :disabled="!isReadyForConfirm"><i class="fa fa-plus" aria-hidden="true"></i> Добавить</button>
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
