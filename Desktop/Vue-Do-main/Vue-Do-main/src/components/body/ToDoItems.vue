<template>
  <div class="container">
    <div id="to-do-items">
      <p v-if="totalItems === 0">No items to display.</p>
      <ToDoItem v-for="item in items.items" :key="item.id" :item="item" />
      {{ items.items }}
      <b-button
        id="butDownload"
        v-if="totalItems !== 0"
        v-on:click="downloadData"
      >
        Download
      </b-button>
      &nbsp;
      <b-button v-b-modal.modal-1 v-if="totalItems !== 0"
        >Save to Folder</b-button
      >&nbsp;
      <b-input
        class="input"
        v-model="newFolder"
        placeholder="New Folder"
      ></b-input
      >&nbsp; <b-button @click="addFolder">Add Folder</b-button>&nbsp;
      <b-modal
        id="modal-1"
        title="Select Folder"
        @ok="addFolderItem"
        ok-title="Save"
      >
        <!-- Static Radio Buttons -->
        <div>
          <input
            v-model="selectedFolder"
            type="radio"
            id="option1"
            name="radio-group"
            value="Business"
          />
          <label for="option1">Bisuness</label>
        </div>

        <div>
          <input
            v-model="selectedFolder"
            type="radio"
            id="option2"
            name="radio-group"
            value="Personal"
          />
          <label for="option2">Personal</label>
        </div>

        <!-- Dynamic Radio Button -->
        <div v-for="option in dynamicOptions" :key="option.id">
          <input
            type="radio"
            :id="option.id"
            :name="'dynamic-group-' + option.id"
            :value="option.value"
            v-model="selectedFolder"
          />
          <label :for="option.id">{{ option.label }}</label>
        </div>
      </b-modal>
    </div>
    {{ items }}
  </div>
</template>
  
<script>
import ToDoItem from "./ToDoItem.vue";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BModal, BButton } from "bootstrap-vue";

export default {
  name: "ToDoItems",
  data() {
    return {
      dynamicOptions: [],
      newFolder: "",
      selectedFolder: null,
    };
  },
  components: { ToDoItem, "b-modal": BModal, "b-button": BButton },
  computed: {
    ...mapGetters(["items", "totalItems"]),
  },
  methods: {
    addFolderItem() {
      if (this.selectedFolder) {
        const folderId = Date.now();
        //  const itemIds = this.items.map(item => item.id);

        for (let i = 0; i < this.items.length; i++) {
          const itemId = this.items[i].id;
          const payload = {
            folderId: folderId,
            itemId: itemId,
          };
          this.$store.commit("addItemFolder", payload);
        }
      }
    },
    addFolder() {
      if (this.newFolder.trim() !== "") {
        const folderId = Date.now();
        const option = {
          folderId: folderId,
          value: this.newFolder,
          label: this.newFolder,
        };
        this.dynamicOptions.push(option);
        this.newFolder = ""; // Reset the input field
        const payload = {
          folderId: folderId,
          itemIds: [],
        };
        this.$store.commit("addFolder", payload);
      }
    },
    downloadData() {
      const data = this.$store.state.items;
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(fileData, "data.xlsx");
    },
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.reset-button {
  border-width: 0;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 0;
}

.custom-button {
  height: 100%;
  font-size: 16px;
  border-radius: 0 10px 10px 0;
  width: 200px;
  background: #d9d9d9;
  color: #555;
  cursor: pointer;
}
#to-do-items {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input {
  padding: 5px 0;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
    