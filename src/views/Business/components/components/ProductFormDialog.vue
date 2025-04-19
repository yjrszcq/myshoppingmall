<template>
  <el-dialog
      title="Create Discount Promotion"
      :model-value="visible"
      @update:model-value="emit('update:visible', $event)"
      width="600px"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <div class="form-row">
        <el-form-item label="Price" class="form-col">
          <el-input-number v-model="form.price" :min="0" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="Stock" class="form-col">
          <el-input-number v-model="form.stock" :min="0"></el-input-number>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="emit('submit')">Confirm</el-button>
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
  type: {
    type: String,
    validator: (value) => ['add', 'edit'].includes(value),
    required: true
  },
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:visible', 'submit'])
</script>

<style scoped lang="scss">
.form-row {
  display: flex;
  gap: 5px;

  .form-col {
    width: 50%;
    flex: 0;
    margin-bottom: 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>