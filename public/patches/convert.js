const fs = require("fs");

function normalizeName(name = "") {
  return name.replace("<br>", " ").replace(/^(out)$/gi, "Destination");
}

function normalizeFileName(fileName = "") {
  return fileName.replace(/\s/gi, "-").toLowerCase();
}

function normalizeTypeNameFromClassName(classes = "") {
  return classes
    .replace("node node-", "")
    .toUpperCase()
    .replace("OUT", "DESTINATION");
}

const index = {};

fs.readdirSync("./modulator", { withFileTypes: true }).forEach((file) => {
  if (!file.isFile()) return;

  const { name, nodes, nodeData } = JSON.parse(
    fs.readFileSync(`./modulator/${file.name}`, { encoding: "utf8" })
  );

  const obj = {
    name,
    nodes: nodes.map(({ id, name, classes, x, y }, index) => {
      return {
        id,
        name: normalizeName(name),
        type: normalizeTypeNameFromClassName(classes),
        position: { x, y },
        data: nodeData[index],
      };
    }),
    edges: nodes.reduce((acc, { id, inputs }) => {
      if (inputs.length > 0) {
        return acc.concat(
          inputs.map((sourceId) => ({
            sourceId,
            targetId: id,
          }))
        );
      }
      return acc;
    }, []),
  };

  const json = JSON.stringify(obj, null, 2);

  index[name] = file.name;

  fs.writeFileSync(`./${normalizeFileName(file.name)}`, json, {
    encoding: "utf8",
  });
});

const indexJson = JSON.stringify(index, null, 2);
fs.writeFileSync(`./index.json`, indexJson, { encoding: "utf8" });
