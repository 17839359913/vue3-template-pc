<template>
  <div class="sequence-manage">
    <div class="title">
      <span class="text">XXXX管理</span>
      <span class="combine-btn" @click="sequenceCreate()">
        <PlusCircleFilled style="font-size: 16px; height: 16px" />
        <span>新建XX</span>
      </span>
    </div>
    <div class="composite-control-g">
      <div class="ft-g">
        <div class="key">XX名称：</div>
        <a-input
          style="width: 200px"
          v-model:value="searchParam.namePattern"
          allow-clear
          :maxLength="50"
          placeholder="请输入"
        />
      </div>
    </div>
    <s-table
      style="margin-top: 20px"
      :columns="columns"
      :columnDrag="true"
      :data-source="sequenceList"
      :loading="{
        spinning: loading,
        tip: '数据加载中，不用刷新，请稍等...',
      }"
      :draggable="true"
      :pagination="pagination"
      rowKey="id"
      @drag-change="onDragChange"
    >
      <template #operation="{ record }">
        <a href="javascript:;" @click="sequenceEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="sequenceDelete(record)">删除</a>
      </template>
    </s-table>

    <div class="global-content">
      <SequenceModal
        v-model:visible="isModalVisible"
        :record="rowData"
        @refresh-table="run"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { PlusCircleFilled } from "@ant-design/icons-vue";
// import { RecordType } from "./types";
import { useSequenceList } from "./hooks/useSequenceList";
import { useTableRowActions } from "./hooks/useTableRowActions";
const columns = [
  {
    title: "序列",
    dataIndex: "name",
    width: 200
  },
  {
    title: "职级信息",
    dataIndex: "positionLevelInfo",
    width: 200
  },
  {
    title: "应用团队",
    dataIndex: "applyTeamName"
  },
  {
    title: "操作",
    dataIndex: "operation",
    slots: { customRender: "operation" }
  }
];

export default defineComponent({
  name: "SequenceList",
  components: {
    PlusCircleFilled,
    SequenceModal: defineAsyncComponent(
      () => import("./components/SequenceModal.vue")
    )
  },
  setup() {
    const { searchParam, sequenceList, loading, pagination, run, refresh } =
      useSequenceList();
    const {
      rowData,
      isModalVisible,
      sequenceCreate,
      sequenceEdit,
      sequenceDelete
    } = useTableRowActions(refresh);

    const onDragChange = async (event: any) => {
      const {
        element: { id },
        newIndex
      } = event.moved;
      console.log(id, newIndex);
    };

    return {
      columns,
      searchParam,
      sequenceList,
      loading,
      pagination,
      run,
      refresh,

      rowData,
      isModalVisible,
      sequenceCreate,
      sequenceEdit,
      sequenceDelete,

      onDragChange
    };
  }
});
</script>

<style lang="less" scoped>
.sequence-manage {
  background: #fff;
  height: 100%;

  .title {
    margin-bottom: 24px;
    display: flex;
    .text {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: #1f1f1f;
    }
    .combine-btn {
      margin-left: 20px;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      color: #ff6600;
      &:hover {
        color: #fd7668;
      }
      > span {
        &:last-child {
          margin-left: 8px;
        }
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
</style>
