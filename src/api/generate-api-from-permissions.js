// src/api/generate-api-from-permissions.js
const fs = require('fs');
const yaml = require('js-yaml');
const Handlebars = require('handlebars');

// デバッグ用のログ関数
const logDebug = (message, data = null) => {
  console.log(`[DEBUG] ${message}`);
  if (data !== null) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Handlebarsヘルパーを一括登録
Handlebars.registerHelper({
  capitalizeFirst: function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  namePascalCase: function (tableName) {
    logDebug(`Processing namePascalCase with input: ${tableName}`);
    if (typeof tableName !== 'string') {
      console.error('Error: namePascalCase received non-string:', tableName);
      return 'UnknownTable'; // エラー時のデフォルト値
    }
    const result = tableName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    logDebug(`namePascalCase output: ${result}`);
    return result;
  },
  'json-stringify': function (context) {
    return JSON.stringify(context, null, 2);
  }
});

const PERMISSIONS_FILE_PATH = './hasura/metadata/permission.yaml';
const API_TEMPLATE_FILE_PATH = './api-template.hbs';
const OUTPUT_API_FILE_PATH = './src/api/generated-api.ts';

function generateApiFromPermissions() {
  try {
    // YAMLファイルの読み込み
    logDebug(`Reading permissions file from: ${PERMISSIONS_FILE_PATH}`);
    const permissionsYaml = fs.readFileSync(PERMISSIONS_FILE_PATH, 'utf8');
    logDebug('Raw YAML content sample (first 200 chars):', permissionsYaml.substring(0, 200));

    // YAMLをパース
    logDebug('Parsing YAML content');
    const data = yaml.load(permissionsYaml);
    logDebug('Parsed YAML data structure:', data);

    // データのバリデーション
    logDebug('Validating parsed data');
    if (!data) {
      throw new Error('Parsed data is null or undefined');
    }
    if (!data.tables) {
      throw new Error('No "tables" key found in parsed data');
    }
    if (!Array.isArray(data.tables)) {
      throw new Error('"tables" is not an array');
    }
    logDebug(`Number of tables found: ${data.tables.length}`);

    // 各テーブルの詳細を検証
    data.tables.forEach((tableEntry, index) => {
      logDebug(`Inspecting table entry at index ${index}:`, tableEntry);
      if (!tableEntry.table) {
        throw new Error(`Table entry at index ${index} is missing "table" object`);
      }
      if (!tableEntry.table.name) {
        throw new Error(`Table entry at index ${index} is missing "name" property`);
      }
      logDebug(`Table name at index ${index}: ${tableEntry.table.name}`);
    });

    // Handlebarsテンプレートの読み込み・コンパイル
    logDebug(`Reading template file from: ${API_TEMPLATE_FILE_PATH}`);
    const templateSource = fs.readFileSync(API_TEMPLATE_FILE_PATH, 'utf8');
    logDebug('Template content sample (first 200 chars):', templateSource.substring(0, 200));
    
    logDebug('Compiling Handlebars template');
    const template = Handlebars.compile(templateSource);

    // APIコードの生成
    logDebug('Generating API code from template');
    const generatedApi = template(data);
    logDebug('Generated API code sample (first 200 chars):', generatedApi.substring(0, 200));

    // ファイルに書き込み
    logDebug(`Writing generated API to: ${OUTPUT_API_FILE_PATH}`);
    fs.writeFileSync(OUTPUT_API_FILE_PATH, generatedApi, 'utf8');
    console.log('API file generated successfully:', OUTPUT_API_FILE_PATH);
  } catch (error) {
    console.error('Error generating API file:', error.message);
    if (error.code === 'ENOENT') {
      console.error(`File not found: ${error.path}`);
    }
  }
}

generateApiFromPermissions();