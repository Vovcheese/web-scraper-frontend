<template lang="pug">
.files-section-wrapper
  #container
    // file list
    .column.left
      .file-list-container(v-if="fileList")
        .file(v-for="item in fileList")
          .info(@click="getCodeHandle(item.id)")
            i.el-icon-tickets
            span.text {{ item.fileName }}

    // code editor
    .column.right
      code-editor(:codeString="codeString" :fileId="fileId")
</template>

<script>
import requester from '@/utils/requester';
import codeEditor from './CodeEditor.vue';

export default {
  components: { codeEditor },
  data: () => ({
    codeString: '',
    fileId: null,
    fileList: [],
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
          .then((res) => res.data.rows);
      } finally {
        this.loading = false;
        const selectedFileId = this.fileList.filter(
          (i) => i.fileName === 'index.html',
        )[0].id;
        this.getCodeHandle(selectedFileId);
      }
    },
    async getCodeHandle(fileId) {
      this.fileId = fileId;
      this.codeString = await requester
        .get(`/file/${fileId}`)
        .then((res) => res.data);
    },
  },
};
</script>

<style lang="scss">
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
    width: 10%;

    .file-list-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #2d2d2d;

      .file {
        padding: 10px;
        font-size: 12px;
        color: white;

        .info {
          display: flex;
          align-items: center;

          .text {
            padding-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .file:hover {
        background-color: rgba(94, 94, 95, 0.9);
        cursor: pointer;
      }
    }
  }
  .column.right {
    width: 90%;
    // flex: 0 0 90%;
    border-left: 1px solid #eee;
    // min-height: 100%;
  }
}
</style>
