import { load } from 'js-yaml';

// 同步加载所有 YAML 配置文件
const yamlFiles = import.meta.glob('/Config/application.yaml', {
    query: '?raw',
    import: 'default',
    eager: true
});

// 根据环境选择配置文件
function getConfig() {
    const configFile = '/Config/application.yaml'
    return load(yamlFiles[configFile]);
}

export const config = getConfig();