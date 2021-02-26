<template lang="pug">
  .edit-translation-modal-wrapper
    el-dialog(
      @open="handleModalOpen"
      @close="handleClose"
      title="Updating the translation"
      :visible="show"
      width="600px"
      append-to-body)

      el-input(v-model="newTranslation" type="textarea" :rows="8" placeholder="Please input text")

      span(slot="footer" class="dialog-footer")
        el-button(type="primary" size="mini" @click="updateTranslationHandle") Update

</template>

<script>
import requester from '@/utils/requester';

export default {
  props: ['show', 'row'],
  data() {
    return {
      newTranslation: '',
    };
  },
  methods: {
    async updateTranslationHandle() {
      const text = this.newTranslation;
      const translationId = this.row.id;

      try {
        await requester.post(`/translations/${translationId}`, { text });
      } finally {
        this.$emit('getTranslations');
        this.handleClose();
      }
    },
    handleModalOpen() {
      this.newTranslation = this.row.text;
    },
    handleClose() {
      this.$emit('close');
    },
  },
};
</script>
