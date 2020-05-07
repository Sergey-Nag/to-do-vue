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
      returnRightList: function() {
        return this.editable ? this.todolist : this.todolist.slice(0, 4);
      } 
   },
   template: `<div class="note">
                    <div class="note-head">
                        <div class="title-side"><h4>{{title}}</h4></div>
                        <div class="control-side">
                            <button
                                class="btn"
                                v-on:click="edit_note(key)">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                            <button
                                class="btn"
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

Vue.component('add-note-button', {
   data: function () {
      return {
         isActive: false,
         newNoteTitle: '',
         newItem: '',
         newItems: []
      }
   },
   updated: function(){
      
       
   },
   methods: {
      checkItem: function() {
         if (this.newItem != '') {
            this.newItems.push({
               title: this.newItem,
               isDone: false
            });
            this.newItem = '';
         }
      },
      returnItem: function() {
         if (this.newItem == '' && this.newItems.length > 0) {
            // Cut lust item from todolist
            // and paste to current input then focus 
            let lastItem = this.newItems.splice(this.newItems.length-1, 1);
            this.newItem = lastItem[0].title;
            setTimeout(function() {
               document.getElementById('add-item-input').focus()
            }, 100);
         }
      }
   },
   template: `<div class="note add-btn" :class="{active: isActive}">
                    <div v-if="isActive" class="form-wrapp">
                        <h3>Добавление заметки</h3>
                        <input type="text" v-model="newNoteTitle" class="form-input title" placeholder="Заголовок">
                        <ul class="todolist">
                           <li class="item" v-for="(item, i) in newItems"><label 
                                    :for="'todo-new'+i">
                                    <input
                                        type="checkbox"
                                        :id="'todo-new'+i"
                                        :checked="item.isDone">
                                        {{item.title}}
                                </label>
                           </li>

                            <li class="item" >
                                <input type="checkbox" disabled><input id="add-item-input" v-on:keyup.enter="checkItem" v-on:keyup.delete.prevent="returnItem" v-model="newItem" type="text" class="form-input item" placeholder="+ Добавить пункт">
                            </li>

                           <li v-if="newItem != ''" class="item">
                                <input type="checkbox" disabled><input v-on:keyup="checkItem"  type="text" class="form-input item" placeholder="+ Добавить пункт">
                            </li>

                        </ul>
                        <div class="note-footer">
                            <button class="btn cancel">Отмена</button>
                            <button class="btn confirm"><i class="fa fa-plus" aria-hidden="true"></i> Добавить</button>
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
