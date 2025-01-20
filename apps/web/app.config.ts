import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
   vite: {
      plugins: [
         tsConfigPaths({
            projects: ["./tsconfig.json"],
         }),
      ],
      resolve: {
         alias: {
           "@ui": path.resolve(__dirname, "../../packages/ui/src"),
         },
       },
   },
   react: {
      babel: {
         plugins: [
            [
               "babel-plugin-react-compiler",
               {
                  target: "19",
               },
            ],
         ],
      },
   },
});
