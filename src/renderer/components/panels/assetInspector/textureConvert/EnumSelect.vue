<template>
    <UPopover v-model:open="open" :content="{ side: 'bottom', align: 'start' }">
        <UButton
            :label="labelFunc ? labelFunc(selectedVal.toString()) : selectedVal.toString()"
            variant="cave"
            :color="!isDefault ? 'primary' : 'neutral'"
            :trailing-icon="AppDesign.Icons.ChevronDown"
            block
            :ui="{
                base: 'relative hover:bg-none',
                label: 'text-left',
                trailingIcon: !isDefault ? 'text-primary-400' : 'text-dimmed',
            }"
        />

        <template #content>
            <div class="p-2">
                <div
                    class="grid max-h-180 overflow-y-auto"
                    :class="{ 'gap-2': grouping !== undefined }"
                    :style="`grid-template-columns: repeat(${columns ?? 1}, 1fr)`"
                >
                    <template v-if="grouping === undefined">
                        <template v-for="(entry, i) in Object.values(props.enum)" :key="i">
                            <EnumSelectItem
                                :entry="entry"
                                :label-func="labelFunc"
                                :default="props.default"
                                :is-selected="selectedVal === entry"
                                :disabled="disabledFunc ? disabledFunc(entry) : false"
                                @click="handleClick"
                            />
                        </template>
                    </template>

                    <template v-else>
                        <template v-for="group in grouping.groups" :key="group.label">
                            <div class="grid grid-cols-subgrid col-span-full p-2 gap-1 bg-neutral-850 rounded">
                                <span class="col-span-full text-sm">{{ group.label }}</span>
                                <template v-for="(item, i) in group.items" :key="i">
                                    <EnumSelectItem
                                        :entry="item"
                                        :label-func="labelFunc"
                                        :default="props.default"
                                        :is-selected="selectedVal === item"
                                        :disabled="disabledFunc ? disabledFunc(item) : false"
                                        @click="handleClick"
                                    />
                                </template>
                            </div>
                        </template>

                        <div
                            v-if="grouping.ungrouped.length > 0"
                            class="grid grid-cols-subgrid col-span-full p-2 gap-1 bg-neutral-850 rounded"
                        >
                            <span class="col-span-full text-sm">Other</span>
                            <template v-for="(item, i) in grouping.ungrouped" :key="i">
                                <EnumSelectItem
                                    :entry="item"
                                    :label-func="labelFunc"
                                    :default="props.default"
                                    :is-selected="selectedVal === item"
                                    :disabled="disabledFunc ? disabledFunc(item) : false"
                                    @click="handleClick"
                                />
                            </template>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts" generic="E extends Object, T = E[keyof E]">
import { SharedVtfCreateOptions } from "Shared/SharedVtf.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { SharedVtfEnumGrouping } from "Shared/vtf/SharedVtfEnumGrouping.js";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{
    enum: E;
    options: SharedVtfCreateOptions;
    field: keyof SharedVtfCreateOptions;
    default?: T;
    labelFunc?: (v: T) => string;
    disabledFunc?: (v: T) => boolean;
    columns?: number;
    grouping?: SharedVtfEnumGrouping<T>;
}>();
const selectedVal = ref(props.options[props.field] ?? props.default);
watch(
    () => props.options[props.field],
    (v) => {
        selectedVal.value = v ?? props.default;
    },
);

const inj = inject(AssetInspectorTextureConvertInjectKey);

const open = ref(false);

const isDefault = computed(() => selectedVal.value === props.default);

function handleClick(item: T): void {
    open.value = false;
    selectedVal.value = item;

    inj?.updateOptions({ [props.field]: toRaw(selectedVal.value) });
}
</script>

<style scoped></style>
