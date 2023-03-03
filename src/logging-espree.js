import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * @brief Toma un fichero de entrada con el código
 *  y un fichero de salida.
 * Si no se especifica, los logs se realizan por consola
 * y no se vuelcan en el fichero.
 * Devuelve el código del fichero de input.
 * @param inputFile Fichero de input
 * @param outputFile Fichero de output
 */
export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8')
  let output = addLogging(input);
  if (outputFile === undefined) {
      console.log(output);
      return;
  }
  await fs.writeFile(outputFile, output);
}

/**
 * @brief Añade logs a nodos que sean una función, ya sea de declaration,
 * como de expression o como de arrow expression.
 * @param code
 */
export function addLogging(code) {
  const ast = espree.parse(code, { ecmaVersion: 12, loc: true });
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression') {
          addBeforeCode(node);
      }
    }
  })
  return escodegen.generate(ast);
}

/**
 * @brief Añade información mediante logs a las funciones.
 * Incluye el número de línea y los argumentos pasados.
 * @param node El nodo que se está visitando  (una función en este caso)
 */
function addBeforeCode(node) {
  const name = node.id ? node.id.name: '<anonymous function>';
  let paramNames = "";
  if (node.params.length) {
    paramNames = "${" + node.params.map(param => param.name).join("}, ${") + "}";
  }
  const lineN = node.loc.start.line;
  const beforeCode = "console.log(`Entering " + name + "(" + paramNames + ") at line " + lineN + "`);";
  const beforeNodes = espree.parse(beforeCode, { ecmaVersion: 12 }).body;
  node.body.body = beforeNodes.concat(node.body.body);  
}