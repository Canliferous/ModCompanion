<template>
    <USelect
        class="w-full"
        :items="items"
        v-model="val"
        value-key="id"
        :class="{ 'text-primary-300': !isDefault }"
        @change="handleChange"
    />
</template>

<script setup lang="ts" generic="E extends object, T = E[keyof E]">
import { SelectItem } from "@nuxt/ui/components/Select.vue.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { SharedVtfCreateOptions } from "Shared/SharedMareTf.js";

const props = defineProps<{
    enum: E;
    options: SharedVtfCreateOptions;
    field: keyof SharedVtfCreateOptions;
    default: T;
    labelFunc?: (v: T) => string;
}>();
const val = ref(props.options[props.field] ?? props.default);
watch(
    () => props.options[props.field],
    (v) => {
        val.value = v ?? props.default;
    },
);

const isDefault = computed(() => val.value === props.default);

const items: SelectItem[] = Object.values(props.enum).map<SelectItem>((v) => ({
    id: v,
    label: props.labelFunc ? props.labelFunc(v) : v,
}));

const inj = inject(AssetInspectorTextureConvertInjectKey);

function handleChange(): void {
    inj?.updateOptions({ [props.field]: toRaw(val.value) });
}
</script>

<style scoped></style>
