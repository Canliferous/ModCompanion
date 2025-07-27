<template>
    <UPopover :content="{ side: 'bottom', align: 'start' }" v-model:open="open">
        <UButton
            :label="selectedItem?.label"
            variant="outline"
            :color="!isDefault ? 'primary' : 'neutral'"
            trailing-icon="tdesign:chevron-down"
            block
            :ui="{
                base: 'relative hover:bg-none',
                label: 'text-left',
                trailingIcon: !isDefault ? 'text-primary-400' : 'text-dimmed',
            }"
        />

        <template #content>
            <div
                class="p-1 grid max-h-180 overflow-y-auto"
                :style="`grid-template-columns: repeat(${columns ?? 1}, 1fr)`"
            >
                <template v-for="item in items">
                    <UButton
                        :label="item.label"
                        variant="ghost"
                        :color="selectedItem?.id === item.id ? 'primary' : 'neutral'"
                        :icon="selectedItem?.id === item.id ? 'tdesign:check' : 'nothing'"
                        @click="() => handleClick(item)"
                    />
                </template>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts" generic="E extends Object, T = E[keyof E]">
import { SharedVtfCreateOptions } from "Shared/SharedMareTf.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

const props = defineProps<{
    enum: E;
    options: SharedVtfCreateOptions;
    field: keyof SharedVtfCreateOptions;
    default: T;
    labelFunc?: (v: T) => string;
    columns?: number;
}>();
const val = ref(props.options[props.field] ?? props.default);
watch(
    () => props.options[props.field],
    (v) => {
        val.value = v ?? props.default;
    },
);

const inj = inject(AssetInspectorTextureConvertInjectKey);

interface Item {
    id: T;
    label: string;
}
const items: Item[] = Object.values(props.enum).map<Item>((v) => ({
    id: v,
    label: props.labelFunc ? props.labelFunc(v) : v,
}));

const open = ref(false);

const isDefault = computed(() => val.value === props.default);
const selectedItem = computed(() => items.find((v) => v.id === val.value));

function handleClick(item: Item): void {
    open.value = false;
    val.value = item.id;

    inj?.updateOptions({ [props.field]: toRaw(val.value) });
}
</script>

<style scoped></style>
