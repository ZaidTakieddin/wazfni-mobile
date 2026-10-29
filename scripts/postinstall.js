import fs from "fs";
import path from "path";

console.log("Running postinstall script for react-native-reanimated-skeleton to support expo");

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Replace LinearGradient import and module path
    content = content.replace(/import LinearGradient/g, "import { LinearGradient }");
    content = content.replace(/react-native-linear-gradient/g, "expo-linear-gradient");

    fs.writeFileSync(filePath, content);
  } catch (error) {
    // Ignore errors for files that can't be processed
  }
}

function walkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log("Directory not found:", dir);
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".ts") ||
      file.endsWith(".jsx") ||
      file.endsWith(".tsx")
    ) {
      replaceInFile(filePath);
    }
  }
}

// Process the react-native-reanimated-skeleton package
const packagePath = "./node_modules/react-native-reanimated-skeleton";
walkDirectory(packagePath);

console.log("Postinstall script completed successfully");
