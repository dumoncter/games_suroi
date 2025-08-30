import { mergeConfig, type UserConfig } from "vite";

import common from "./vite.common";

const config: UserConfig = {
    define: {
        API_URL: JSON.stringify(process.env.API_URL || "https://gamessuroi-production.up.railway.app/api"),
        DEBUG_CLIENT: false
    },
    build: {
        outDir: "dist",
        emptyOutDir: true
    }
};

export default mergeConfig(common, config);
