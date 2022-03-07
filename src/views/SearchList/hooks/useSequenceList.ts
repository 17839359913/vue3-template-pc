import { reactive, computed, watch } from "vue";
import { toStringLocal } from "@/utils/tools";
import { SearchParam } from "../types";
import { querySequenceList } from "@/api/sequence";
import { useRequest } from "@/hooks/useRequest";

/**
 * 获取序列管理列表
 */
export const useSequenceList = () => {
    const searchParam = reactive<SearchParam>({
        namePattern: ""
    });

    const service = (pagination: { current: number; pageSize: number }) => {
        const { namePattern } = searchParam;
        const query = {
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            namePattern: namePattern === "" ? undefined : namePattern
        };

        return querySequenceList(toStringLocal(query));
    };
    const options = {
        paginated: true,
        debounceInterval: 500
    };
    const { data, loading, pagination, run, refresh } = useRequest(
        service,
        options
    );
    console.log("datadata", data);
    const sequenceList = computed(() => {
        return data.value?.data?.list || [];
    });

    watch([searchParam], run);

    return { searchParam, sequenceList, loading, pagination, run, refresh };
};
