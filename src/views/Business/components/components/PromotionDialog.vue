<template>
  <el-dialog
      title="Create Discount Promotion"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      width="600px"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="Discount Rate (%)">
        <el-input-number
            v-model="form.discountRate"
            :min="0.01"
            :max="99.99"
            :precision="2"
            controls-position="right"
        />
      </el-form-item>
      <el-form-item label="Start Date">
        <el-date-picker
            v-model="form.startDate"
            type="datetime"
            placeholder="Select start date"
            value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
      <el-form-item label="End Date">
        <el-date-picker
            v-model="form.endDate"
            type="datetime"
            placeholder="Select end date"
            value-format="YYYY-MM-DD HH:mm"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button
            type="primary"
            @click="emit('create')"
            :loading="loading"
        >
          Create Promotion
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  form: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'create'])
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>