import { ref } from 'vue'
import { modalConfirm } from '@/utils/modalConfirm'
import { toStringLocal } from '@/utils/tools'
import { RecordType } from '../types'
import { deleteSeq } from '@/api/sequence'

/**
 * 提供针对表格的某一行的处理函数：添加一行、编辑一行、删除一行
 * @param refresh 表格刷新函数
 * @returns
 */
export const useTableRowActions = (refresh: () => void) => {
  const isModalVisible = ref(false)
  const rowData = ref<RecordType | Record<string, any>>({})

  const sequenceCreate = () => {
    isModalVisible.value = true
    rowData.value = {}
  }

  const sequenceEdit = (record: RecordType) => {
    isModalVisible.value = true
    rowData.value = record
  }

  const sequenceDelete = async (record: RecordType) => {
    modalConfirm({
      title: '确认删除吗？',
      onOk: async () => {
        try {
          const deleteSeqParam = {
            id: record.id
          }
          await deleteSeq(toStringLocal(deleteSeqParam))
        } finally {
          refresh()
        }
      }
    }).delete()
  }
  return {
    rowData,
    isModalVisible,
    sequenceCreate,
    sequenceEdit,
    sequenceDelete
  }
}
