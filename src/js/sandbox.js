/**
 * Code Sandbox Module
 * Provides interactive code examples and live demos
 */

class CodeSandbox {
    constructor() {
        this.sandboxes = [];
        this.init();
    }

    init() {
        this.findSandboxes();
        this.createSandboxes();
    }

    findSandboxes() {
        // Find all code sandbox containers
        document.querySelectorAll('.code-sandbox').forEach(container => {
            this.sandboxes.push({
                element: container,
                language: container.dataset.language || 'abap',
                code: container.querySelector('code')?.textContent || ''
            });
        });
    }

    createSandboxes() {
        this.sandboxes.forEach(sandbox => {
            this.createSandbox(sandbox);
        });
    }

    createSandbox(sandbox) {
        const { element, language, code } = sandbox;

        element.innerHTML = `
            <div class="sandbox-header">
                <span class="sandbox-language">${language.toUpperCase()}</span>
                <div class="sandbox-actions">
                    <button class="sandbox-btn copy-btn" title="Code kopieren">
                        <span>📋</span>
                    </button>
                    <button class="sandbox-btn run-btn" title="Code ausführen">
                        <span>▶️</span>
                    </button>
                </div>
            </div>
            <div class="sandbox-editor">
                <textarea class="sandbox-code" spellcheck="false">${this.escapeHtml(code)}</textarea>
            </div>
            <div class="sandbox-output">
                <div class="output-header">Output</div>
                <pre class="output-content"></pre>
            </div>
        `;

        // Attach event listeners
        const copyBtn = element.querySelector('.copy-btn');
        const runBtn = element.querySelector('.run-btn');
        const textarea = element.querySelector('.sandbox-code');
        const output = element.querySelector('.output-content');

        copyBtn.addEventListener('click', () => {
            this.copyCode(textarea.value);
            copyBtn.innerHTML = '<span>✅</span>';
            setTimeout(() => {
                copyBtn.innerHTML = '<span>📋</span>';
            }, 2000);
        });

        runBtn.addEventListener('click', () => {
            this.runCode(textarea.value, language, output);
        });

        // Syntax highlighting simulation (basic)
        this.highlightCode(textarea, language);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async copyCode(code) {
        try {
            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    runCode(code, language, outputElement) {
        outputElement.textContent = 'Running...';

        // Simulate code execution based on language
        setTimeout(() => {
            let result;

            switch (language.toLowerCase()) {
                case 'abap':
                    result = this.simulateABAP(code);
                    break;
                case 'javascript':
                case 'js':
                    result = this.executeJavaScript(code);
                    break;
                case 'cds':
                    result = this.simulateCDS(code);
                    break;
                default:
                    result = 'Code execution not supported for this language.';
            }

            outputElement.textContent = result;
        }, 500);
    }

    simulateABAP(code) {
        // Simulate ABAP execution
        const lines = code.split('\n');
        const output = [];

        lines.forEach(line => {
            const trimmed = line.trim().toUpperCase();

            // Detect WRITE statements
            if (trimmed.startsWith('WRITE')) {
                const match = line.match(/WRITE[:\s]+['"](.+)['"]/i) ||
                             line.match(/WRITE[:\s]+(\S+)/i);
                if (match) {
                    output.push(match[1]);
                }
            }

            // Detect DATA declarations
            if (trimmed.startsWith('DATA')) {
                output.push(`Variable declared: ${line.split(':')[1]?.trim() || 'unknown'}`);
            }
        });

        return output.length > 0
            ? output.join('\n')
            : 'Code executed successfully. No output generated.';
    }

    executeJavaScript(code) {
        try {
            // Capture console.log output
            const logs = [];
            const originalLog = console.log;
            console.log = (...args) => logs.push(args.join(' '));

            // Execute the code
            eval(code);

            console.log = originalLog;

            return logs.length > 0
                ? logs.join('\n')
                : 'Code executed successfully. No output generated.';
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    simulateCDS(code) {
        // Simulate CDS view execution
        const output = [];

        if (code.includes('define view')) {
            output.push('CDS View definition parsed successfully.');
        }

        if (code.includes('@AbapCatalog')) {
            output.push('ABAP Catalog annotations found.');
        }

        if (code.includes('select from')) {
            const tableMatch = code.match(/select from\s+(\w+)/i);
            if (tableMatch) {
                output.push(`Data source: ${tableMatch[1]}`);
            }
        }

        return output.length > 0
            ? output.join('\n')
            : 'CDS view parsed. Ready for activation.';
    }

    highlightCode(textarea, language) {
        // Simple syntax highlighting effect
        textarea.addEventListener('input', () => {
            // In a real implementation, this would update a highlighted overlay
        });
    }
}

// Initialize code sandbox
document.addEventListener('DOMContentLoaded', () => {
    window.codeSandbox = new CodeSandbox();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeSandbox;
}
