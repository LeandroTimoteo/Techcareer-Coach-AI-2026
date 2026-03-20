// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///C:/Users/leand/OneDrive/Ambiente%20de%20Trabalho/Projetos%202025/techcareer-coach-ai/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/leand/OneDrive/Ambiente%20de%20Trabalho/Projetos%202025/techcareer-coach-ai/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/leand/OneDrive/Ambiente%20de%20Trabalho/Projetos%202025/techcareer-coach-ai/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "c:\\Users\\leand\\OneDrive\\Ambiente de Trabalho\\Projetos 2025\\techcareer-coach-ai";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("\u{1F511} Vari\xE1veis carregadas pelo Vite:");
  console.log("   VITE_OLLAMA_API_KEY:", env.VITE_OLLAMA_API_KEY ? "OK" : "N\xC3O ENCONTRADA");
  console.log("   VITE_OLLAMA_API_URL:", env.VITE_OLLAMA_API_URL || "N\xC3O DEFINIDO");
  console.log("   VITE_MODEL_ID:", env.VITE_MODEL_ID || "N\xC3O DEFINIDO");
  return {
    server: {
      port: 3e3,
      host: "0.0.0.0",
      open: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:10000",
          changeOrigin: true
        }
      }
    },
    preview: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts: true
      // ✅ libera todos os domínios para evitar erros de bloqueio
    },
    plugins: [react(), ...!process.env.VITEST ? [tailwindcss()] : []],
    test: {
      globals: true,
      environment: "jsdom",
      server: {
        deps: {
          inline: ["@tailwindcss/vite"]
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, ".")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxsZWFuZFxcXFxPbmVEcml2ZVxcXFxBbWJpZW50ZSBkZSBUcmFiYWxob1xcXFxQcm9qZXRvcyAyMDI1XFxcXHRlY2hjYXJlZXItY29hY2gtYWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXGxlYW5kXFxcXE9uZURyaXZlXFxcXEFtYmllbnRlIGRlIFRyYWJhbGhvXFxcXFByb2pldG9zIDIwMjVcXFxcdGVjaGNhcmVlci1jb2FjaC1haVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYzovVXNlcnMvbGVhbmQvT25lRHJpdmUvQW1iaWVudGUlMjBkZSUyMFRyYWJhbGhvL1Byb2pldG9zJTIwMjAyNS90ZWNoY2FyZWVyLWNvYWNoLWFpL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICAvLyBcdUQ4M0RcdUREMEUgQ2FycmVnYSB0b2RhcyBhcyB2YXJpXHUwMEUxdmVpcyBkbyAuZW52LmxvY2FsXHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcclxuXHJcbiAgLy8gXHUyNzA1IExvZyBwYXJhIGRlYnVnIG5vIHRlcm1pbmFsXHJcbiAgY29uc29sZS5sb2coXCJcdUQ4M0RcdUREMTEgVmFyaVx1MDBFMXZlaXMgY2FycmVnYWRhcyBwZWxvIFZpdGU6XCIpO1xyXG4gIGNvbnNvbGUubG9nKFwiICAgVklURV9PTExBTUFfQVBJX0tFWTpcIiwgZW52LlZJVEVfT0xMQU1BX0FQSV9LRVkgPyBcIk9LXCIgOiBcIk5cdTAwQzNPIEVOQ09OVFJBREFcIik7XHJcbiAgY29uc29sZS5sb2coXCIgICBWSVRFX09MTEFNQV9BUElfVVJMOlwiLCBlbnYuVklURV9PTExBTUFfQVBJX1VSTCB8fCBcIk5cdTAwQzNPIERFRklOSURPXCIpO1xyXG4gIGNvbnNvbGUubG9nKFwiICAgVklURV9NT0RFTF9JRDpcIiwgZW52LlZJVEVfTU9ERUxfSUQgfHwgXCJOXHUwMEMzTyBERUZJTklET1wiKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiAzMDAwLFxyXG4gICAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgYWxsb3dlZEhvc3RzOiB0cnVlLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDoxMDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcHJldmlldzoge1xyXG4gICAgICBwb3J0OiA0MTczLFxyXG4gICAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgICAgYWxsb3dlZEhvc3RzOiB0cnVlLCAvLyBcdTI3MDUgbGliZXJhIHRvZG9zIG9zIGRvbVx1MDBFRG5pb3MgcGFyYSBldml0YXIgZXJyb3MgZGUgYmxvcXVlaW9cclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKSwgLi4uKCFwcm9jZXNzLmVudi5WSVRFU1QgPyBbdGFpbHdpbmRjc3MoKV0gOiBbXSldLFxyXG4gICAgdGVzdDoge1xyXG4gICAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxyXG4gICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBkZXBzOiB7XHJcbiAgICAgICAgICBpbmxpbmU6IFtcIkB0YWlsd2luZGNzcy92aXRlXCJdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi5cIiksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFKeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFFeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRzNDLFVBQVEsSUFBSSw4Q0FBb0M7QUFDaEQsVUFBUSxJQUFJLDJCQUEyQixJQUFJLHNCQUFzQixPQUFPLG1CQUFnQjtBQUN4RixVQUFRLElBQUksMkJBQTJCLElBQUksdUJBQXVCLGlCQUFjO0FBQ2hGLFVBQVEsSUFBSSxxQkFBcUIsSUFBSSxpQkFBaUIsaUJBQWM7QUFFcEUsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFFBQ2hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFBQTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUksQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBRTtBQUFBLElBQ2xFLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLE1BQU07QUFBQSxVQUNKLFFBQVEsQ0FBQyxtQkFBbUI7QUFBQSxRQUM5QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxHQUFHO0FBQUEsTUFDbEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
