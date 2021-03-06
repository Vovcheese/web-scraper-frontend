<template lang="pug">
.code-editor-wrapper(v-loading="loading")
  //- <prism-editor class="my-editor" v-model="code" :insertSpaces="false" :tabSize="2" :highlight="highlighter" line-numbers></prism-editor>
  .wrapper-action-bar
    el-button.save-changes-button(type="warning", @click="saveCodeHandle" size="mini") Save changes
    el-checkbox.light(v-model="replaceHeaders" label="Replace headers" border size="mini")
  img(:src="imageUrl" v-if="imageUrl")
  prism-editor.my-editor(
    v-if="!imageUrl",
    v-model="code",
    :insertSpaces="false",
    :tabSize="2",
    :highlight="highlighter",
    line-numbers
  )
</template>

<script>
import Notify from '@/utils/Notify';
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

import requester from '@/utils/requester';

export default {
  props: ['codeString', 'fileId', 'imageUrl'],
  components: {
    PrismEditor,
  },
  data: () => ({
    code: '',
    loading: false,
    replaceHeaders: false,
  }),
  watch: {
    codeString(newVal) {
      this.code = newVal;
    },
  },
  methods: {
    async saveCodeHandle() {
      this.loading = true;
      try {
        await requester.post(`/file/${this.fileId}`, { code: this.code, replaceHeaders: this.replaceHeaders });
        Notify.success({
          title: 'Success',
          message: 'File is saved',
        });
      } finally {
        this.loading = false;
        this.replaceHeaders = false;
      }
    },
    highlighter(code) {
      return highlight(code, languages.js); // returns html
    },
  },
};
</script>

<style lang="scss">
.el-checkbox {
  &.light {
    border: 1px solid #DCDFE6 !important;
    color:#DCDFE6 !important;
    &.is-checked {
      border: 1px solid #DCDFE6 !important;
      color:#DCDFE6 !important;
    }
    .el-checkbox__label {
      color:#DCDFE6 !important;
    }
  }
}

.code-editor-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: scroll;
}
.wrapper-action-bar {
  align-items: center;
  display: flex;
  position: fixed;
  top: 15px;
  right: 40%;
  z-index: 999;
  .save-changes-button {
    margin-right: 10px;
  }
}

/* required class */
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
