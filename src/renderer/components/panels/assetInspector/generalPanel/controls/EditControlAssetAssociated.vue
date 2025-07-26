<template>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
        <span>Substance Designer</span>
        <UInput v-model="associated.substanceDesigner" placeholder="Enter path" @blur="handleBlur" />
        <span>Blender</span>
        <UInput v-model="associated.blender" placeholder="Enter path" @blur="handleBlur" />
    </div>
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{ asset: SharedAsset }>();

const associated = ref(props.asset.def.associatedFiles ?? {});
watch(
    () => props.asset.def.associatedFiles,
    (f) => {
        associated.value = f ?? {};
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

function handleBlur() {
    const a = toRaw(associated.value);
    const hasSomeValue = Object.values(a).some((v) => v !== undefined && v !== "");
    if (!hasSomeValue) {
        inj?.updateAsset({ associatedFiles: undefined });
    } else {
        for (const v in a) {
            if (a[v as keyof typeof a] === "") {
                a[v as keyof typeof a] = undefined;
            }
        }
        inj?.updateAsset({ associatedFiles: a });
    }
}
</script>

<style scoped></style>
