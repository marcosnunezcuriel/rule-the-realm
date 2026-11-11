import type { Effects } from "./Effects";

export interface Situation {
    id: string;
    name: string;
    description: string;
    dailyEffects: Effects;
}
