<template lang="pug">
.files-section-wrapper
  #container
    // file list
    .column.left
      .global-action-bar
        .title Actions
        .buttons
          //- el-tooltip(placement="top" content="Replace content site" effect="light" :open-delay="100")
          //-   i.action-button.el-icon-refresh
          //- el-tooltip(placement="top" content="Download site" effect="light" :open-delay="100")
          //-   i.action-button.el-icon-download
          el-tooltip(placement="top" content="Upload files" effect="light" :open-delay="100")
            i.action-button.el-icon-upload2(@click="showUploadForm")
          input(type="file" multiple :ref="`uploadFolderGlobal`" style="display: none;")
          //- el-tooltip(placement="top" content="Create folder" effect="light" :open-delay="100")
          //-   i.action-button.el-icon-folder-add
          //- el-tooltip(placement="top" content="Create file" effect="light" :open-delay="100")
          //-   i.action-button.el-icon-document-add

      .file-structure-wrapper
        file-structure(:data="fileList" :depth="0" :active="fileId" @getCode="getCodeHandle" @updateStructure="getFilesListHandle")

    // code editor
    .column.right
      code-editor(:codeString="codeString" :fileId="fileId")
</template>

<script>
import requester from '@/utils/requester';
import fileStructure from '@/components/FileStructure.vue';
import codeEditor from './CodeEditor.vue';

export default {
  components: { codeEditor, fileStructure },
  data: () => ({
    codeString: '',
    fileId: null,
    fileList: {},
  }),
  created() {
    this.getFilesListHandle();
  },
  methods: {
    async getFilesListHandle() {
      this.loading = true;
      try {
        this.fileList = await requester
          .get(`/file/list/${this.$route.params.siteId}`)
          .then((res) => res.data);
      } finally {
        this.loading = false;
        const selectedFileId = this.fileList.files.find(
          (i) => i.fileName === 'index.html',
        );
        this.fileId = selectedFileId.id;
        this.getCodeHandle(selectedFileId.id);
      }
    },
    async getCodeHandle(fileId) {
      this.fileId = fileId;
      this.codeString = await requester
        .get(`/file/${fileId}`)
        .then((res) => res.data);
    },
    async showUploadForm() {
      const input = this.$refs.uploadFolderGlobal;
      const cInput = input;

      if (!cInput) return;

      cInput.click();

      cInput.onchange = async () => {
        const { files } = cInput;
        const formData = new FormData();
        formData.append('siteId', this.$route.params.siteId);
        files.forEach((file) => {
          formData.append('file', file);
        });
        try {
          await requester.post('/file/upload/0', formData);
        } finally {
          this.getFilesListHandle();
        }
      };
    },
  },
};
</script>

<style lang="scss">
.file-structure-wrapper {
  margin-top: 25px;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
}
.global-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  height: 25px;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(41, 41, 41);
  .title {
    padding: 0 10px;
    font-size: 8px;
    text-transform: uppercase;
    color: #fff;
    font-weight: bold;
  }
  .buttons {
    display: flex;
    align-items: center;
    .action-button {
      color: #fff;
      font-size: 12px;
      margin-right: 7px;
      cursor: pointer;
      &:hover {
        color: rgb(117, 117, 117);
      }
    }
  }
}
.files-section-wrapper {
  width: 100%;
  height: 100%;

  #container {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    align-content: stretch;
    max-width: 100%;
    height: 100%;
  }
  .column.left {
    position: relative;
    width: 25%;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #2d2d2d;
  }
  .column.right {
    width: 90%;
    // flex: 0 0 90%;
    border-left: 1px solid #eee;
    // min-height: 100%;
  }
}
</style>
