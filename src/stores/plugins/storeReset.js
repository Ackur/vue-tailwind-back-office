import { cloneDeep } from "@/core/utils/utils";

export default function storeReset({ store }) {
  const initialState = cloneDeep(store.$state);
  store.$reset = () => store.$patch(cloneDeep(initialState));
}
