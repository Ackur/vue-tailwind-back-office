import { createPinia } from "pinia";
import storeReset from "./plugins/storeReset";

const store = createPinia();
store.use(storeReset);

export default store;
