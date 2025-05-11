import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import { vueTsConfigs } from "@vue/eslint-config-typescript";

export default defineConfig([
  ...pluginVue.configs["flat/recommended"],
  ...vueTsConfigs.recommended,
  {
    rules: {
      "vue/singleline-html-element-content-newline": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-indent": "off",
    },
  },
]);
