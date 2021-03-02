<template lang="pug">
.file-list-container(:style="`margin-left:${depthMargin}px;`")
    .file.folder(v-for="folder in data.folders" :class="{ active: active === folder.id}")
            .info.folder
                .text-wrapper
                    i.el-icon-folder
                    .text {{ folder.folder.fileName }}
                .actions
                    el-tooltip(placement="bottom" content="Create folder" effect="light" :open-delay="100")
                        i.action-button.el-icon-folder-add
                    el-popconfirm(title="A you sure?" @confirm.stop="removeFolder(folder.folder)")
                      template(slot="reference")
                        el-tooltip(placement="bottom" content="Delete folder" effect="light" :open-delay="100")
                            i.action-button.el-icon-folder-remove
                    el-tooltip(placement="bottom" content="Upload files" effect="light" :open-delay="100")
                        i.action-button.el-icon-upload2(@click="showUploadForm(folder.folder)")
                    input(type="file" multiple :ref="`uploadFolder-${folder.folder.id}`" style="display: none;")
            file-structure(
              v-if="folder.child"
              :data="folder.child"
              :depth="depth + 1"
              :active="active"
              @getCode="$emit('getCode', $event)"
              @updateStructure="$emit('updateStructure', $event)"
            )
    .file(v-for="file in data.files" :class="{ active: active === file.id}" @click.git ="$emit('getCode',file.id)")
        .info
            .text-wrapper
                i.el-icon-tickets
                .text {{ file.fileName }}
            .actions
              el-popconfirm(title="A you sure?" @confirm.stop="removeFile(file)")
                template(slot="reference")
                  el-tooltip(placement="right" content="Delete file" effect="light" :open-delay="100")
                      i.action-button.action-button__file.el-icon-document-delete
</template>

<script>
import requester from '@/utils/requester';

export default {
  props: ['data', 'depth', 'active'],
  name: 'FileStructure',
  metaInfo: { title: 'Authorization' },
  data() {
    return {

    };
  },
  created() {},
  computed: {
    depthMargin() {
      const multiple = Number(this.depth) || 0;
      return 10 * multiple;
    },
  },
  methods: {
    async fetchRemove(item) {
      try {
        await requester
          .delete(`/file/${item.id}`)
          .then((res) => res.data);
      } finally {
        this.$emit('updateStructure');
      }
    },
    async removeFolder(folder) {
      await this.fetchRemove(folder);
    },

    async removeFile(file) {
      await this.fetchRemove(file);
    },

    async showUploadForm(folder) {
      const input = this.$refs[`uploadFolder-${folder.id}`];
      const cInput = input[0];

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
          await requester.post(`/file/upload/${folder.id}`, formData);
        } finally {
          this.$emit('updateStructure');
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.action-button {
      color: #fff;
      font-size: 12px;
      margin-right: 7px;
      cursor: pointer;
      &.__file {
          color: rgb(102, 50, 50);
      }
      &:hover {
        color: rgb(117, 117, 117);
      }
    }
.file-list-container {
    height: 100%;
    overflow: scroll;
    .file {
        padding: 10px;
        font-size: 12px;
        color: white;

        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .text-wrapper {
                display: flex;
                align-items: center;
                .text {
                    padding-left: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .actions {
                display: none;
            }
            &.folder {
                padding: 0 10px 10px 0;
            }
        }

        &.active {
            background-color: rgba(94, 94, 95, 0.9);
        }
        &.folder:hover {
             background-color: rgba(56, 56, 56, 0.9);
            cursor: pointer;
        }
        &:hover {
            &>.info>.actions {
                display: flex;
            }
        }
    }
    .file:hover {
        background-color: rgba(94, 94, 95, 0.9);
        cursor: pointer;
    }
}
</style>
