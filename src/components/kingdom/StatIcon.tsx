import type { KingdomValues } from "../../types/stats";

type StatIconProps = {
    stat: keyof KingdomValues;
};

function StatIcon({ stat }: StatIconProps) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {stat === "gold" && (
                <>
                    <ellipse cx="10" cy="6" rx="7" ry="3" />
                    <path d="M3 6v9c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
                    <path d="M3 11c0 1.7 3.1 3 7 3s7-1.3 7-3" />
                    <path d="M17 10c2.4.3 4 1.3 4 2.5v5c0 1.1-1.6 2.2-4 2.6" />
                </>
            )}

            {stat === "prestige" && (
                <>
                    <path d="M3 7l4 4 5-7 5 7 4-4-2 12H5L3 7Z" />
                    <path d="M5 19h14" />
                </>
            )}

            {stat === "faith" && (
                <>
                    <path d="M12 3v12M8 7h8" />
                    <path d="M5 21v-7l7-4 7 4v7" />
                    <path d="M3 21h18" />
                </>
            )}

            {stat === "population" && (
                <>
                    <circle cx="9" cy="8" r="3" />
                    <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
                    <circle cx="18" cy="9" r="2" />
                    <path d="M17 15a4 4 0 0 1 4 4v1" />
                </>
            )}

            {stat === "army" && (
                <>
                    <path d="M12 2 20 5v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3Z" />
                    <path d="m9 12 2 2 4-4" />
                </>
            )}
        </svg>
    );
}

export default StatIcon;
