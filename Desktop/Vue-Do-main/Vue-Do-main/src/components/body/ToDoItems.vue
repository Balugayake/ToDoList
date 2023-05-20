<template>
  <div class="container">
    <div id="to-do-items">
      <p v-if="totalItems === 0">No items to display.</p>
      <ToDoItem v-for="item in items" :key="item.id" :initialItem="item" />
      <button
        class="reset-button custom-button"
        id="butDownload"
        v-if="totalItems !== 0"
        v-on:click="downloadData"
      >
        Download
      </button>
      <button
        class="reset-button custom-button"
        id="butDownload"
        v-if="totalItems !== 0"
      >
        Save to Folder
      </button>
      <div>
        <b-button v-b-modal.modal-1>Launch demo modal</b-button>

        <b-modal id="modal-1" title="BootstrapVue">
          <p class="my-4">Hello from modal!</p>
        </b-modal>
      </div>
    </div>
  </div>
</template>
  
<script>
import ToDoItem from "./ToDoItem.vue";
import { mapGetters } from "vuex";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "ToDoItems",
  components: { ToDoItem },
  computed: {
    ...mapGetters(["items", "totalItems"]),
  },
  methods: {
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

      const folderName = "TODOList"; // Specify the folder name here
      const fileName = "data.xlsx"; // Specify the file name here
      const folderPath = `${folderName}/${fileName}`;

      const fileURL = URL.createObjectURL(fileData);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", fileName);

      // Create the new folder
      const folderBlob = new Blob([""], { type: "application/octet-stream" });
      const folderURL = URL.createObjectURL(folderBlob);
      const folderLink = document.createElement("a");
      folderLink.href = folderURL;
      folderLink.setAttribute("download", folderName);
      folderLink.style.display = "none";
      document.body.appendChild(folderLink);
      folderLink.click();
      document.body.removeChild(folderLink);

      // Move the file to the new folder
      const fileBlob = new Blob([fileData], {
        type: "application/octet-stream",
      });
      const fileURL2 = URL.createObjectURL(fileBlob);
      const fileLink = document.createElement("a");
      fileLink.href = fileURL2;
      fileLink.setAttribute("download", folderPath);
      fileLink.style.display = "none";
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);

      // Save the file with the specified folder path and file name
      saveAs(fileData, folderPath + fileName);
      // Clean up the URLs
      URL.revokeObjectURL(fileURL);
      URL.revokeObjectURL(folderURL);
      URL.revokeObjectURL(fileURL2);
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
</style>
    