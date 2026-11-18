import { ComponentType } from "@/lib/data";

// Vite glob to import all raw source codes of lab components, ui, and hooks
const rawModules = import.meta.glob(
  [
    "/components/lab/**/*.tsx",
    "/components/ui/**/*.tsx",
    "/hooks/**/*.ts",
    "../components/lab/**/*.tsx",
    "../components/ui/**/*.tsx",
    "../hooks/**/*.ts",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

// Helper to normalize paths
function normalizePath(p: string): string {
  let cleaned = p.replace(/\\/g, "/");
  if (!cleaned.startsWith("/")) {
    cleaned = "/" + cleaned;
  }
  return cleaned;
}

export async function readFilePath(filePath: string): Promise<string> {
  const normalized = normalizePath(filePath);
  const content = rawModules[normalized];

  if (content !== undefined) {
    return content.trim();
  }

  // Fallback search by end of path (matches stripped or relative paths)
  const stripped = normalized.startsWith("/") ? normalized.slice(1) : normalized;
  const match = Object.keys(rawModules).find((k) => k.endsWith(stripped));
  if (match && rawModules[match] !== undefined) {
    return rawModules[match].trim();
  }

  throw new Error(`File not found or cannot be read: ${filePath}`);
}

export async function getFilePathAndConfig(item: ComponentType) {
  const isPrimitive = item.primitive !== false;

  const cleanSlug = item.slug.replace(/\s+/g, "");
  const filePath = isPrimitive
    ? `/components/lab/${cleanSlug}.tsx`
    : `/components/ui/${cleanSlug}.tsx`;

  const code = isPrimitive
    ? await readFilePath(filePath).catch((error) => {
        console.error(`Component file error:`, error.message);
        return `// ${item.name} - [${filePath}] component not found\n// Error: ${error.message}`;
      })
    : "";

  const twConfig = item.twConfig
    ? JSON.stringify(item.twConfig, null, 2)
    : undefined;
  const cssClass = item.cssClass;
  const uiLibrary = item.uiLibrary;

  let customHook: string | null = null;
  if (item.customHook) {
    const customHookPath = `/hooks/${item.customHook}.ts`;
    customHook = await readFilePath(customHookPath).catch((error) => {
      console.error(`Custom hook error:`, error.message);
      return `// Custom hook "${item.customHook}" not found in /hooks\n// Error: ${error.message}`;
    });
  }

  const exampleCodes = await Promise.all(
    item.example.map(async (ex) => {
      if (!ex.path)
        return { name: ex.name, code: "// Example filePath missing" };

      const examplePath = `/components/lab/examples/${cleanSlug}/${ex.path}.tsx`;

      const exampleCode = await readFilePath(examplePath).catch((error) => {
        console.error(`Example file error:`, error.message);
        return `// ${ex.name} - [${examplePath}] example not found\n// Error: ${error.message}`;
      });

      return {
        name: ex.name,
        code: exampleCode,
      };
    }),
  );

  return { code, twConfig, uiLibrary, cssClass, exampleCodes, customHook };
}
