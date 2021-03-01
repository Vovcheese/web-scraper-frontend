<template lang="pug">
.file-list-container(:style="`margin-left:${depthMargin}px;`")
    .file.folder(v-for="folder in data.folders" :class="{ active: active === folder.id}")
            .info.folder
                .text-wrapper
                    i.el-icon-folder
                    .text {{ folder.folder.fileName }}
                .actions
                    el-tooltip(placement="bottom" content="Delete folder" effect="light" :open-delay="100")
                        i.action-button.el-icon-folder-remove
                    el-tooltip(placement="bottom" content="Upload files" effect="light" :open-delay="100")
                        i.action-button.el-icon-download
            file-structure(v-if="folder.child" :data="folder.child" :depth="depth + 1" :active="active" @getCode="$emit('getCode', $event)")
    .file(v-for="file in data.files" :class="{ active: active === file.id}" @click="$emit('getCode',file.id)")
        .info
            .text-wrapper
                i.el-icon-tickets
                .text {{ file.fileName }}
            .actions
                el-tooltip(placement="right" content="Delete file" effect="light" :open-delay="100")
                    i.action-button.action-button__file.el-icon-document-delete
</template>

<script>
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
  methods: {},
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
