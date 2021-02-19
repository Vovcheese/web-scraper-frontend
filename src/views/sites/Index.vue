<template lang="pug">
.sites-list-wrapper(v-loading="loading")
  // parse form
  parse-form(@getSiteList="getSiteList")

  // table
  el-table.table(:data="tableData" empty-text="No data")
    el-table-column(label="#", prop="id", width="50")

    el-table-column(label="Name", prop="name")
      //- template(slot-scope="props")

    el-table-column(label="Url", prop="url")

    el-table-column(label="Site data stats", prop="countFiles")
      template(slot-scope="props")
        .count-stats
          el-tag(type="info" size="mini") files: {{ props.row.countFiles }}
          el-tag(type="info" size="mini") words: {{ props.row.countWords }}

    el-table-column(label="Stages", prop="pipelines")
      template(slot-scope="props")
        .template-container
          .pipeline(v-for="item in props.row.pipelines")
            el-tooltip(placement="top" :content="item.status === 'ERROR' ? item.error : pipelinesStageTranslate[item.type]" :open-delay="200")
              .circle(:style="`border-color:${pipelinesStatusTranslate[item.status].color}`")
                i(:class="`el-icon-${pipelinesStatusTranslate[item.status].icon} icon`" :style="`color:${pipelinesStatusTranslate[item.status].color}`")

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

    el-table-column(width="130")
      template(slot-scope="props")
        router-link(:to='`/translations/${props.row.id}`')
          el-button(type="info" size="mini") Translations

</template>

<script>
import requester from '@/utils/requester';
import { PIPELINES_STAGE_TRANSLATE } from '@/utils/Constants';
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
  },
  methods: {
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
  },
};
</script>

<style lang="scss" scoped>
.sites-list-wrapper {
  max-height: 100%;
  max-width: 100%;

  .table {
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
          // background-color: #c3e6cd3d;
          border-color: #217645;
        }
      }
    }
  }
}
</style>
