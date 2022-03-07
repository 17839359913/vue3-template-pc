<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :centered="true"
    :keyboard="false"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    @ok="submit"
    @cancel="closeModal"
  >
    <a-form :label-col="{ span: 4.5 }" :wrapper-col="{ span: 16 }">
      <a-form-item label="序列名称" name="name" v-bind="validateInfos.name">
        <a-input
          v-model:value="form.name"
          :maxLength="50"
          autocomplete="off"
          placeholder="请输入，如管理序列"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="英文代码" name="code" style="margin-bottom: 0">
        <a-input
          v-model:value="form.code"
          style="width: 120px; margin-right: 8px"
          :maxLength="50"
          autocomplete="off"
          placeholder="请输入"
          allow-clear
        />
        <a-tooltip :overlayStyle="{ width: '330px' }">
          <template #title>
            根据业务需求定义，如管理序列填M，专业序列填P
          </template>
          <QuestionCircleOutlined style="color: #8c8c8c" />
        </a-tooltip>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, PropType, reactive, watch } from 'vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { RecordType } from '../types'
import { Form } from 'ant-design-vue'
import { createSeq, editSeq } from '@/api/sequence'

const useForm = Form.useForm

export default defineComponent({
  name: 'CAUSeqModal',
  components: { QuestionCircleOutlined },
  props: {
    record: {
      type: Object as PropType<RecordType | Record<string, any>>,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible', 'refresh-table'],
  setup(props, { emit }) {
    const { record, visible } = toRefs(props)
    const isEditMode = computed(() => record.value && Object.keys(record.value).length > 0)
    const modalTitle = computed(() => isEditMode.value ? '编辑XXX' : '新建XXX')
    const form = reactive({
      name: '',
      code: ''
    })
    const rulesRef = reactive({
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    })
    const { validate, validateInfos, clearValidate } = useForm(form, rulesRef)

    const submit = () => {
      validate()
        .then(async () => {
          // console.log(modelRef);
          isEditMode.value
            ? await editSeq({ ...form, id: record.value.id })
            : await createSeq(form)

          closeModal()
          emit('refresh-table')
        })
        .catch(err => {
          console.warn('error', err)
        })
    }
    const closeModal = () => emit('update:visible', false)

    watch(record, () => {
      const { name, code } = record.value
      form.name = name
      form.code = code
    })
    watch(visible, () => {
      if (!visible.value) {
        clearValidate()
      }
    })

    return {
      modalTitle,
      form,
      validateInfos,

      closeModal,
      submit
    }
  }
})
</script>

<style lang="less" scoped></style>
