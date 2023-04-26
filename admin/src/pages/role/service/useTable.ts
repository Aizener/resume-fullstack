import { parseTableConditionSeoForm } from '@/utils/business';
import { CoTableConditionType, CoTableHeaderType } from "@/components/CoTable.vue";
import { getRoleList } from '@/utils/request/api/role';
import { Action, hasRoleAction } from '@/utils/actions';

const tableHeader = ref<CoTableHeaderType[]>([
  { prop: 'name', label: '角色名称', width: '120px' },
  { prop: 'menusInfo', label: '菜单权限' },
  { prop: 'permissionsInfo', label: '操作权限' },
]);
if (hasRoleAction(Action.UPDATE)) {
  tableHeader.value.push({ prop: 'operate', label: '操作', width: '60px' });
}

const tableCondition = ref<CoTableConditionType>({
  page: 1,
  size: 10,
  total: 0,
  seoForm: [
    { prop: 'name', type: 'input', value: '', placeholder: '请输入角色名称' }
  ]
});
const tableData = ref<any>([]);
const getTitle = (row: ApiRole, key: 'permissionsInfo' | 'menusInfo') => {
  const info = row[key];
  const title = info.length > 0 ? info?.map(m => m.title) : '-';
  return title;
}

export const useTable = () => {
  const searchFn = async (done: () => void) => {
    const { page, size, seoForm } = tableCondition.value;
    const condition = seoForm ? parseTableConditionSeoForm(seoForm) : {};
    const res = await getRoleList({ page, size, ...condition });
    if (res.code === 0) {
      tableData.value = res.data;
      tableCondition.value.total = res.total as number;
    }
    done();
  }
  return {
    tableHeader,
    tableData,
    tableCondition,
    getTitle,
    searchFn
  }
}