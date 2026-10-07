const vscode = require('vscode');
const server = require('./server.json');
exports.activate = context => {
    context.subscriptions.push(vscode.lm.registerMcpServerDefinitionProvider('tethered', {
        provideMcpServerDefinitions: () => [new vscode.McpStdioServerDefinition('Tethered', server.command, server.args)],
        resolveMcpServerDefinition: definition => definition
    }));
};