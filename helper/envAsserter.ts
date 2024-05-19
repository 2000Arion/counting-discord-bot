import fs from "fs";
import path from "path";
import I18n from "../i18nConfig";

const envPath = path.join(__dirname, "../.env");

const assertEnv = () => {
  const envContent = fs.readFileSync(envPath, "utf-8");

  if (!envContent.includes("DATABASE_URL=")) {
    console.log(I18n.t("database_url_not_set"));
    process.exit(1);
  }

  if (!envContent.includes("TOKEN=")) {
    console.log(I18n.t("token_not_set"));
    process.exit(1);
  }

  if (!envContent.includes("PREFIX=")) {
    console.log(I18n.t("prefix_not_set"));
    process.exit(1);
  }
};

export default assertEnv;
