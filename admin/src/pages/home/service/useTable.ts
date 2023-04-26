import { CoTableConditionType, CoTableHeaderType } from "@/components/CoTable.vue";
import { hasUserAction, Action } from "@/utils/actions";
import { parseTableConditionSeoForm } from "@/utils/business";
import { getUserList } from "@/utils/request/api/user";
import { ElMessage } from 'element-plus';

const tableHeader = ref<CoTableHeaderType[]>([
  { prop: 'username', label: '用户名' },
  { prop: 'nickname', label: '昵称' },
  { prop: 'email', label: '电子邮箱' },
  { prop: 'phone', label: '手机号码', width: '150px' },
  { prop: 'age', label: '年龄', width: '80px' },
  { prop: 'sex', label: '性别', width: '80px' },
  { prop: 'role', label: '角色' },
  { prop: 'createdTime', label: '创建时间'},
]);
if (hasUserAction(Action.CREATE)) {
  tableHeader.value.push({ prop: 'operate', label: '操作', fixed: 'right', width: '120px' });
}
const tableCondition = ref<CoTableConditionType>({
  page: 1,
  size: 10,
  total: 0,
  seoForm: [
    { prop: 'username', type: 'input', value: '', placeholder: '请输入用户名' },
  ]
});
const tableData = ref<any>([]);

const serachFn = async (done: () => void) => {
  const { page, size, seoForm } = tableCondition.value;
  const condition = seoForm ? parseTableConditionSeoForm(seoForm) : {};
  const res = await getUserList({ page, size, condition });
  if (res.code === 0) {
    tableData.value = res.data;
    tableCondition.value.total = res.total as number;
  } else {
    ElMessage.warning(res.msg);
  }
  done();
}

export const useTable = () => {

  return {
    tableHeader,
    tableCondition,
    tableData,
    serachFn
  }
}