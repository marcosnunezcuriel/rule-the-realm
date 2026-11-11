import type { Effects } from "./Effects";

export interface Modifier {
    id: string;
    name: string;
    description: string;
    dailyEffects: Effects;
}
