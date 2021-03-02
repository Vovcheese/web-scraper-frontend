<template lang="pug">
.parse-form-wrapper
  el-form.form(
    :inline="true",
    :model="siteForm",
    status-icon,
    :rules="rules",
    ref="siteForm"
  )
    el-form-item.item(prop="name")
      el-input(v-model.trim="siteForm.name", placeholder="Enter a site name")

    el-form-item.item(prop="link")
      el-input(v-model.trim="siteForm.link", placeholder="Enter a site link")

    el-form-item.item(prop="languages")
      el-select(
        v-model="siteForm.languages",
        multiple,
        clearable,
        :collapse-tags="true"
        placeholder="Select a language"
      )
        el-option(v-for="(key, value) in languageList", :label="key", :value="value")

    el-form-item
      el-button(type="primary", @click="goParse('siteForm')") Scrape

</template>

<script>
import { LANGUAGE_LIST } from '@/utils/Constants';
import requester from '@/utils/requester';

export default {
  data() {
    return {
      languageList: LANGUAGE_LIST,
      siteForm: {
        name: '',
        link: '',
        languages: [...Object.keys(LANGUAGE_LIST)],
      },
      rules: {
        name: [
          { required: true, message: 'enter a name', trigger: 'blur' },
        ],
        link: [
          {
            required: true, message: 'enter a link', trigger: 'blur',
          },
        ],
        languages: [
          { required: true, message: 'select a language', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async goParse(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await requester.post('/scrape', this.siteForm);
          } finally {
            this.$emit('getSiteList');
            this.siteForm = {
              name: '',
              link: '',
              languages: [],
            };
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.parse-form-wrapper {
  margin-left: 10px;

  .form {
    display: flex;
    align-items: center;

    .item,
    .el-form-item__content,
    .el-select {
      width: 100%;
    }
  }
}
</style>
