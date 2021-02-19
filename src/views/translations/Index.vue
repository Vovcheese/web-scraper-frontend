<template lang="pug">
  .translations-wrapper(v-loading="loading")
    el-table.table(:data="tableData")
      el-table-column(label="#", prop="id")
      el-table-column(label="site id", prop="siteId")
      el-table-column(label="status", prop="status")
      el-table-column(label="text", prop="text")
      el-table-column(label="lang", prop="lang")
      el-table-column(label="default", prop="default")

</template>

<script>
import requester from '@/utils/requester';

export default {
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  created() {
    this.getSiteTranslation();
  },
  methods: {
    async getSiteTranslation() {
      this.loading = true;
      try {
        this.tableData = await requester
          .get(`/translations/list/${this.$route.params.siteId}`, { params: { lang: 'en' } })
          .then((res) => res.data.rows);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
