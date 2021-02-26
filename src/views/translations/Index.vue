<template lang="pug">
.translations-wrapper(v-loading="loading")
  // filtration
  .filtration
    // language
    el-select.item(
      v-model="filterForm.language",
      clearable,
      placeholder="Select a language"
    )
      el-option(
        v-for="(key, value) in languageList",
        :label="key",
        :value="value"
      )

    // query
    el-input.item(v-model="filterForm.query", placeholder="Enter a text")

    el-checkbox.item(v-model="filterForm.default" border) Default text

    el-button.item(type="primary", @click="filtrationHandle") Go

    el-button.item(
      type="danger",
      @click="clearFiltrationHandle",
    ) Clear

  // table
  el-table.table(:data="tableData.rows", empty-text="No data" @filter-change="filterStatusHandler")
    el-table-column(label="#", prop="id")
    el-table-column(label="File", prop="file")
      template(slot-scope="props")
        span {{ props.row.file.fileName }}

    el-table-column(label="Status", prop="status" :filters="statusFilter")
      template(slot-scope="props")
        span {{ statusList[props.row.status] }}

    el-table-column(label="Text", prop="text")
    el-table-column(label="Language", prop="lang")
      template(slot-scope="props")
        span {{ props.row.lang === null ? 'Default' : languageList[props.row.lang] }}

    el-table-column
      template(slot-scope="props")
        el-button(
          type="info",
          :disabled="props.row.default",
          size="mini",
          @click="handleOpenModal(props.row)"
        ) Edit

  .footer
    el-pagination.pagination(
      v-on:current-change="onPageChange",
      v-if="tableData.rows",
      layout="prev, pager, next",
      :current-page="filterForm.page",
      :page-size="filterForm.limit",
      :total="tableData.count"
    )

  // modal
  edit-translation-modal(
    :show="showEditTextModal",
    :row="editedRow",
    @close="showEditTextModal = false",
    @getTranslations="getSiteTranslation"
  )
</template>

<script>
import requester from '@/utils/requester';
import { LANGUAGE_LIST, STATUS_LIST } from '@/utils/Constants';
import EditTranslationModal from './EditTranslationModal.vue';

const defaultFilterForm = {
  language: '',
  default: false,
  query: '',
  page: 1,
  limit: 300,
  statuses: [],
};

export default {
  components: { EditTranslationModal },
  metaInfo: { title: 'Translations' },
  data() {
    return {
      statusList: STATUS_LIST,
      languageList: LANGUAGE_LIST,
      loading: false,
      tableData: [],
      editedRow: {},
      showEditTextModal: false,

      filterForm: { ...defaultFilterForm },
    };
  },
  created() {
    this.initQueryParams();
    this.getSiteTranslation();
  },
  computed: {
    statusFilter() {
      return Object.entries(this.statusList).reduce((acc, [value, text]) => {
        acc.push({ text, value });

        return acc;
      }, []);
    },
  },
  methods: {
    initQueryParams() {
      this.filterForm = {
        ...defaultFilterForm,
        ...this.$route.query,
        page: +this.$route.query.page || 1,
        limit: +this.$route.query.limit || 300,
      };
    },
    clearFiltrationHandle() {
      this.filterForm = { ...defaultFilterForm };
      this.$router.replace({ query: null });

      this.getSiteTranslation();
    },
    filtrationHandle() {
      this.$router.push({
        query: {
          ...this.$route.query,
          ...this.filterForm,
        },
      });

      this.getSiteTranslation();
    },
    handleOpenModal(row) {
      this.editedRow = row;
      this.showEditTextModal = true;
    },
    async getSiteTranslation() {
      this.loading = true;
      try {
        this.tableData = await requester
          .get(`/translations/list/${this.$route.params.siteId}`, {
            params: this.filterForm,
          })
          .then((res) => res.data);
      } finally {
        this.loading = false;
      }
    },
    onPageChange(e) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: e,
        },
      });
      this.filterForm.page = e;
      this.getSiteTranslation();
    },
    filterStatusHandler(value) {
      this.filterForm.statuses = value['el-table_1_column_3'];
      this.filtrationHandle();
    },
  },
};
</script>

<style lang="scss" scoped>
.translations-wrapper {
  .filtration {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    .item {
      margin-left: 5px;
    }
  }
}
</style>
