// src/utils/config.js
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

// 读取 YAML 配置文件
const config = yaml.load(
    fs.readFileSync(path.resolve(__dirname, '../../config/application.yaml'), 'utf8')
);

export default config;