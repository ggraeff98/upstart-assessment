import { spawn } from "child_process";

const tsc = spawn("npx tsc --watch --project tsconfig.server.json", {
  shell: true,
});

tsc.stdout.on("data", (data) => {
  const msg = data.toString();
  process.stdout.write(msg);

  if (msg.includes("Found 0 errors.")) {
    console.log("Build successful. Running tsc-esm-fix...");
    spawn("npx tsc-esm-fix --tsconfig=tsconfig.server.json", {
      shell: true,
      stdio: "inherit",
    });
  }
});

tsc.stderr.on("data", (data) => process.stderr.write(data));
