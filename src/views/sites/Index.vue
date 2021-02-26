<template lang="pug">
.sites-list-wrapper(v-loading="loading")
  // parse form
  parse-form.filtration(@getSiteList="getSiteList")

  // table
  el-table.table(:data="tableData" empty-text="No data")
    el-table-column(label="#", prop="id", width="50")

    el-table-column(label="Name", prop="name")
      template(slot-scope="props")
        a(:href="`${siteLinkGenerate}/default`" target="_blank" v-if="props.row.active") {{ props.row.name }}
        span(v-else) {{ props.row.name }}

    el-table-column(label="Url", prop="url")

    el-table-column(label="Amount files", prop="countFiles")

    el-table-column(label="Words", prop="countWords")
      template(slot-scope="props")
        .count-stats
          span All: {{ props.row.countWords }}
          span Default: {{ props.row.countDefaultWords }}
          span Translated:
            el-tag.tag-counts(v-if="checkErrorTranslates(props.row)" size="mini" type="danger") {{ props.row.countTranslatedWords }}
            span(v-else) {{ ' ' + props.row.countTranslatedWords }}

    el-table-column(label="Stages", prop="pipelines")
      template(slot-scope="props")
        .template-container
          .pipeline(v-for="item in props.row.pipelines")
            el-tooltip(placement="top" :content="item.status === 'ERROR' ? item.error : pipelinesStageTranslate[item.type]" :open-delay="200")
              .circle(:style="`border-color:${pipelinesStatusTranslate[item.status].color}`")
                i(v-if="props.row.pipelines[2].status === 'SUCCESS' && item.type === 'TRANSLATING'" class="el-icon-refresh-right icon" @click="startTranslateStage(props.row)")
                i(v-else :class="`el-icon-${pipelinesStatusTranslate[item.status].icon} icon`" :style="`color:${pipelinesStatusTranslate[item.status].color}`")

    el-table-column(label="Active", prop="active")
      template(slot-scope="props")
        el-switch(v-model="props.row.active" inactive-color="#909399" active-color="#67C23A" @change="updateSiteActive(props.row)" :inactive-value="false" :active-value="true")

    el-table-column(width="110")
      template(slot-scope="props")
        el-popconfirm(confirm-button-text='OK'
          cancel-button-text='No, Thanks'
          icon="el-icon-info"
          icon-color="red"
          title="Are you sure to delete this?"
          @confirm="deleteSiteHandle(props.row)")
          el-button(type="danger" slot="reference" size="mini" :disabled="props.row.active") Delete

    // go to translations
    el-table-column(width="130")
      template(slot-scope="props")
        router-link(:to='`/translations/${props.row.id}`')
          el-button(type="info" size="mini") Translations

    // go to files list
    el-table-column(width="130")
      template(slot-scope="props")
        router-link(:to='`/files/${props.row.id}`')
          el-button(type="info" size="mini") Files

</template>

<script>
import requester from '@/utils/requester';
import { PIPELINES_STAGE_TRANSLATE } from '@/utils/Constants';
import socket from '@/plugins/socketio';
import parseForm from './parse/Form.vue';

export default {
  components: { parseForm },
  metaInfo: { title: 'Sites' },
  data() {
    return {
      pipelinesStageTranslate: PIPELINES_STAGE_TRANSLATE,
      loading: false,
      tableData: [],

      pipelinesStatusTranslate: {
        PENDING: {
          color: '#909399',
          icon: 'minus',
        },
        PROGRESS: {
          color: '#409EFF',
          icon: 'moon',
        },
        SUCCESS: {
          color: '#217645',
          icon: 'check',
        },
        ERROR: {
          color: '#F56C6C',
          icon: 'close',
        },
      },
    };
  },
  created() {
    this.getSiteList();
    socket.on('UPDATE_STATUS_PIPELINE', this.updateStatusPipeline);
    socket.on('UPDATE_COUNT_FILES', this.updateCountFiles);
    socket.on('UPDATE_COUNT_WORDS', this.updateCountWords);
    socket.on('UPDATE_COUNT_TRANSLATES', this.updateCountTranslates);
  },
  computed: {
    siteLinkGenerate() {
      return 'http://localhost:4050';
      // return window.location.origin;
    },
  },
  methods: {
    updateStatusPipeline(data) {
      const findSite = this.tableData.find((i) => i.id === data.siteId);
      if (!findSite) return;
      const findPipeline = findSite.pipelines.find((i) => i.type === data.type);
      findPipeline.status = data.status;
    },
    updateCountFiles(data) {
      const findSite = this.tableData.find((i) => i.id === data.siteId);
      if (!findSite) return;
      findSite.countFiles = data.count;
    },
    updateCountWords(data) {
      const findSite = this.tableData.find((i) => i.id === data.siteId);
      if (!findSite) return;
      findSite.countWords = data.count;
    },
    updateCountTranslates(data) {
      const findSite = this.tableData.find((i) => i.id === data.siteId);
      if (!findSite) return;
      findSite.countTranslatedWords = data.count;
    },
    async getSiteList() {
      this.loading = true;
      try {
        this.tableData = await requester
          .get('/site/list')
          .then((res) => res.data.rows);
      } finally {
        this.loading = false;
      }
    },
    async updateSiteActive(row) {
      const siteId = row.id;

      try {
        await requester.post(`/site/switch/active/${siteId}`);
      } finally {
        this.getSiteList();
      }
    },
    async deleteSiteHandle(row) {
      const siteId = row.id;

      try {
        await requester.delete(`/site/${siteId}`);
      } finally {
        this.getSiteList();
      }
    },
    async startTranslateStage(row) {
      const siteId = row.id;

      try {
        await requester.post(`/pipeline/reload/translations/${siteId}`);
      } catch (err) {
        console.log(err);
      }
    },
    checkErrorTranslates(row) {
      if (!row) return false;

      return row.pipelines[3].status === 'SUCCESS' && row.countWords !== (row.countTranslatedWords + row.countDefaultWords);
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-counts {
  margin-left: 5px;
}
.sites-list-wrapper {
  max-height: 100%;
  max-width: 100%;
  padding-top: 10px;

  .table {
    .count-stats {
      display: flex;
      flex-direction: column;
      .tag {
        margin-left: 5px;
      }
    }

    .template-container {
      display: flex;

      .pipeline {
        margin: 3px;

        .circle {
          border: 0.1em solid transparent;
          box-sizing: border-box;
          border-style: solid;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-block;

          .icon {
            display: inline-block;
            width: 100%;
            text-align: center;
          }
        }
        .circle:hover {
          cursor: pointer;
          border: 0.1em solid;
          border-color: #217645;
        }
      }
    }
  }
}
</style>
