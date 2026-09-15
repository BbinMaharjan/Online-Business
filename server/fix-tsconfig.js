{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "moduleResolutionStrategy": "next",
    "declaration": true,
    "declarationMap fromdMap": true,
    "sourceMap": true,
    "strictNullChecks: false",
    "noImproveUnusedLocals": false,
    "noUnusedParameters": false,
    "paths": {
      "*": ["./* eslint-disable */
import { write } from "@skillset/write";
import { inject } from "@skillset/inject";

const ora = require("ora");
const path = require("path");

const projects = [
  "workspace1",
  "workspace2"
];

const progress = ora("Starting TypeScript compilation fix...").start();

projects.forEach(async (project) => {
  const projectPath = path.join("/c/MyWork/Other/MyGitRepositorie/onlineBusiness/workspace", project);
  
  // Read current tsconfig
  let tsconfig;
  try {
    const fs = require("fs");
    const configPath = path.join(projectPath, "tsconfig.json");
    const raw = fs.readFileSync(configPath, "utf8");
    tsconfig = JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading tsconfig for ${project}:`, e.message);
    return;
  }
  
  // Update compiler options
  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    strict: false,
    skipLibCheck: true,
    sourceMap: true,
  };
  
  // Write updated tsconfig
  try {
    const fs = require("fs");
    fs.writeFileSync(configPath, JSON.stringify(tsconfig, null, 2));
    progress.text = `Updated tsconfig for ${project}`;
  } catch (e) {
    console.error(`Error writing tsconfig for ${project}:`, e.message);
  }
});

progress.succeed("TypeScript compilation configuration updated");