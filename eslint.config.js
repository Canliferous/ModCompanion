import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs([
    ...pluginVue.configs["flat/recommended"],
    vueTsConfigs.recommended,
    {
        rules: {
            "vue/singleline-html-element-content-newline": "off",
            "vue/max-attributes-per-line": "off",
            "vue/html-indent": "off",
            "vue/html-self-closing": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
]);
