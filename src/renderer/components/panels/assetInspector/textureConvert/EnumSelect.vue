<template>
    <UPopover :content="{ side: 'bottom', align: 'start' }" v-model:open="open">
        <UButton
            :label="labelFunc ? labelFunc(selectedVal.toString()) : selectedVal.toString()"
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
                :class="{ 'gap-1': grouping !== undefined }"
                :style="`grid-template-columns: repeat(${columns ?? 1}, 1fr)`"
            >
                <template v-if="grouping === undefined" v-for="entry in Object.values(props.enum)">
                    <EnumSelectItem
                        :entry="entry"
                        @click="handleClick"
                        :label-func="labelFunc"
                        :default="props.default"
                        :is-selected="selectedVal === entry"
                        :disabled="disabledFunc ? disabledFunc(entry) : false"
                    />
                </template>

                <template v-else>
                    <template v-for="group in grouping.groups">
                        <div class="grid grid-cols-subgrid col-span-full border border-accented p-2 gap-1">
                            <span class="col-span-full text-sm">{{ group.label }}</span>
                            <template v-for="item in group.items">
                                <EnumSelectItem
                                    :entry="item"
                                    @click="handleClick"
                                    :label-func="labelFunc"
                                    :default="props.default"
                                    :is-selected="selectedVal === item"
                                    :disabled="disabledFunc ? disabledFunc(item) : false"
                                />
                            </template>
                        </div>
                    </template>

                    <div
                        v-if="grouping.ungrouped.length > 0"
                        class="grid grid-cols-subgrid col-span-full border border-accented p-2 gap-1"
                    >
                        <span class="col-span-full text-sm">Other</span>
                        <template v-for="item in grouping.ungrouped">
                            <EnumSelectItem
                                :entry="item"
                                @click="handleClick"
                                :label-func="labelFunc"
                                :default="props.default"
                                :is-selected="selectedVal === item"
                                :disabled="disabledFunc ? disabledFunc(item) : false"
                            />
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </UPopover>
</template>

<script setup lang="ts" generic="E extends Object, T = E[keyof E]">
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { SharedVtfEnumGrouping } from "Shared/vtf/SharedVtfEnumGrouping.js";

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
