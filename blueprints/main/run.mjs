import fs from "fs";
import path from "path";
import { baseBlueprints } from "../index.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

baseBlueprints.forEach(({ schema, controllers }) => {
  const controllerKey = Object.keys(controllers)[0];
  const title =
    controllers[controllerKey]?.split("/")?.pop()?.replace("Controller", "") ||
    "Title";
  const fetchUrl = `${controllerKey}`;
  const templatePath = path.join(__dirname, "./table.stub");
  let content = fs.readFileSync(templatePath, "utf-8");

  const columns = Object.entries(schema)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value.includes("selectable"))
    .map(([key]) => ({
      selector: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  const forms = Object.entries(schema)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value.includes("fillable"))
    .map(([key]) => ({
      col: "12",
      construction: {
        name: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        placeholder: `Masukkan ${key}...`,
      },
    }));

  content = content
    .replace(/{{ name }}/g, title)
    .replace(/{{ title }}/g, title)
    .replace(/{{ path }}/g, fetchUrl)
    .replace(/{{ columns }}/g, JSON.stringify(columns, null, 2))
    .replace(/{{ forms }}/g, JSON.stringify(forms, null, 6));

  const outputDir = path.join(__dirname, `../../pages/${title}`);
  const outputFile = path.join(outputDir, "index.tsx");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, content);
});
