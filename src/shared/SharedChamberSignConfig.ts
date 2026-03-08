export interface SharedChamberSignConfigMapSignIcon {
    name: string;
    active: boolean;
}

export interface SharedChamberSignConfigMapSign {
    name: string;
    current_level: number;
    total_levels: number;
    icons: SharedChamberSignConfigMapSignIcon[];
}

export interface SharedChamberSignConfigMap {
    name: string;
    signs: SharedChamberSignConfigMapSign[];
}

export interface SharedChamberSignConfig {
    maps: SharedChamberSignConfigMap[];
}

export const SharedChamberSignIcons = [
    "cube_drop",
    "cube_button",
    "cube_bonk",
    "drink_water",
    "goop",
    "crushers",
    "laser_cube",
    "turret",
    "turret_burn",
    "portal_fling",
    "plate_fling",
    "bridges",
    "bridge_block",
    "grinders",
    "tbeams",
    "paint_bounce",
    "paint_speed",
    "handoff",
    "button_stand",
    "laser_power",
    "portal_fling_2",
    "tbeam_polarity",
    "danger_field",
] as const;

export function getChamberSignIconImageName(icon: string): string {
    switch (icon) {
        case "cube_drop":
            return "box_dispenser";
        case "cube_button":
            return "box_button";
        case "cube_bonk":
            return "box_hurt";
        case "drink_water":
            return "fountain";
        case "goop":
            return "toxic";
        case "crushers":
            return "crushers";
        case "laser_cube":
            return "laser_cube";
        case "turret":
            return "turret";
        case "turret_burn":
            return "laser_burn";
        case "portal_fling":
            return "fling1";
        case "plate_fling":
            return "catapult";
        case "bridges":
            return "bridge";
        case "bridge_block":
            return "bridge_block";
        case "grinders":
            return "grinders";
        case "tbeams":
            return "tractor_beam";
        case "paint_bounce":
            return "paint_jump";
        case "paint_speed":
            return "paint_speed";
        case "handoff":
            return "handoff";
        case "button_stand":
            return "button_stand";
        case "laser_power":
            return "laser_catcher";
        case "portal_fling_2":
            return "fling2";
        case "tbeam_polarity":
            return "tractor_polarity";
        case "danger_field":
            return "danger_field";

        default:
            return icon;
    }
}
