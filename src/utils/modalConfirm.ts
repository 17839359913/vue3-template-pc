import { Modal } from 'ant-design-vue'
import { ModalFuncProps } from 'ant-design-vue/es/modal/Modal'
import { createVNode } from 'vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'

/**
 * 使用确认modal
 * @param props
 */
export function modalConfirm(props: ModalFuncProps) {
  const propsBody = {
    width: 300,
    centered: true,
    icon: createVNode(ExclamationCircleFilled),
    ...props
  }
  return {
    delete: () =>
      Modal.confirm({
        ...propsBody,
        class: 'confirm-modal-d',
        okText: '删除'
      }),
    confirm: () =>
      Modal.confirm({
        ...propsBody,
        class: 'confirm-modal-t',
        okText: '确定'
      })
  }
}
